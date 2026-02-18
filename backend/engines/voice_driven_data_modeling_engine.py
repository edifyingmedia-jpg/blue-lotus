# Voice-Driven Data Modeling Engine - Create and modify data models via voice
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import re


class FieldType(str, Enum):
    TEXT = "text"
    NUMBER = "number"
    BOOLEAN = "boolean"
    DATE = "date"
    IMAGE = "image"
    FILE = "file"
    REFERENCE = "reference"
    LIST = "list"


class DataModelAction(str, Enum):
    CREATE_MODEL = "create_model"
    ADD_FIELD = "add_field"
    REMOVE_FIELD = "remove_field"
    UPDATE_FIELD = "update_field"
    DELETE_MODEL = "delete_model"
    EXPLAIN_MODEL = "explain_model"
    LIST_MODELS = "list_models"


class VoiceDataModelField(BaseModel):
    """Field definition from voice command."""
    name: str
    field_type: FieldType = FieldType.TEXT
    required: bool = False
    default_value: Optional[Any] = None
    reference_model: Optional[str] = None


class VoiceDataModel(BaseModel):
    """Data model created from voice command."""
    model_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    fields: List[VoiceDataModelField] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DataModelResult(BaseModel):
    """Result of voice data modeling action."""
    success: bool
    action: DataModelAction
    message: str
    voice_message: str
    model: Optional[VoiceDataModel] = None
    requires_confirmation: bool = False
    confirmation_prompt: Optional[str] = None


