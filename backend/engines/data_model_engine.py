# Data Model Engine - Manages data models, fields, and relationships
from typing import Dict, List, Optional, Tuple, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid


class FieldType(str, Enum):
    TEXT = "text"
    NUMBER = "number"
    BOOLEAN = "boolean"
    DATE = "date"
    IMAGE = "image"
    FILE = "file"
    REFERENCE = "reference"
    LIST = "list"


class RelationshipType(str, Enum):
    ONE_TO_ONE = "one_to_one"
    ONE_TO_MANY = "one_to_many"
    MANY_TO_MANY = "many_to_many"


class DataField(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    field_type: FieldType
    required: bool = False
    default_value: Optional[Any] = None
    description: Optional[str] = None
    # For reference fields
    reference_model: Optional[str] = None
    relationship_type: Optional[RelationshipType] = None
    # For list fields
    list_item_type: Optional[FieldType] = None


class DataModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    fields: List[DataField] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DataModelEngine:
    """
    Data Model Engine handles creation and management of data models.
    
    Rules:
    - No circular references
    - Max 50 fields per model
    - Max 50 models per project
    """
    
    MAX_FIELDS_PER_MODEL = 50
    MAX_MODELS_PER_PROJECT = 50
    
    @staticmethod
    def create_model(name: str, description: Optional[str] = None) -> DataModel:
        """Create a new data model."""
        return DataModel(name=name, description=description)
    
    @staticmethod
    def add_field(
        model: DataModel,
        name: str,
        field_type: FieldType,
        required: bool = False,
        default_value: Any = None,
        description: Optional[str] = None,
        reference_model: Optional[str] = None,
        relationship_type: Optional[RelationshipType] = None
    ) -> Tuple[DataModel, bool, str]:
        """
        Add a field to a data model.
        Returns: (updated_model, success, message)
        """
        if len(model.fields) >= DataModelEngine.MAX_FIELDS_PER_MODEL:
            return model, False, f"Maximum {DataModelEngine.MAX_FIELDS_PER_MODEL} fields per model"
        
        # Check for duplicate field names
        if any(f.name == name for f in model.fields):
            return model, False, f"Field '{name}' already exists in model"
        
        # Validate reference field
        if field_type == FieldType.REFERENCE and not reference_model:
            return model, False, "Reference field requires reference_model"
        
        field = DataField(
            name=name,
            field_type=field_type,
            required=required,
            default_value=default_value,
            description=description,
            reference_model=reference_model,
            relationship_type=relationship_type
        )
        
        model.fields.append(field)
        model.updated_at = datetime.now(timezone.utc)
        
        return model, True, f"Field '{name}' added successfully"
    
    @staticmethod
    def remove_field(model: DataModel, field_name: str) -> Tuple[DataModel, bool, str]:
        """Remove a field from a data model."""
        original_count = len(model.fields)
        model.fields = [f for f in model.fields if f.name != field_name]
        
        if len(model.fields) == original_count:
            return model, False, f"Field '{field_name}' not found"
        
        model.updated_at = datetime.now(timezone.utc)
        return model, True, f"Field '{field_name}' removed"
    
    @staticmethod
    def update_field(
        model: DataModel,
        field_name: str,
        updates: Dict[str, Any]
    ) -> Tuple[DataModel, bool, str]:
        """Update a field in a data model."""
        for i, field in enumerate(model.fields):
            if field.name == field_name:
                for key, value in updates.items():
                    if hasattr(field, key):
                        setattr(field, key, value)
                model.updated_at = datetime.now(timezone.utc)
                return model, True, f"Field '{field_name}' updated"
        
        return model, False, f"Field '{field_name}' not found"
    
    @staticmethod
    def validate_models(models: List[DataModel]) -> Tuple[bool, List[str]]:
        """
        Validate a list of data models for circular references and other issues.
        Returns: (is_valid, list_of_errors)
        """
        errors = []
        
        # Check model count limit
        if len(models) > DataModelEngine.MAX_MODELS_PER_PROJECT:
            errors.append(f"Exceeds maximum of {DataModelEngine.MAX_MODELS_PER_PROJECT} models per project")
        
        model_names = {m.name for m in models}
        
        for model in models:
            # Check field count
            if len(model.fields) > DataModelEngine.MAX_FIELDS_PER_MODEL:
                errors.append(f"Model '{model.name}' exceeds {DataModelEngine.MAX_FIELDS_PER_MODEL} fields")
            
            # Validate reference fields
            for field in model.fields:
                if field.field_type == FieldType.REFERENCE:
                    if field.reference_model not in model_names:
                        errors.append(f"Model '{model.name}' references non-existent model '{field.reference_model}'")
        
        # Check for circular references (simple check)
        reference_graph = {}
        for model in models:
            refs = set()
            for field in model.fields:
                if field.field_type == FieldType.REFERENCE and field.reference_model:
                    refs.add(field.reference_model)
            reference_graph[model.name] = refs
        
        # DFS to detect cycles
        def has_cycle(node, visited, stack):
            visited.add(node)
            stack.add(node)
            for neighbor in reference_graph.get(node, set()):
                if neighbor not in visited:
                    if has_cycle(neighbor, visited, stack):
                        return True
                elif neighbor in stack:
                    return True
            stack.remove(node)
            return False
        
        visited = set()
        for model_name in reference_graph:
            if model_name not in visited:
                if has_cycle(model_name, visited, set()):
                    errors.append("Circular reference detected in data models")
                    break
        
        return len(errors) == 0, errors
    
    @staticmethod
    def get_model_schema(model: DataModel) -> Dict[str, Any]:
        """Get JSON schema representation of a data model."""
        schema = {
            "id": model.id,
            "name": model.name,
            "description": model.description,
            "fields": [
                {
                    "name": f.name,
                    "type": f.field_type.value,
                    "required": f.required,
                    "default": f.default_value,
                    "description": f.description,
                    "reference": f.reference_model,
                    "relationship": f.relationship_type.value if f.relationship_type else None
                }
                for f in model.fields
            ]
        }
        return schema
    
    @staticmethod
    def generate_default_models(project_type: str) -> List[DataModel]:
        """Generate default data models based on project type."""
        if project_type == "app":
            user_model = DataModelEngine.create_model("User", "Application user")
            DataModelEngine.add_field(user_model, "email", FieldType.TEXT, required=True)
            DataModelEngine.add_field(user_model, "name", FieldType.TEXT, required=True)
            DataModelEngine.add_field(user_model, "avatar", FieldType.IMAGE)
            DataModelEngine.add_field(user_model, "created_at", FieldType.DATE)
            
            session_model = DataModelEngine.create_model("Session", "User session")
            DataModelEngine.add_field(session_model, "user", FieldType.REFERENCE, reference_model="User", relationship_type=RelationshipType.ONE_TO_ONE)
            DataModelEngine.add_field(session_model, "token", FieldType.TEXT, required=True)
            DataModelEngine.add_field(session_model, "expires_at", FieldType.DATE)
            
            return [user_model, session_model]
        
        elif project_type == "website":
            page_model = DataModelEngine.create_model("Page", "Website page")
            DataModelEngine.add_field(page_model, "title", FieldType.TEXT, required=True)
            DataModelEngine.add_field(page_model, "slug", FieldType.TEXT, required=True)
            DataModelEngine.add_field(page_model, "content", FieldType.TEXT)
            DataModelEngine.add_field(page_model, "published", FieldType.BOOLEAN, default_value=False)
            
            return [page_model]
        
        else:  # both
            user_model = DataModelEngine.create_model("User", "Application user")
            DataModelEngine.add_field(user_model, "email", FieldType.TEXT, required=True)
            DataModelEngine.add_field(user_model, "name", FieldType.TEXT, required=True)
            
            content_model = DataModelEngine.create_model("Content", "User content")
            DataModelEngine.add_field(content_model, "title", FieldType.TEXT, required=True)
            DataModelEngine.add_field(content_model, "body", FieldType.TEXT)
            DataModelEngine.add_field(content_model, "author", FieldType.REFERENCE, reference_model="User", relationship_type=RelationshipType.ONE_TO_MANY)
            
            return [user_model, content_model]
