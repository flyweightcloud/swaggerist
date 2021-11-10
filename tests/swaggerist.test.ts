import * as SwaggerParser  from "@apidevtools/swagger-parser"

import SwaggerBuilder, { buildBodyParams, buildPathParams, buildSchema, Responses, SwaggerBuilderDefinition, SwaggerSecuritySchemes, } from "../src/index"

const testSwaggerOptions: SwaggerBuilderDefinition = {
    info: {
        title: "Test Swagger",
        description: "Test Swagger Description",
        version: "1.0.0",
    },
}

describe("Basic swagger builder functionality", () => {
    test("should just work", async () => {
        const swagger = new SwaggerBuilder(testSwaggerOptions)
        await SwaggerParser.validate(swagger.generate({schema:"https",}) as string)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

    test("should allow us to add paths", async () => {
        const swagger = new SwaggerBuilder(testSwaggerOptions)
        swagger.addSecurityPolicy("oauth", SwaggerSecuritySchemes.MicrosoftOauth())

        swagger.addPath("/test/{id}", {
            get: {
                operationId: "test",
                parameters: [...buildPathParams({ id: { type: "string", description: "userId", },}), ...buildBodyParams("user", {userId: {type: "string", description: "userId",},}),],
                responses: {
                    "200": Responses.Success(buildSchema({
                        id: { type: "string", description: "The ID of the user", },
                        name: { type: "string", description: "The name of the user", },
                    })),
                },
            },
        })
        await SwaggerParser.validate(swagger.generate({schema: "https",}) as string)
        expect(true).toBe(true) // Swagger is valid if we get here
    })
    test("Should throw errors on colliding operationIds", () => {
        const swagger = new SwaggerBuilder(testSwaggerOptions)
        swagger.addPath("/test/{id}", {
            get: {
                operationId: "test",
                parameters: [ ...buildPathParams({id: {type: "string", description: "userId",},}), ],
                responses: {
                    "200": Responses.Success(buildSchema({
                        id: {type: "string", description: "The ID of the user",},
                        name: {type: "string", description: "The name of the user",},
                    })),
                },
            },
        })

        try {
            swagger.addPath("/test2/{id}", {
                get: {
                    operationId: "test",
                    parameters: [ ...buildPathParams({id: {type: "string", description: "userId",},}), ],
                    responses: {
                        "200": Responses.Success(buildSchema({
                            id: {type: "string", description: "The ID of the user",},
                            name: {type: "string", description: "The name of the user",},
                        })),
                    },
                },
            })
        } catch (e) {
            expect(e.message).toBe("OperationId 'test' already exists")
        }
    })

})