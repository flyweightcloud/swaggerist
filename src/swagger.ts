type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]


export type SwaggerObject = {
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

export type SwaggerDefinitions = {
    [key: string]: object,
}

export type Security = {
    [key: string]: string[] | []
}

export type SecurityDefinitions = {
    [name: string]: SecuritySchemeObject
}

export type SecuritySchemeObject = {
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

export type SwaggerInfo = {
    title: string
    version: string
    description?: string
    termsofservice?: string
    license?: {
        name: string
        url?: string
    }
    contact?: {
        name?: string
        url?: string
        email?: string
    }
}

export type SwaggerReference = {
    [ref: string]: string
}

export type SwaggerExternalDocumentation = {
    url: string
    description?: string
}

export type SwaggerPath = {
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

export type SwaggerPathItemObject = RequireAtLeastOne<SwaggerPathItemObjectMethods, "get" | "post" | "put" | "delete" | "options" | "head" | "patch">

type SwaggerParameterInStrings = "query" | "header" | "path" | "cookie" | "body"
export type SwaggerParameterTypes = "integer" | "number" | "string" | "boolean" | "array" | "object" | "file"
export type SwaggerParameterFormats = "int64" | "int32" | "float" | "double" | "byte" | "binary" | "date" | "date-time" | "password"


export type SwaggerParameterObject = {
    name: string
    in: SwaggerParameterInStrings
    type?: string
    format?: string
    description?: string
    required?: boolean
    schema?: SwaggerSchemaObject 
}

export type SwaggerSchemaObject = {
    type?: string
    required?: string[]
    properties?: {
        [key: string]: SwaggerSchemaObject | SwaggerSchemaObjectProperties
    }
    items?: SwaggerSchemaObject
    definitions?: SwaggerDefinitions
}

export type SwaggerSchemaObjectProperties = {
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

export type SwaggerOperationObject = {
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

export type SwaggerResponseObject = {
  description?: string
  schema?: SwaggerSchemaObject | SwaggerReference
  headers?: SwaggerHeadersObject
  examples?: SwaggerExamplesObject
}

export type SwaggerResponses = {
    [statusCode: string | number]: SwaggerReference | SwaggerResponseObject
}

export type SwaggerHeadersObject = {
    [name: string]: {
        [key: string]: string
    }
}

export type SwaggerExamplesObject = {
    [mimetype: string]: {
        [key: string]: string
    }
}
