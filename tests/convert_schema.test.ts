import * as SwaggerParser from "@apidevtools/swagger-parser"
import { OpenAPI } from "openapi-types"

import Swaggerist, { Responses, SwaggerSchemaObject } from "../src/index"
import { convertJsonToSchema } from "../src/convert_schema";
import * as response from "./fixtures/openweathermap_response.json"
import * as expected from "./fixtures/openweathermap_expected.json"

const testSwaggerOptions = {
    info: {
        title: "Test Swagger",
        description: "Test Swagger Description",
        version: "1.0.0",
    },
}
const swagger = Swaggerist.create(testSwaggerOptions)

describe("Conversion of Json to a schema object", () => {
    test("should work and include an example", async () => {
        const swaggerSchema = convertJsonToSchema(response, { includeExample: true }) as SwaggerSchemaObject
        expect(swaggerSchema).toStrictEqual(expected)

        swagger.addRoute("get", "/weather", {
            responses: { 200: Responses.Success(swaggerSchema) }
        })

        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https", base_path:"/api"}) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

    test("should work and allow you to not include an example", async () => {
        const swaggerSchema = convertJsonToSchema(response, { includeExample: false })

        expect(swaggerSchema.example).toBeUndefined

        swagger.addRoute("get", "/weather2", {
            responses: { 200: Responses.Success(swaggerSchema) }
        })

        await SwaggerParser.validate(swagger.generate("2.0", {scheme:"https", base_path:"/api"}) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

})

describe("Building a schema object", () => {
    test("outputting a schema with an example", async () => {
        const swaggerSchema = convertJsonToSchema(response, { includeExample: true })
        expect(swaggerSchema).toStrictEqual(expected)
    });

    test("overriding a field", async () => {
        const user = {
            name: "Customer Name",
            age: 24,
            address: {
                street: "123 Main Street",
                city: "Anywhere",
                state: "Nebraska",
                // Allow for overriding with a preceding "$"
                $zip: {
                    example: 12345,
                    type: "string",
                    description: "Zip code",
                    required: true,
                }
            }
        }
        const swaggerSchema = convertJsonToSchema(user, { includeExample: true })

        // Should let us override any field with our own type and example
        expect(swaggerSchema.properties.address.properties.zip.type).toBe("string")

    })

    test("handling an array", async () => {
        const user = [{
            name: "Customer Name",
            email: "customer@domain.com",
        }]
        const swaggerSchema = convertJsonToSchema(user, { includeExample: true })

        // Should let us override any field with our own type and example
        expect(swaggerSchema.type).toBe("array")
        expect(swaggerSchema.items).toBeDefined()
        expect(swaggerSchema.items.type).toBe("object")
        expect(swaggerSchema.example).toStrictEqual(user)
    })
})