import { DefaultSwagger, JSONSchemaObject } from "."
import { convertJsonToParams } from "./convert_params"
import { convertJsonToSchema } from "./convert_schema"
import { SwaggerParameterObject, SwaggerSchemaObject, SwaggerTypes, SwaggerObject } from "./swagger"
interface BuildPathParamsArgs {
  [key: string]: {
    type: SwaggerTypes
    description?: string
  }
}

export const buildPathParams = (params: BuildPathParamsArgs): SwaggerParameterObject[] => {
    const results: SwaggerParameterObject[] = []
    Object.keys(params).forEach(key => {
        results.push({
            in: "path",
            name: key,
            type: params[key].type,
            required: true,
        })
    })
    return results
}
interface BuildQueryParamsArgs {
  [key: string]: {
    type: string
    format?: string
    required?: boolean
  }
}

export const queryParamBuilder = (paramsExample: any): SwaggerParameterObject[] => {
    return convertJsonToParams(paramsExample)
}

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
