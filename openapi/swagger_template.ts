export const two_point_oh = {
        "swagger": "2.0",
        "info": {
          "title": "Airtable API Connector",
          "description": "Connect Airtable to Powerapps",
          "version": "1.0",
          "contact": {}
        },
        "host": "HOST_INSERTED_PROGRAMATICALLY",
        "basePath": "/",
        "schemes": [
          "https"
        ],
        "consumes": [],
        "produces": [],
        "paths": {
          "/api/airtable/customers": {
            "get": {
              "summary": "Get Customers",
              "operationId": "GetCustomers",
              "parameters": [],
              "responses": {
                "200": {
                  "description": "Result",
                  "schema": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "_id": {
                          "type": "string",
                          "description": "Airtable ID"
                        },
                        "Name": {
                          "type": "string",
                          "description": "name"
                        },
                        "Status": {
                          "type": "string",
                          "description": "name"
                        },
                        "CreatedBy": {
                          "type": "string",
                          "description": "createdByEmail"
                        }
                      }
                    }
                  }
                }
              }
            },
            "post": {
              "summary": "Create new Customer",
              "operationId": "CreateCustomer",
              "parameters": [
                {
                  "in": "body",
                  "name": "customer",
                  "description": "The customer to create.",
                  "schema": {
                    "type": "object",
                    "required": [
                      "name"
                    ],
                    "properties": {
                      "name": {
                        "type": "string"
                      },
                      "status": {
                        "type": "string"
                      }
                    }
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "Result",
                  "schema": {
                    "type": "object",
                    "properties": {
                      "_id": {
                        "type": "string",
                        "description": "id"
                      },
                      "Name": {
                        "type": "string",
                        "description": "name"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "definitions": {},
        "parameters": {},
        "responses": {},
        "securityDefinitions": {
          "oauth2_auth": {
            "type": "oauth2",
            "flow": "accessCode",
            "authorizationUrl": "https://login.windows.net/common/oauth2/authorize",
            "tokenUrl": "https://login.windows.net/common/oauth2/authorize",
            "scopes": {}
          }
        },
        "security": [
          {
            "oauth2_auth": []
          }
        ],
        "tags": [
          {
            "name": "airtable",
            "description": "Airtable connector"
          }
        ]
}