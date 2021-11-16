import * as SwaggerParser from "@apidevtools/swagger-parser"
import { OpenAPI } from "openapi-types"

import Swaggerist, { Responses, SwaggerSchemaObject } from "../src/index"
import { quickSchema } from "../src/quick_schema";
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
        const swaggerSchema = quickSchema(response, { includeExample: true }) as SwaggerSchemaObject
        expect(swaggerSchema).toStrictEqual(expected)

        swagger.addPath("/weather", {
            "get": { responses: { 200: Responses.Success(swaggerSchema) } }
        })

        await SwaggerParser.validate(swagger.generate("2.0", { scheme: "https" }) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

    test("should work and allow you to not include an example", async () => {
        const swaggerSchema = quickSchema(response, { includeExample: false })

        expect(swaggerSchema.example).toBeUndefined

        swagger.addPath("/weather", {
            "get": { responses: { 200: Responses.Success(swaggerSchema) } }
        })

        await SwaggerParser.validate(swagger.generate("2.0", { scheme: "https" }) as object as OpenAPI.Document)
        expect(true).toBe(true) // Swagger is valid if we get here
    })

})



describe("Building a schema object", () => {
    test("should work and include an example", async () => {
        const user = {
            name: "Customer Name",
            age: 24,
            address: {
                street: "123 Main Street",
                city: "Anywhere",
                state: "Nebraska",
                zip: {
                    $example: 12345,
                    $type: "string",
                    $description: "Zip code",
                    $required: true,
                }
            }
        }
        const swaggerSchema = quickSchema(user, { includeExample: true })
        console.log(JSON.stringify(swaggerSchema, null, 2))
        expect(true).toBe(true)

    })
})