import * as SwaggerParser from "@apidevtools/swagger-parser"
import { OpenAPI } from "openapi-types"

import Swaggerist, { bodyParamBuilder, buildPathParams, queryParamBuilder, Responses, schemaBuilder, SwaggerSecuritySchemes } from "../src/index"

const testSwaggerOptions = {
    info: {
        title: "Test Swagger",
        description: "Test Swagger Description",
        version: "1.0.0",
    },
}

describe("An ideal world", () => {
    const exampleQuery = {
        id: 1234,
        email: {
            type: "string",
        }
    }
    const exampleResponse = {
        id: 1234,
        name: "John Doe",
        $email: {
            example: "john@yahoo.com",
            type: "string",
            description: "Email of the user",
        }
    }
    test("where swagger just works", async () => {
        const swagger = Swaggerist.create(testSwaggerOptions)
        swagger.addSecurityPolicy("oauth", SwaggerSecuritySchemes.MicrosoftOauth())
        swagger.addPath("/user/find", {
            get: {
                operationId: "findUser",
                parameters: [ ...queryParamBuilder(exampleQuery) ],
                responses: {
                    "200": Responses.Success(schemaBuilder(exampleResponse)),
                    default: Responses.Error,
                },
            },
        })

        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https"}) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })
});


describe("Basic swagger builder functionality", () => {
    test("should just work", async () => {
        const swagger = Swaggerist.create(testSwaggerOptions)
        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https"}) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

    test("should allow us to add paths", async () => {
        const swagger = Swaggerist.create(testSwaggerOptions)
        swagger.addSecurityPolicy("oauth", SwaggerSecuritySchemes.MicrosoftOauth())

        swagger.addPath("/test/{id}", {
            post: {
                operationId: "test",
                parameters: [...buildPathParams({ id: { type: "string", description: "userId" }}), ...bodyParamBuilder("user", {userId: {type: "string", description: "userId"}})],
                responses: {
                    "200": Responses.Success(schemaBuilder({
                        id: 12345,
                        name: "A Users Name"
                    })),
                },
            },
        })
        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https"}) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

    test("Should throw errors on colliding operationIds", () => {
        const swagger = Swaggerist.create(testSwaggerOptions)
        swagger.addPath("/test/{id}", {
            get: {
                operationId: "test",
                parameters: [ ...buildPathParams({id: {type: "string", description: "userId"}}) ],
                responses: {
                    "200": Responses.Success(schemaBuilder({
                        id: 12345,
                        name: "A Users Name"
                    })),
                },
            },
        })

        try {
            swagger.addPath("/test2/{id}", {
                get: {
                    operationId: "test",
                    parameters: [ ...buildPathParams({id: {type: "string", description: "userId"}}) ],
                    responses: {
                        "200": Responses.Success(schemaBuilder({
                            id: 12345,
                            name: "A Users Name"
                        })),
                    },
                },
            })
        } catch (e) {
            expect(e.message).toBe("OperationId 'test' already exists")
        }
    })

})
