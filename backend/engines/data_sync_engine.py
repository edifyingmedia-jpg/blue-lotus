# Data Sync Engine - Sync UI with backend data and handle CRUD operations
from typing import Dict, List, Optional, Any, Callable
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import asyncio


class SyncMode(str, Enum):
    REALTIME = "realtime"  # WebSocket/SSE
    POLLING = "polling"  # Periodic fetch
    MANUAL = "manual"  # On-demand only
    OPTIMISTIC = "optimistic"  # Update UI before server confirms


class ConflictResolution(str, Enum):
    SERVER_WINS = "server_wins"
    CLIENT_WINS = "client_wins"
    MERGE = "merge"
    PROMPT_USER = "prompt_user"


class SyncState(str, Enum):
    SYNCED = "synced"
    PENDING = "pending"
    SYNCING = "syncing"
    CONFLICT = "conflict"
    ERROR = "error"


class DataRecord(BaseModel):
    """A single data record with sync metadata."""
    record_id: str
    data: Dict[str, Any]
    sync_state: SyncState = SyncState.SYNCED
    local_version: int = 1
    server_version: int = 1
    last_synced: Optional[datetime] = None
    pending_changes: Dict[str, Any] = {}


class SyncConfig(BaseModel):
    """Configuration for data synchronization."""
    config_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    connection_id: str
    resource_name: str
    sync_mode: SyncMode = SyncMode.MANUAL
    conflict_resolution: ConflictResolution = ConflictResolution.SERVER_WINS
    polling_interval_ms: int = 30000  # 30 seconds
    batch_size: int = 50
    retry_attempts: int = 3


