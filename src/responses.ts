import { SwaggerReference, SwaggerResponseObject, SwaggerSchemaObject } from ".";

export const Responses = {
    Success: (schema: SwaggerSchemaObject | SwaggerReference, description?: string): SwaggerResponseObject => {
        return {
            description: description ?? "Success",
            schema,
        };
    },
    BadRequest: { "$ref": "#/responses/BadRequest" },
    Unauthorized: { "$ref": "#/responses/Unauthorized" },
    NotFound: { "$ref": "#/responses/NotFound" },
    ServerError: { "$ref": "#/responses/ServerError" },
}