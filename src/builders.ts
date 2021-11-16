import { DefaultSwagger, JSONSchemaObject } from "."
import { SwaggerParameterObject, SwaggerSchemaObject, SwaggerParameterTypes, SwaggerObject } from "./swagger"
interface BuildPathParamsArgs {
  [key: string]: {
    type: SwaggerParameterTypes
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

export const buildQueryParams = (params: BuildQueryParamsArgs): SwaggerParameterObject[] => {
    const results: SwaggerParameterObject[] = []
    Object.keys(params).forEach(key => {
        const obj = params[key]
        const paramObj: SwaggerParameterObject = {
            in: "query",
            name: key,
            type: obj.type,
        }
        Object.assign(paramObj, obj)
        results.push(paramObj)
    })
    return results
}

// Allow for a required flag on a parameter and then build on the schema
// with the required string[]
interface BuildSchemaArgs {
  [key: string]: JSONSchemaObject & {required?: boolean}
}

// Simply function to build a schema object
export const buildSchema = (schema: BuildSchemaArgs | BuildSchemaArgs[]): SwaggerSchemaObject => {
    if (Array.isArray(schema)) {
        return {
            type: "array",
            items: buildSchema(schema[0]),
        }
    }
    const schemaObj: SwaggerSchemaObject = {
        type: "object",
        properties: {},
    }

    Object.keys(schema).forEach(key => {
        schemaObj.required = schemaObj.required || []
        let isRequired = false
        if (schema[key].required) {
            isRequired = schema[key].required
            delete(schema[key].required)
        }
        schemaObj.properties[key] = schema[key]
        if (isRequired) {
            schemaObj.required.push(key)
        }
    })
    if (schemaObj.required && schemaObj.required.length === 0) {
        delete(schemaObj.required) // Schema error if empty
    }
    return schemaObj;
}

export const buildBodyParams = (name:string, schema: BuildSchemaArgs | BuildSchemaArgs[]): SwaggerParameterObject[] => {
    return [
        {
            in: "body",
            name: name || "Request Body",
            schema: buildSchema(schema),
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

export const convertJsonToSchema = (json: any, opts:{includeExample?: boolean}={}): SwaggerSchemaObject => {
  if (Array.isArray(json)) {
    return {
      type: "array",
      items: convertJsonToSchema(json[0]),
    }
  }
  if (typeof json === "object") {
    const example = opts.includeExample ? json : false
    const schema: SwaggerSchemaObject = {
      type: "object",
      properties: {},
    }
    if (example) {
      schema.example = example
    }
    Object.keys(json).forEach(key => {
      schema.properties[key] = convertJsonToSchema(json[key])
    })
    return schema
  }
  if (typeof json === "string") {
    return {
      type: "string",
    }
  }
  if (typeof json === "number") {
    const schema: SwaggerSchemaObject = {
      type: "integer"
    }
    if (json.toString().indexOf(".") > -1) {
      schema.format = "float"
      schema.type = "number"
    } else if (json < 2147483647 && json > -2147483647) {
      schema.format = "int32"
    } else {
      schema.format = "int64"
    }
    return schema
  }
  throw new Error("Unsupported type: " + typeof json)
}