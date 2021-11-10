import { SwaggerParameterObject, } from "."
import { SwaggerSchemaObject, } from "./swagger"

interface BuildPathParamsArgs {
  [key: string]: {
    type: string
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

interface BuildSchemaArgs {
  [key: string]: string
}

// Build a schema from a simple set of properties
// "id": "string" will yeild an optional string property
// "id": "string!" will yeild a required string property
// Passing in an Array will yeild an array of the same type
export const buildSchema = (schema: BuildSchemaArgs | BuildSchemaArgs[]): SwaggerSchemaObject => {
    if (Array.isArray(schema)) {
        return {
            type: "object",
            items: buildSchema(schema[0]),
        }
    }
    const schemaObj: SwaggerSchemaObject = {
        type: "object",
        properties: {},
    }
    Object.keys(schema).forEach(key => {
        if (schema[key].endsWith("!")) {
            schemaObj.required = schemaObj.required || []
            schemaObj.required.push(key)
            schemaObj.properties[key] = {
                type: schema[key].slice(0, -1),
            }
        } else {
            schemaObj.properties[key] = {
                type: schema[key],
            }
        }
    })
    return schemaObj;
}