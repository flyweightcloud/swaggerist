# Swaggerist

[![Tests](https://github.com/flyweightcloud/swaggerist/actions/workflows/test.yml/badge.svg)](https://github.com/flyweightcloud/swaggerist/actions/workflows/test.yml)
[![Docs](https://img.shields.io/badge/Docs-Typedoc-brightgreen)](https://flyweightcloud.github.io/swaggerist/)

Swaggerist is an opinionated and programmatic way to quickly build Swagger definitions
for JSON API's. (Targetting Azure at the moment, so Swagger 2.0)

Pairs well with FlyWeight's OpenRoute framework for building Swagger API's on Azure

## Build from JSON examples

Instead of building a Swagger Schema by hand, Swaggerist allows
you to provide an example of the expected API output and builds
a schema based on it.

## Usage

`npm install --save @flyweight.cloud/swaggerist`


Simple example of a Swagger definition for an authenticated Azure Function API:

```typescript
import Swaggerist, { bodyParamBuilder, pathParamBuilder, Responses, schemaBuilder, SwaggerSecuritySchemes } from "@flyweight.cloud/swaggerist"

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
```

Generated Swagger file:

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
  "basePath": "/api/my_az_function",
  "paths": {
    "/user": {
      "post": {
        "operationId": "create_user",
        "parameters": [
          {
            "in": "body",
            "name": "user",
            "schema": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "integer",
                  "format": "int32"
                },
                "email": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "address": {
                  "type": "object",
                  "properties": {
                    "street": {
                      "type": "string"
                    },
                    "city": {
                      "type": "string"
                    },
                    "state": {
                      "type": "string"
                    },
                    "zip": {
                      "type": "string"
                    }
                  }
                }
              },
              "example": {
                "id": 1234,
                "email": "mark@flyweight.cloud",
                "name": "Mark",
                "address": {
                  "street": "123 Main St",
                  "city": "Atlanta",
                  "state": "GA",
                  "zip": "12345"
                }
              }
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
                  "type": "integer",
                  "format": "int32"
                },
                "email": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "address": {
                  "type": "object",
                  "properties": {
                    "street": {
                      "type": "string"
                    },
                    "city": {
                      "type": "string"
                    },
                    "state": {
                      "type": "string"
                    },
                    "zip": {
                      "type": "string"
                    }
                  }
                }
              },
              "example": {
                "id": 1234,
                "email": "mark@flyweight.cloud",
                "name": "Mark",
                "address": {
                  "street": "123 Main St",
                  "city": "Atlanta",
                  "state": "GA",
                  "zip": "12345"
                }
              }
            }
          },
          "500": {
            "description": "Server Error",
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "code": {
                  "type": "integer"
                }
              }
            }
          }
        }
      }
    },
    "/users": {
      "get": {
        "operationId": "get_users",
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer",
                    "format": "int32"
                  },
                  "email": {
                    "type": "string"
                  },
                  "name": {
                    "type": "string"
                  },
                  "address": {
                    "type": "object",
                    "properties": {
                      "street": {
                        "type": "string"
                      },
                      "city": {
                        "type": "string"
                      },
                      "state": {
                        "type": "string"
                      },
                      "zip": {
                        "type": "string"
                      }
                    }
                  }
                }
              },
              "example": [
                {
                  "id": 1234,
                  "email": "mark@flyweight.cloud",
                  "name": "Mark",
                  "address": {
                    "street": "123 Main St",
                    "city": "Atlanta",
                    "state": "GA",
                    "zip": "12345"
                  }
                }
              ]
            }
          },
          "404": {
            "description": "Not Found",
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "code": {
                  "type": "integer"
                }
              }
            }
          }
        }
      }
    },
    "/user/{id}": {
      "get": {
        "operationId": "get_user",
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "type": "string",
            "description": "Users Id"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "integer",
                  "format": "int32"
                },
                "email": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "address": {
                  "type": "object",
                  "properties": {
                    "street": {
                      "type": "string"
                    },
                    "city": {
                      "type": "string"
                    },
                    "state": {
                      "type": "string"
                    },
                    "zip": {
                      "type": "string"
                    }
                  }
                }
              },
              "example": {
                "id": 1234,
                "email": "mark@flyweight.cloud",
                "name": "Mark",
                "address": {
                  "street": "123 Main St",
                  "city": "Atlanta",
                  "state": "GA",
                  "zip": "12345"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "code": {
                  "type": "integer"
                }
              }
            }
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
