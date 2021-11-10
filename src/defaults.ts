export const DefaultSchemas = {
    SchemaError: {
        type: "object",
        properties: {
            message: {
                type: "string",
            },
            code: {
                type: "integer",
            },
        },
    },
}

export const DefaultResponses = {
    BadRequest: {
        description: "BadRequest",
        schema: {
            "$ref": "#/definitions/SchemaError",
        },
    },
    Unauthorized: {
        description: "Unauthorized",
        schema: {
            "$ref": "#/definitions/SchemaError",
        },
    },
    NotFound: {
        description: "Not Found",
        schema: {
            "$ref": "#/definitions/SchemaError",
        },
    },
    ServerError: {
        description: "Server Error",
        schema: {
            "$ref": "#/definitions/SchemaError",
        },
    },
}