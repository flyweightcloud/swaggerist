export interface SwaggerObject {
    swagger: string
    info: SwaggerInfo
    host: string
    basePath: string
    schemes: string[]
    consumes?: string[]
    produces?: string[]
    paths?: SwaggerPath
    securityDefinitions?: SecurityDefinitions
    security?: Security[]
    definitions?: SwaggerDefinitions
    responses?: SwaggerResponses
}

export interface SwaggerDefinitions {
    [key: string]: any,
}

export interface Security {
    [key: string]: string[] | []
}

export interface SecurityDefinitions {
    [name: string]: SecuritySchemeObject
}

export interface SecuritySchemeObject {
    type: string
    description?: string
    name?: string
    in?: string
    flow?: string
    authorizationUrl?: string
    tokenUrl?: string
    scopes?: {
        [name: string]: string
    }
}

export interface SwaggerInfo {
    title: string
    version: string
    description?: string
    termsofservice?: string
    license?: {
        name: string
        url: string
    }
    contact?: {
        name: string
        url: string
        email: string
    }
}

export interface SwaggerReference {
    [ref: string]: string
}

export interface SwaggerExternalDocumentation {
    url: string
    description?: string
}

export interface SwaggerPath {
    [key: string]: SwaggerPathItemObject
}

export interface SwaggerPathItemObject {
    [method: string]: SwaggerOperationObject
    parameters?: SwaggerParameterObject | SwaggerReference
}

export interface SwaggerParameterObject {
    name: string
    in: string
    type?: string
    description?: string
    required?: boolean
    schema?: SwaggerSchemaObject 
}

export interface SwaggerSchemaObject {
    type?: string
    required?: string[]
    properties?: {
        [key: string]: any
    }
    items?: SwaggerSchemaObject
    definitions?: any
}

export interface SwaggerOperationObject {
        description?: string
        summary?: string
        tags?: string[]
        operationId?: string
        consumes?: string[]
        produces?: string[]
        schemes?: string[]
        deprecated?: boolean
        externaldocs?: SwaggerExternalDocumentation
        parameters?: SwaggerParameterObject[] | SwaggerReference[]
        responses?: SwaggerResponses
}

export interface SwaggerResponseObject {
  description?: string
  schema?: SwaggerSchemaObject | SwaggerReference
  headers?: SwaggerHeadersObject
  examples?: SwaggerExamplesObject
}

export interface SwaggerResponses {
    [statusCode: string | number]: SwaggerReference | SwaggerResponseObject
}

export interface SwaggerHeadersObject {
    [name: string]: {
        [key: string]: string
    }
}

export interface SwaggerExamplesObject {
    [mimetype: string]: {
        [key: string]: string
    }
}
