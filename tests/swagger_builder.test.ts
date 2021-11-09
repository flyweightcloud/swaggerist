import * as SwaggerParser  from '@apidevtools/swagger-parser'

import SwaggerBuilder, { buildPathParams, buildSchema, Responses, SwaggerBuilderDefinition, SwaggerSecuritySchemes } from '../src/index'
import { traverseAndReplace } from '../src/utils'

const testSwaggerOptions: SwaggerBuilderDefinition = {
  info: {
    title: 'Test Swagger',
    description: 'Test Swagger Description',
    version: '1.0.0',
  },
}

describe("Basic swagger builder functionality", () => {
  test("should just work", async () => {
    const swagger = new SwaggerBuilder(testSwaggerOptions)
    const swaggerDoc = await SwaggerParser.validate(swagger.generate({schema:'https'}) as any)
    expect(true).toBe(true) // Swagger is valid if we get here
  })

  test("should allow us to add paths", async () => {
    const swagger = new SwaggerBuilder(testSwaggerOptions)
    swagger.addSecurityPolicy('oauth', SwaggerSecuritySchemes.MicrosoftOauth())

    swagger.addPath('/test/{id}', {
      get: {
        operationId: 'test',
        parameters: [ ...buildPathParams({id: {type: 'string', description: 'userId'}}) ],
        responses: {
          '200': Responses.Success(buildSchema({ id: 'string' })),
          '401': Responses.Unauthorized
        }
      }
    })
    console.log(JSON.stringify(swagger.generate({schema: "https"}), null, 2))
    const swaggerDoc = await SwaggerParser.validate(swagger.generate({schema: 'https'}) as any)
    expect(true).toBe(true) // Swagger is valid if we get here
  })
  test.todo("Should throw errors on colliding operationIds")

})

describe("Utility functions", () => {
  const testTree = {
    url: 'https://$$HOST$$/path',
    "$$FOO$$_get": "get_$$FOO$$",
    nested: {
      "$$FOO$$_post": "post_$$FOO$$",
      arr: [
        "$$FOO$$Array",
        "$$FOO$$Array",
      ],
      "arrOfObj_$$FOO$$": [
        {
          "$$FOO$$_put": "put_$$FOO$$",
        }
      ]
    },
    200: {
      foo: "$$FOO$$"
    }

  }

  test("tree find and replace should work", async () => {
    const test = traverseAndReplace(testTree, {'host': 'localhost', foo: 'baz'})
    console.log(JSON.stringify(test, null, 2))
    expect(test.url).toBe('https://localhost/path')
    expect(test['baz_get']).toBe('get_baz')
    expect(test['nested']['baz_post']).toBe('post_baz')
    expect(test['nested']['arr'][0]).toBe('bazArray')
    expect(test['nested']['arr'][1]).toBe('bazArray')
    expect(test['nested']['arrOfObj_baz'][0]['baz_put']).toBe('put_baz')
  })
})