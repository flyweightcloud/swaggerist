import * as SwaggerParser from "@apidevtools/swagger-parser"
import { OpenAPI } from "openapi-types"

import Swaggerist, { Responses } from "../src/index"
import * as response from "./fixtures/openweathermap_response.json"
import * as expected from "./fixtures/openweathermap_expected.json"
import { convertJsonToSchema } from "../src/convert_schema"

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
        const swaggerSchema = convertJsonToSchema(response, { includeExample: true })
        expect(swaggerSchema).toStrictEqual(expected)

        swagger.addRoute("get", "/weather", {
            responses: { 200: Responses.Success(swaggerSchema) }
        })
        const swaggerDef = swagger.generate("2.0", {scheme:"https", base_path:"/api"}) as object as OpenAPI.Document
        expect(swaggerDef.info.title).toBe("Test Swagger")
        await SwaggerParser.validate(swaggerDef)
    })

    test("should work and allow you to not include an example", async () => {
        const swaggerSchema = convertJsonToSchema(response, { includeExample: false })

        expect(swaggerSchema.example).toBeUndefined

        swagger.addRoute("get", "/current_weather", {
            responses: { 200: Responses.Success(swaggerSchema) }
        })

        const swaggerDef = swagger.generate("2.0", {scheme:"https", base_path:"/api"}) as object as OpenAPI.Document
        await SwaggerParser.validate(swaggerDef)
    })

})