class VoiceDrivenDataModelingEngine:
    """
    Voice-Driven Data Modeling Engine.
    
    Responsibilities:
    - Create, modify, and delete data models using voice commands
    - Add, remove, or update fields
    - Define relationships between models
    - Explain data model structure when asked
    
    Supported Commands:
    - "Create a data model called Product with name, price, and image fields"
    - "Add a boolean field called isActive to the User model"
    - "Remove the description field from Product"
    - "Explain the Order model to me"
    
    Field Types Supported:
    - text, number, boolean, date, image, file, reference, list
    
    Rules:
    - Must confirm destructive changes
    - Must validate model integrity
    - Must not create circular references
    """
    
    # In-memory model storage (mocked)
    _models: Dict[str, VoiceDataModel] = {}
    
    # Field type detection patterns
    FIELD_TYPE_PATTERNS = {
        FieldType.TEXT: ["text", "string", "name", "title", "description", "email", "phone", "address"],
        FieldType.NUMBER: ["number", "price", "amount", "quantity", "count", "age", "rating", "score"],
        FieldType.BOOLEAN: ["boolean", "bool", "active", "enabled", "visible", "published", "is"],
        FieldType.DATE: ["date", "datetime", "created", "updated", "birthday", "deadline", "time"],
        FieldType.IMAGE: ["image", "photo", "picture", "avatar", "thumbnail", "icon"],
        FieldType.FILE: ["file", "attachment", "document", "pdf"],
        FieldType.REFERENCE: ["reference", "ref", "foreign", "belongs", "has"],
        FieldType.LIST: ["list", "array", "items", "tags", "categories"]
    }
    
    @classmethod
    def parse_data_model_command(cls, command: str) -> Tuple[DataModelAction, Dict[str, Any]]:
        """Parse voice command to determine data model action."""
        command_lower = command.lower()
        params = {}
        
        # Detect action
        if any(kw in command_lower for kw in ["create a data model", "create a model", "add a model", "new model"]):
            action = DataModelAction.CREATE_MODEL
            # Extract model name
            name_match = re.search(r'(?:called|named)\s+(\w+)', command_lower)
            if name_match:
                params["model_name"] = name_match.group(1).title()
            else:
                # Try to extract from pattern "create a Product model"
                pattern_match = re.search(r'(?:create|add|new)\s+(?:a\s+)?(\w+)\s+(?:data\s+)?model', command_lower)
                if pattern_match:
                    params["model_name"] = pattern_match.group(1).title()
            
            # Extract fields
            params["fields"] = cls._extract_fields(command)
            
        elif any(kw in command_lower for kw in ["add a field", "add field", "add a new field"]):
            action = DataModelAction.ADD_FIELD
            # Extract field name and type
            field_match = re.search(r'(?:add\s+(?:a\s+)?)?(?:(\w+)\s+)?field\s+(?:called\s+)?(\w+)', command_lower)
            if field_match:
                params["field_type"] = field_match.group(1)
                params["field_name"] = field_match.group(2)
            
            # Extract target model
            model_match = re.search(r'to\s+(?:the\s+)?(\w+)\s*(?:model)?', command_lower)
            if model_match:
                params["model_name"] = model_match.group(1).title()
                
        elif any(kw in command_lower for kw in ["remove field", "delete field", "remove the"]):
            action = DataModelAction.REMOVE_FIELD
            field_match = re.search(r'(?:remove|delete)\s+(?:the\s+)?(\w+)\s+field', command_lower)
            if field_match:
                params["field_name"] = field_match.group(1)
            
            model_match = re.search(r'from\s+(?:the\s+)?(\w+)', command_lower)
            if model_match:
                params["model_name"] = model_match.group(1).title()
                
        elif any(kw in command_lower for kw in ["delete model", "remove model", "delete the model"]):
            action = DataModelAction.DELETE_MODEL
            model_match = re.search(r'(?:delete|remove)\s+(?:the\s+)?(\w+)\s*(?:model)?', command_lower)
            if model_match:
                params["model_name"] = model_match.group(1).title()
                
        elif any(kw in command_lower for kw in ["explain", "describe", "what is", "tell me about"]):
            action = DataModelAction.EXPLAIN_MODEL
            model_match = re.search(r'(?:explain|describe|about)\s+(?:the\s+)?(\w+)\s*(?:model)?', command_lower)
            if model_match:
                params["model_name"] = model_match.group(1).title()
                
        elif any(kw in command_lower for kw in ["list models", "show models", "what models", "my models"]):
            action = DataModelAction.LIST_MODELS
        else:
            action = DataModelAction.LIST_MODELS
        
        return action, params
    
    @classmethod
    def _extract_fields(cls, command: str) -> List[VoiceDataModelField]:
        """Extract field definitions from voice command."""
        fields = []
        command_lower = command.lower()
        
        # Pattern: "with name, price, and image fields"
        with_match = re.search(r'with\s+(.+?)(?:\s+fields?)?$', command_lower)
        if with_match:
            field_text = with_match.group(1)
            # Split by comma or "and"
            field_names = re.split(r',\s*|\s+and\s+', field_text)
            
            for name in field_names:
                name = name.strip()
                if name:
                    field_type = cls._detect_field_type(name)
                    fields.append(VoiceDataModelField(
                        name=name.replace(" ", "_"),
                        field_type=field_type
                    ))
        
        return fields
    
    @classmethod
    def _detect_field_type(cls, field_name: str) -> FieldType:
        """Detect field type from name."""
        field_lower = field_name.lower()
        
        for field_type, keywords in cls.FIELD_TYPE_PATTERNS.items():
            if any(kw in field_lower for kw in keywords):
                return field_type
        
        return FieldType.TEXT
    
    @classmethod
    async def execute_command(
        cls,
        command: str,
        project_id: str = None,
        existing_models: List[Dict[str, Any]] = None
    ) -> DataModelResult:
        """Execute a voice data modeling command."""
        action, params = cls.parse_data_model_command(command)
        
        if action == DataModelAction.CREATE_MODEL:
            return cls._create_model(params)
        elif action == DataModelAction.ADD_FIELD:
            return cls._add_field(params)
        elif action == DataModelAction.REMOVE_FIELD:
            return cls._remove_field(params)
        elif action == DataModelAction.DELETE_MODEL:
            return cls._delete_model(params)
        elif action == DataModelAction.EXPLAIN_MODEL:
            return cls._explain_model(params, existing_models)
        elif action == DataModelAction.LIST_MODELS:
            return cls._list_models(existing_models)
        
        return DataModelResult(
            success=False,
            action=action,
            message="I didn't understand that data model command.",
            voice_message="I didn't understand. Try saying create a data model called Product with name and price fields."
        )
    
    @classmethod
    def _create_model(cls, params: Dict[str, Any]) -> DataModelResult:
        """Create a new data model."""
        model_name = params.get("model_name")
        fields = params.get("fields", [])
        
        if not model_name:
            return DataModelResult(
                success=False,
                action=DataModelAction.CREATE_MODEL,
                message="Please specify a name for the data model.",
                voice_message="What should I call this data model?"
            )
        
        # Add default id field
        if not any(f.name == "id" for f in fields):
            fields.insert(0, VoiceDataModelField(name="id", field_type=FieldType.TEXT, required=True))
        
        model = VoiceDataModel(name=model_name, fields=fields)
        cls._models[model.model_id] = model
        
        field_names = [f.name for f in fields]
        fields_str = ", ".join(field_names)
        
        return DataModelResult(
            success=True,
            action=DataModelAction.CREATE_MODEL,
            message=f"✅ Created **{model_name}** data model with fields: {fields_str}",
            voice_message=f"Done! I created the {model_name} data model with {len(fields)} fields: {fields_str}.",
            model=model
        )
    
    @classmethod
    def _add_field(cls, params: Dict[str, Any]) -> DataModelResult:
        """Add a field to an existing model."""
        model_name = params.get("model_name")
        field_name = params.get("field_name")
        field_type_str = params.get("field_type", "text")
        
        if not model_name or not field_name:
            return DataModelResult(
                success=False,
                action=DataModelAction.ADD_FIELD,
                message="Please specify both the field name and target model.",
                voice_message="Which field should I add, and to which model?"
            )
        
        # Find model
        model = None
        for m in cls._models.values():
            if m.name.lower() == model_name.lower():
                model = m
                break
        
        if not model:
            # Create new model with this field
            model = VoiceDataModel(
                name=model_name,
                fields=[
                    VoiceDataModelField(name="id", field_type=FieldType.TEXT, required=True),
                    VoiceDataModelField(name=field_name, field_type=cls._detect_field_type(field_type_str or field_name))
                ]
            )
            cls._models[model.model_id] = model
            
            return DataModelResult(
                success=True,
                action=DataModelAction.ADD_FIELD,
                message=f"Created **{model_name}** model and added **{field_name}** field.",
                voice_message=f"I created the {model_name} model and added the {field_name} field.",
                model=model
            )
        
        # Add field to existing model
        field_type = cls._detect_field_type(field_type_str or field_name)
        model.fields.append(VoiceDataModelField(name=field_name, field_type=field_type))
        
        return DataModelResult(
            success=True,
            action=DataModelAction.ADD_FIELD,
            message=f"Added **{field_name}** ({field_type.value}) to **{model_name}**.",
            voice_message=f"Done! I added the {field_name} field to {model_name}.",
            model=model
        )
    
    @classmethod
    def _remove_field(cls, params: Dict[str, Any]) -> DataModelResult:
        """Remove a field from a model (requires confirmation)."""
        model_name = params.get("model_name")
        field_name = params.get("field_name")
        
        if not model_name or not field_name:
            return DataModelResult(
                success=False,
                action=DataModelAction.REMOVE_FIELD,
                message="Please specify the field name and model.",
                voice_message="Which field should I remove, and from which model?"
            )
        
        return DataModelResult(
            success=True,
            action=DataModelAction.REMOVE_FIELD,
            message=f"⚠️ Are you sure you want to remove **{field_name}** from **{model_name}**? This might affect screens using this field.",
            voice_message=f"Are you sure you want to remove the {field_name} field from {model_name}? Say yes to confirm.",
            requires_confirmation=True,
            confirmation_prompt=f"Remove {field_name} from {model_name}?"
        )
    
    @classmethod
    def _delete_model(cls, params: Dict[str, Any]) -> DataModelResult:
        """Delete a data model (requires confirmation)."""
        model_name = params.get("model_name")
        
        if not model_name:
            return DataModelResult(
                success=False,
                action=DataModelAction.DELETE_MODEL,
                message="Which model should I delete?",
                voice_message="Which data model should I delete?"
            )
        
        return DataModelResult(
            success=True,
            action=DataModelAction.DELETE_MODEL,
            message=f"⚠️ Are you sure you want to delete the **{model_name}** model? This will remove all data associated with it.",
            voice_message=f"Are you sure you want to delete the {model_name} model? This cannot be undone. Say yes to confirm.",
            requires_confirmation=True,
            confirmation_prompt=f"Delete {model_name} model?"
        )
    
    @classmethod
    def _explain_model(cls, params: Dict[str, Any], existing_models: List[Dict[str, Any]] = None) -> DataModelResult:
        """Explain a data model."""
        model_name = params.get("model_name")
        
        # Check in-memory models first
        model = None
        for m in cls._models.values():
            if m.name.lower() == (model_name or "").lower():
                model = m
                break
        
        if model:
            fields_text = "\n".join([f"• **{f.name}**: {f.field_type.value}" for f in model.fields])
            fields_voice = ", ".join([f"{f.name} as {f.field_type.value}" for f in model.fields])
            
            return DataModelResult(
                success=True,
                action=DataModelAction.EXPLAIN_MODEL,
                message=f"**{model.name} Model**\n\nFields:\n{fields_text}",
                voice_message=f"The {model.name} model has {len(model.fields)} fields: {fields_voice}."
            )
        
        # Check existing models from project
        if existing_models:
            for em in existing_models:
                if em.get("name", "").lower() == (model_name or "").lower():
                    fields = em.get("fields", [])
                    fields_text = "\n".join([f"• **{f.get('name')}**: {f.get('type', 'text')}" for f in fields])
                    
                    return DataModelResult(
                        success=True,
                        action=DataModelAction.EXPLAIN_MODEL,
                        message=f"**{em.get('name')} Model**\n\nFields:\n{fields_text}",
                        voice_message=f"The {em.get('name')} model has {len(fields)} fields."
                    )
        
        return DataModelResult(
            success=False,
            action=DataModelAction.EXPLAIN_MODEL,
            message=f"I couldn't find a model called **{model_name}**.",
            voice_message=f"I couldn't find a model called {model_name}. Would you like to create it?"
        )
    
    @classmethod
    def _list_models(cls, existing_models: List[Dict[str, Any]] = None) -> DataModelResult:
        """List all data models."""
        all_models = []
        
        # Add in-memory models
        for m in cls._models.values():
            all_models.append(f"• **{m.name}** ({len(m.fields)} fields)")
        
        # Add existing models
        if existing_models:
            for em in existing_models:
                name = em.get("name")
                if name and not any(name in model for model in all_models):
                    all_models.append(f"• **{name}** ({len(em.get('fields', []))} fields)")
        
        if not all_models:
            return DataModelResult(
                success=True,
                action=DataModelAction.LIST_MODELS,
                message="You don't have any data models yet. Say 'Create a data model called...' to add one.",
                voice_message="You don't have any data models yet. Would you like to create one?"
            )
        
        models_text = "\n".join(all_models)
        models_voice = ", ".join([m.replace("• **", "").replace("**", "").split(" (")[0] for m in all_models])
        
        return DataModelResult(
            success=True,
            action=DataModelAction.LIST_MODELS,
            message=f"**Your Data Models**\n\n{models_text}",
            voice_message=f"You have {len(all_models)} data models: {models_voice}."
        )
    
    @classmethod
    def get_supported_commands(cls) -> List[Dict[str, Any]]:
        """Get list of supported data modeling commands."""
        return [
            {
                "action": "create_model",
                "examples": [
                    "Create a data model called Product with name, price, and image fields",
                    "Add a new User model with email and password"
                ],
                "description": "Create a new data model with specified fields"
            },
            {
                "action": "add_field",
                "examples": [
                    "Add a boolean field called isActive to the User model",
                    "Add description to Product"
                ],
                "description": "Add a field to an existing model"
            },
            {
                "action": "remove_field",
                "examples": [
                    "Remove the description field from Product",
                    "Delete the age field from User"
                ],
                "description": "Remove a field from a model (requires confirmation)"
            },
            {
                "action": "explain_model",
                "examples": [
                    "Explain the Order model to me",
                    "What fields does User have?"
                ],
                "description": "Get an explanation of a model's structure"
            }
        ]
