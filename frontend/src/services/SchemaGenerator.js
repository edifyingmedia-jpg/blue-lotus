// frontend/src/services/SchemaGenerator.js

/**
 * SchemaGenerator.js
 * ------------------
 * Converts extracted data models into backend-ready schemas.
 *
 * Output format:
 * {
 *   models: [
 *     {
 *       name: "Character",
 *       fields: [
 *         { name: "name", type: "string", required: true },
 *         { name: "age", type: "number", required: false }
 *       ]
 *     }
 *   ]
 * }
 */

export function generateSchema(dataModels) {
    const models = dataModels.map(model => ({
        name: model.name,
        fields: model.fields.map(field => ({
            name: field.field,
            type: normalizeType(field.type),
            required: isRequired(field.type)
        }))
    }));

    return { models };
}

/**
 * Normalize field types into backend-safe types
 */
function normalizeType(type) {
    const t = type.toLowerCase();

    if (["string", "text"].includes(t)) return "string";
    if (["number", "int", "float", "double"].includes(t)) return "number";
    if (["bool", "boolean"].includes(t)) return "boolean";
    if (["date", "datetime"].includes(t)) return "date";

    return "string"; // fallback
}

/**
 * Detect required fields
 * Syntax example:
 *   name: string!
 */
function isRequired(type) {
    return type.trim().endsWith("!");
}