class SyncResult(BaseModel):
    """Result of a sync operation."""
    success: bool
    records_synced: int = 0
    records_failed: int = 0
    conflicts: List[str] = []
    errors: List[str] = []
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DataSyncEngine:
    """
    Data Sync Engine.
    
    Responsibilities:
    - Sync UI with backend data
    - Handle CRUD operations
    - Manage offline data
    - Handle sync conflicts
    - Support optimistic updates
    """
    
    # In-memory cache for sync state
    _sync_cache: Dict[str, Dict[str, DataRecord]] = {}
    
    @classmethod
    async def create_record(
        cls,
        config: SyncConfig,
        data: Dict[str, Any],
        api_connector: Any = None
    ) -> DataRecord:
        """Create a new record with sync support."""
        record_id = data.get("id", str(uuid.uuid4()))
        
        record = DataRecord(
            record_id=record_id,
            data=data,
            sync_state=SyncState.PENDING,
            local_version=1,
            server_version=0,
            pending_changes=data
        )
        
        # Store in cache
        cache_key = f"{config.project_id}:{config.resource_name}"
        if cache_key not in cls._sync_cache:
            cls._sync_cache[cache_key] = {}
        cls._sync_cache[cache_key][record_id] = record
        
        # If optimistic mode, return immediately and sync in background
        if config.sync_mode == SyncMode.OPTIMISTIC:
            asyncio.create_task(cls._sync_record_to_server(config, record, "create", api_connector))
            record.sync_state = SyncState.SYNCING
        
        return record
    
    @classmethod
    async def update_record(
        cls,
        config: SyncConfig,
        record_id: str,
        changes: Dict[str, Any],
        api_connector: Any = None
    ) -> DataRecord:
        """Update a record with sync support."""
        cache_key = f"{config.project_id}:{config.resource_name}"
        
        record = cls._sync_cache.get(cache_key, {}).get(record_id)
        if not record:
            record = DataRecord(
                record_id=record_id,
                data={},
                sync_state=SyncState.PENDING
            )
            if cache_key not in cls._sync_cache:
                cls._sync_cache[cache_key] = {}
            cls._sync_cache[cache_key][record_id] = record
        
        # Apply changes locally
        record.data.update(changes)
        record.pending_changes.update(changes)
        record.local_version += 1
        record.sync_state = SyncState.PENDING
        
        # If optimistic mode, update immediately
        if config.sync_mode == SyncMode.OPTIMISTIC:
            asyncio.create_task(cls._sync_record_to_server(config, record, "update", api_connector))
            record.sync_state = SyncState.SYNCING
        
        return record
    
    @classmethod
    async def delete_record(
        cls,
        config: SyncConfig,
        record_id: str,
        api_connector: Any = None
    ) -> bool:
        """Delete a record with sync support."""
        cache_key = f"{config.project_id}:{config.resource_name}"
        
        record = cls._sync_cache.get(cache_key, {}).get(record_id)
        if record:
            record.sync_state = SyncState.PENDING
            record.pending_changes = {"_deleted": True}
            
            if config.sync_mode == SyncMode.OPTIMISTIC:
                asyncio.create_task(cls._sync_record_to_server(config, record, "delete", api_connector))
        
        return True
    
    @classmethod
    async def _sync_record_to_server(
        cls,
        config: SyncConfig,
        record: DataRecord,
        operation: str,
        api_connector: Any
    ) -> bool:
        """Sync a record to the server."""
        try:
            # This would use the api_connector to make the actual API call
            # For now, simulate success
            await asyncio.sleep(0.1)  # Simulate network delay
            
            record.sync_state = SyncState.SYNCED
            record.server_version = record.local_version
            record.last_synced = datetime.now(timezone.utc)
            record.pending_changes = {}
            
            return True
        except Exception as e:
            record.sync_state = SyncState.ERROR
            return False
    
    @classmethod
    async def sync_all(
        cls,
        config: SyncConfig,
        api_connector: Any = None
    ) -> SyncResult:
        """Sync all pending records for a resource."""
        cache_key = f"{config.project_id}:{config.resource_name}"
        records = cls._sync_cache.get(cache_key, {})
        
        synced = 0
        failed = 0
        errors = []
        
        for record_id, record in records.items():
            if record.sync_state in [SyncState.PENDING, SyncState.ERROR]:
                try:
                    operation = "delete" if record.pending_changes.get("_deleted") else "update"
                    success = await cls._sync_record_to_server(config, record, operation, api_connector)
                    if success:
                        synced += 1
                    else:
                        failed += 1
                except Exception as e:
                    failed += 1
                    errors.append(f"Record {record_id}: {str(e)}")
        
        return SyncResult(
            success=failed == 0,
            records_synced=synced,
            records_failed=failed,
            errors=errors
        )
    
    @classmethod
    def get_pending_changes(cls, config: SyncConfig) -> List[DataRecord]:
        """Get all records with pending changes."""
        cache_key = f"{config.project_id}:{config.resource_name}"
        records = cls._sync_cache.get(cache_key, {})
        
        return [
            r for r in records.values()
            if r.sync_state in [SyncState.PENDING, SyncState.ERROR]
        ]
    
    @classmethod
    def get_sync_status(cls, config: SyncConfig) -> Dict[str, Any]:
        """Get sync status for a resource."""
        cache_key = f"{config.project_id}:{config.resource_name}"
        records = cls._sync_cache.get(cache_key, {})
        
        status_counts = {
            SyncState.SYNCED.value: 0,
            SyncState.PENDING.value: 0,
            SyncState.SYNCING.value: 0,
            SyncState.CONFLICT.value: 0,
            SyncState.ERROR.value: 0,
        }
        
        for record in records.values():
            status_counts[record.sync_state.value] += 1
        
        return {
            "total_records": len(records),
            "status_counts": status_counts,
            "has_pending": status_counts[SyncState.PENDING.value] > 0,
            "has_errors": status_counts[SyncState.ERROR.value] > 0,
            "has_conflicts": status_counts[SyncState.CONFLICT.value] > 0
        }
    
    @classmethod
    async def resolve_conflict(
        cls,
        config: SyncConfig,
        record_id: str,
        resolution: ConflictResolution,
        server_data: Optional[Dict[str, Any]] = None
    ) -> DataRecord:
        """Resolve a sync conflict."""
        cache_key = f"{config.project_id}:{config.resource_name}"
        record = cls._sync_cache.get(cache_key, {}).get(record_id)
        
        if not record:
            raise ValueError(f"Record {record_id} not found")
        
        if resolution == ConflictResolution.SERVER_WINS:
            if server_data:
                record.data = server_data
            record.pending_changes = {}
            record.sync_state = SyncState.SYNCED
            
        elif resolution == ConflictResolution.CLIENT_WINS:
            # Keep local changes, mark for re-sync
            record.sync_state = SyncState.PENDING
            
        elif resolution == ConflictResolution.MERGE:
            if server_data:
                # Merge server data with local changes
                merged = {**server_data, **record.pending_changes}
                record.data = merged
            record.sync_state = SyncState.PENDING
        
        return record
    
    @classmethod
    def clear_cache(cls, config: SyncConfig):
        """Clear sync cache for a resource."""
        cache_key = f"{config.project_id}:{config.resource_name}"
        if cache_key in cls._sync_cache:
            del cls._sync_cache[cache_key]
