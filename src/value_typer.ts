import { SwaggerFormats, SwaggerTypes } from "./swagger"

type ValToTypeSchema = {
  type: SwaggerTypes
  format?: SwaggerFormats
}

export const valToType = (val: string | number | boolean): ValToTypeSchema => {
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