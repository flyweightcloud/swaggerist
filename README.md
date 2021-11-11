# Swaggerist

[![Tests](https://github.com/flyweightcloud/swaggerist/actions/workflows/test.yml/badge.svg)](https://github.com/flyweightcloud/swaggerist/actions/workflows/test.yml)

Swaggerist is an opinionated and programmatic way to quickly build Swagger definitions
for JSON API's. (Targetting Azure at the moment, so Swagger 2.0)

## Why do it this way

Instead of trying to build a DSL or abstraction on top of Swagger, this library
conforms to the Swagger definition and simply provides helpers to make some
common tasks more concise.

## Usage

`npm install --save @flyweight.cloud/swaggerist`


Simple example of a Swagger definition for an authenticated Azure Function API:

```typescript
import Swaggerist, { buildBodyParams, buildPathParams, buildSchema, Responses, SwaggerSecuritySchemes } from "@flyweight.cloud/swaggerist"

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
        name: { type: "string", description: "Users Name", required: true },
        email: { type: "string", description: "Users Email" }
      })
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
        id: { type: "string", description: "Users Id" }
      })
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
    swagger.generate({ scheme: "https", host: "localhost", base_path: '/api/my_az_function' }),
    null, 2
  )
)
```


Outputs:

```json
{
  "swagger": "2.0",
  "info": {
    "title": "My Swagger Def",
    "description": "Example description of the Swagger Definition",
    "version": "1.0.0"
  },
  "schemes": [
    "https"
  ],
  "host": "localhost",
  "basePath": "/",
  "paths": {
    "/api/my_az_function/user": {
      "post": {
        "operationId": "create_user",
        "parameters": [
          {
            "in": "body",
            "name": "user",
            "schema": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Users Name"
                },
                "email": {
                  "type": "string",
                  "description": "Users Email"
                }
              },
              "required": [
                "name"
              ]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "The ID of the user"
                }
              }
            }
          },
          "500": {
            "$ref": "#/responses/ServerError"
          }
        }
      }
    },
    "/api/my_az_function/user/{id}": {
      "get": {
        "operationId": "get_user",
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "type": "string",
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "The ID of the user"
                },
                "name": {
                  "type": "string",
                  "description": "The name of the user"
                },
                "email": {
                  "type": "string",
                  "description": "The email of the user"
                }
              }
            }
          },
          "404": {
            "$ref": "#/responses/NotFound"
          }
        }
      }
    }
  },
  "securityDefinitions": {
    "oauth": {
      "type": "oauth2",
      "flow": "accessCode",
      "authorizationUrl": "https://login.windows.net/common/oauth2/authorize",
      "tokenUrl": "https://login.windows.net/common/oauth2/authorize",
      "scopes": {}
    }
  },
  "security": [
    {
      "oauth": []
    }
  ]
}
```
