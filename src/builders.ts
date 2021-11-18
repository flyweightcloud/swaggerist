import { DefaultSwagger } from "."
import { convertJsonToParams } from "./convert_params"
import { convertJsonToSchema } from "./convert_schema"
import { SwaggerParameterObject, SwaggerSchemaObject, SwaggerObject } from "./swagger"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pathParamBuilder = (paramsExample: any): SwaggerParameterObject[] => {
    return convertJsonToParams("path", paramsExample)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const queryParamBuilder = (paramsExample: any): SwaggerParameterObject[] => {
    return convertJsonToParams("query", paramsExample)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const schemaBuilder = (jsonExample: any): SwaggerSchemaObject => {
    return convertJsonToSchema(jsonExample)
}

// Let us use sample JSOn data to build the body of the request schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bodyParamBuilder = (name:string, example: any): SwaggerParameterObject[] => {
    return [
        {
            in: "body",
            name: name || "Request Body",
            schema: convertJsonToSchema(example),
        },
    ]
}
export interface SwaggeristBaseDefinition {
  info: {
    title: string
    description?: string
    version: string
    contact?: {
      name?: string
      url?: string
      email?: string
    }
    license?: {
      name: string
      url?: string
    }
  }
  host?: string
  basePath?: string
  schemes?: string[]
}

export const buildStandardSwagger = (definition: SwaggeristBaseDefinition): SwaggerObject => {
    const swagger: SwaggerObject = Object.assign({}, DefaultSwagger, definition)
    return swagger
}
