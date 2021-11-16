import { SwaggerSchemaObject, JSONSchemaObject } from "./swagger"
import { valToType } from "./value_typer"

type QuickJSONSchema = JSONSchemaObject & { required?: boolean, example?: string | number | boolean }

const extractExample = (val: object): object => {
    if (Array.isArray(val)) {
        return val.map(extractExample)
    }
    if (typeof val === "object") {
        const result: object = {}
        Object.keys(val).forEach(key => {
            if (key.startsWith("$")) {
                const example = val[key]["example"]
                if (!example) {
                    throw new Error(`No example found for ${key}`)
                }
                result[key.slice(1)] = val[key]["example"]
            } else {
                result[key] = extractExample(val[key])
            }
        })
        return result
    }
    return val
}

const extractRequired = (val: {[key: string]: QuickJSONSchema }): string[] => {
    const required = []
    Object.keys(val).forEach(key => {
        if (key.startsWith("$") && val[key].required) {
            required.push(key.slice(1))
        }
    })
    return required
}

const overrideSchema = (val: QuickJSONSchema): JSONSchemaObject => {
    const props: JSONSchemaObject = {
        type: valToType(val.example).type,
    }

    Object.keys(val).forEach(key => {
        // Drop example and required from properties
        if (key !== "example" && key !== "required") {
            props[key] = val[key]
        }
    })
    return props
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertJsonToSchema = (json: any, opts:{includeExample?: boolean}={}): SwaggerSchemaObject => {
    const includeExample = opts.includeExample ?? true
    if (Array.isArray(json)) {
        return {
            type: "array",
            items: convertJsonToSchema(json[0], {includeExample: false}),
        }
    }

    if (typeof json === "object") {
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
            if (key.slice(0, 1) === "$") {
                schema.properties[key.slice(1)] = overrideSchema(json[key])
            } else {
                schema.properties[key] = convertJsonToSchema(json[key], {includeExample: false})
            }
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
