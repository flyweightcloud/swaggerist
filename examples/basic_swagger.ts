import Swaggerist, { buildBodyParams, buildPathParams, buildSchema, Responses, SwaggerSecuritySchemes, } from "../src"

const swaggerDetails = {
    info: {
        title: "My Swagger Def",
        description: "Example description of the Swagger Definition",
        version: "1.0.0",
    },
}

const swagger = Swaggerist.create(swaggerDetails)

// Add a security policy for Microsoft Oauth
swagger.addSecurityPolicy("oauth", SwaggerSecuritySchemes.MicrosoftOauth())

swagger.addPath("$$BASE_PATH$$/user", {
    post: {
        operationId: "create_user",
        parameters: [...buildBodyParams("user",
            {
                name: { type: "string", description: "Users Name", required: true, },
                email: { type: "string", description: "Users Email", },
            }),
        ],
        responses: {
            "200": Responses.Success(buildSchema({
                id: { type: "string", description: "The ID of the user", },
            })),
            "500": Responses.ServerError,
        },
    },
})

swagger.addPath("$$BASE_PATH$$/user/{id}", {
    get: {
        operationId: "get_user",
        parameters: [...buildPathParams(
            {
                id: { type: "string", description: "Users Id", },
            }),
        ],
        responses: {
            "200": Responses.Success(buildSchema({
                id: { type: "string", description: "The ID of the user", },
                name: { type: "string", description: "The name of the user", },
                email: { type: "string", description: "The email of the user", },
            })),
            "404": Responses.NotFound,
        },
    },
})

console.log(
    JSON.stringify(
        swagger.generate({ scheme: "https", host: "localhost", base_path: "/api/my_az_function", }),
        null, 2
    )
)