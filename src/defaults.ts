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
        schema: DefaultSchemas.SchemaError,
    },
    Unauthorized: {
        description: "Unauthorized",
        schema: DefaultSchemas.SchemaError,
    },
    NotFound: {
        description: "Not Found",
        schema: DefaultSchemas.SchemaError,
    },
    ServerError: {
        description: "Server Error",
        schema: DefaultSchemas.SchemaError,
    },
}

export const DefaultSwagger = {
    swagger: "2.0",
    info: {
        title: "Swagger API Defintition",
        description: "A swagger API (who's description probably should be changed)",
        version: "1.0.0",
    },
    schemes: ["$$SCHEME$$",],
    host: "$$HOST$$",
    basePath: "/",
    paths: {},
}
