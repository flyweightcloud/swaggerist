type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]


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
    [key: string]: object,
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

type SwaggerPathItemObjectMethods = {
  get?: SwaggerOperationObject
  post?: SwaggerOperationObject
  put?: SwaggerOperationObject
  delete?: SwaggerOperationObject
  options?: SwaggerOperationObject
  head?: SwaggerOperationObject
  patch?: SwaggerOperationObject
  parameters?: SwaggerParameterObject | SwaggerReference
}

export type SwaggerPathItemObject = RequireAtLeastOne<SwaggerPathItemObjectMethods, 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch'>

type SwaggerParameterInStrings = 'query' | 'header' | 'path' | 'cookie' | 'body'
export type SwaggerParameterTypes = 'integer' | 'number' | 'string' | 'boolean' | 'array' | 'object' | 'file'
export type SwaggerParameterFormats = 'int64' | 'int32' | 'float' | 'double' | 'byte' | 'binary' | 'date' | 'date-time' | 'password'


export interface SwaggerParameterObject {
    name: string
    in: SwaggerParameterInStrings
    type?: string
    format?: string
    description?: string
    required?: boolean
    schema?: SwaggerSchemaObject 
}

export interface SwaggerSchemaObject {
    type?: string
    required?: string[]
    properties?: {
        [key: string]: SwaggerSchemaObject | SwaggerSchemaObjectProperties
    }
    items?: SwaggerSchemaObject
    definitions?: SwaggerDefinitions
}

export interface SwaggerSchemaObjectProperties {
  type: string
  format?: string
  title?: string
  description?: string
  default?: SwaggerSchemaObject
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number | boolean
  minimum?: number
  exclusiveMinimum?: number | boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  properties?: SwaggerSchemaObject
  enum?: string[] | number[] | boolean[]
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
