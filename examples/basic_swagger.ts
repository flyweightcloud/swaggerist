import Swaggerist, { bodyParamBuilder, pathParamBuilder, Responses, schemaBuilder, SwaggerSecuritySchemes } from "../src"

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

const userJson = {
    id: 1234,
    email: "mark@flyweight.cloud",
    name: "Mark",
    address: {
        street: "123 Main St",
        city: "Atlanta",
        state: "GA",
        zip: "12345",
    }
}

swagger.post("/user", {
    operationId: "create_user",
    parameters: [...bodyParamBuilder("user", userJson)],
    responses: {
        "200": Responses.Success(schemaBuilder(userJson)),
        "500": Responses.ServerError,
    },
})

swagger.get("/users", {
    operationId: "get_users",
    responses: {
        "200": Responses.Success(schemaBuilder([userJson])),
        "404": Responses.NotFound,
    },
})

swagger.get("/user/{id}", {
    operationId: "get_user",
    parameters: [...pathParamBuilder(
        {
            id: { type: "string", description: "Users Id" },
        }),
    ],
    responses: {
        "200": Responses.Success(schemaBuilder(userJson)),
        "404": Responses.NotFound,
    },
})

console.log(
    JSON.stringify(
        swagger.generate("2.0", { scheme: "https", host: "localhost", base_path: "/api/my_az_function" }),
        null, 2
    )
)