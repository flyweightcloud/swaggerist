import { SwaggerSchemaObject, JSONSchemaObject } from "./swagger"

const extractExample = (val: object): object => {
    if (Array.isArray(val)) {
        return val.map(extractExample)
    }
    if (typeof val === "object") {
        if (val["$example"]) {
            return val["$example"]
        }
        const result: object = {}
        Object.keys(val).forEach(key => {
            result[key] = extractExample(val[key])
        })
        return result
    }
    return val
}

const extractRequired = (val: object): string[] => {
    const required = []
    Object.keys(val).forEach(key => {
        if(val[key]["$required"] && val[key]["$required"] === true) {
            required.push(key)
        }
    })
    return required
}

 type SwaggerSchemaObjectOverrideProperties = {
  // Exclusive to our use
  $example: string | number | boolean
  $required?: boolean
  
  // Standard JSON Schema but prependend with '$'
  $type: string
  $format?: string
  $title?: string
  $description?: string
  $default?: SwaggerSchemaObject
  $multipleOf?: number
  $maximum?: number
  $exclusiveMaximum?: number | boolean
  $minimum?: number
  $exclusiveMinimum?: number | boolean
  $maxLength?: number
  $minLength?: number
  $pattern?: string
  $maxItems?: number
  $minItems?: number
  $uniqueItems?: boolean
  $maxProperties?: number
  $minProperties?: number
  $properties?: SwaggerSchemaObject
  $enum?: string[] | number[] | boolean[]
}

const overrideSchema = (val: SwaggerSchemaObjectOverrideProperties): JSONSchemaObject => {
    const props: JSONSchemaObject = {
        type: valToType(val.$example).type,
    }

    Object.keys(val).forEach(k => {
        if (k !== "$example" && k !== "$required") {
            const key = k.slice(1) // '$type' to 'type'
            props[key] = val[k]
        }
    })
    return props
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const quickSchema = (json: any, opts:{includeExample?: boolean}={}): SwaggerSchemaObject => {
    const includeExample = opts.includeExample ? json : false
    if (Array.isArray(json)) {
        return {
            type: "array",
            items: quickSchema(json[0]),
        }
    }

    if (typeof json === "object") {
        if (json.$example) {
            return overrideSchema(json)
        }

        const schema: SwaggerSchemaObject = {
            type: "object",
            properties: {},
        }

        // Find any children with a required flag and add them to the required
        // array.in the parent schema.
        const required = extractRequired(json)
        if (required.length > 0) {
            schema.required = required
        }

        Object.keys(json).forEach(key => {
            schema.properties[key] = quickSchema(json[key])
        })
        if (includeExample) {
            schema.example = extractExample(json)
        }
        return schema
    }
    if (typeof json === "string" || typeof json === "boolean" || typeof json === "number") {
        return valToType(json)
    }

    throw new Error("Unsupported type: " + typeof json)
}


type ValToTypeSchema = {
  type: string
  format?: string
}

const valToType = (val: string | number | boolean): ValToTypeSchema => {
    const result: ValToTypeSchema = {
        type: "string",
    }
    if (typeof val === "number") {
        result.type = "number"
        if (val.toString().indexOf(".") > -1) {
            result.format = "float"
        } else if (val < 2147483647 && val > -2147483647) {
            result.type = "integer"
            result.format = "int32"
        } else {
            result.type = "integer"
            result.format = "int64"
        }
    }
    if (typeof val === "boolean") {
        result.type = "boolean"
    }
    return result
}