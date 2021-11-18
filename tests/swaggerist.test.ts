import * as SwaggerParser from "@apidevtools/swagger-parser"
import { OpenAPI } from "openapi-types"

import Swaggerist, { bodyParamBuilder, pathParamBuilder, queryParamBuilder, Responses, schemaBuilder, SwaggerSecuritySchemes } from "../src/index"

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
        swagger.addRoute("get", "/user/find", {
            operationId: "findUser",
            parameters: [...queryParamBuilder(exampleQuery)],
            responses: {
                "200": Responses.Success(schemaBuilder(exampleResponse)),
                default: Responses.Error,
            },
        })

        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https", base_path:"/api"}) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })
});


describe("Basic swagger builder functionality", () => {
    test("should just work", async () => {
        const swagger = Swaggerist.create(testSwaggerOptions)
        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https", base_path:"/api"}) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

    test("adding paths", async () => {
        const swagger = Swaggerist.create(testSwaggerOptions)
        swagger.addSecurityPolicy("oauth", SwaggerSecuritySchemes.MicrosoftOauth())

        swagger.addRoute("post", "/test/{id}", {
            operationId: "test",
            parameters: [...pathParamBuilder({ id: "userId" }), ...bodyParamBuilder("user", { userId: { type: "string", description: "userId" } })],
            responses: {
                "200": Responses.Success(schemaBuilder({
                    id: 12345,
                    name: "A Users Name"
                })),
            },
        })
        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https", base_path:"/api"}) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

    test("adding paths with multiple methods", async () => {
        const swagger = Swaggerist.create(testSwaggerOptions)
        swagger.addSecurityPolicy("oauth", SwaggerSecuritySchemes.MicrosoftOauth())

        swagger.addRoute("post", "/test", {
            responses: {
                "200": Responses.Success(schemaBuilder({
                    id: 12345,
                    name: "A Users Name"
                })),
            },
        })
        swagger.addRoute("get", "/test", {
            responses: {
                "200": Responses.Success(schemaBuilder({
                    id: 12345,
                    name: "A Users Name"
                })),
            },
        })
        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https", base_path:"/api"}) as object as OpenAPI.Document)
        expect(swagger.swaggerDoc.paths["/test"]["get"]).toBeDefined()
        expect(swagger.swaggerDoc.paths["/test"]["post"]).toBeDefined()
        expect(true).toBe(true) // Swagger is valid if we get here
    })

    test("Should throw errors on colliding operationIds", () => {
        const swagger = Swaggerist.create(testSwaggerOptions)
        swagger.addRoute("get", "/test/{id}", {
            operationId: "test",
            parameters: [...pathParamBuilder({ id: "userId" }) ],
            responses: {
                "200": Responses.Success(schemaBuilder({
                    id: 12345,
                    name: "A Users Name"
                })),
            },
        })

        try {
            swagger.addRoute("get", "/test2/{id}", {
                operationId: "test",
                parameters: [...pathParamBuilder({ id: "userId" }) ],
                responses: {
                    "200": Responses.Success(schemaBuilder({
                        id: 12345,
                        name: "A Users Name"
                    })),
                },
            })
        } catch (e) {
            expect(e.message).toBe("OperationId 'test' already exists")
        }
    })

})
