import { SwaggerReference, SwaggerResponseObject, SwaggerSchemaObject, JSONSchemaObject, DefaultResponses } from ".";

export const Responses = {
    Success: (schema: SwaggerSchemaObject | JSONSchemaObject | SwaggerReference, description?: string): SwaggerResponseObject => {
        return {
            description: description ?? "Success",
            schema,
        };
    },
    BadRequest: DefaultResponses.BadRequest,
    Unauthorized: DefaultResponses.Unauthorized,
    NotFound: DefaultResponses.NotFound,
    ServerError: DefaultResponses.ServerError,
    Error: DefaultResponses.ServerError,
}