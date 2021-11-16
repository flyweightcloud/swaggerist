import { type } from "os"
import { SwaggerParameterObject } from "."
import { SwaggerSchemaObject, JSONSchemaObject } from "./swagger"
import { valToType } from "./value_typer"

type QuickParamsSchema = {
    [key: string]: string | number | boolean | SwaggerParameterObject
}

export const convertJsonToParams = (json: QuickParamsSchema ): SwaggerParameterObject[] => {
    const params: SwaggerParameterObject[] = []
    Object.keys(json).forEach(k => {
        const val = json[k]
        const param: SwaggerParameterObject = {
          in: "query",
          name: k,
        }
        if (typeof val === "object") {
          Object.assign(param, val)
        } else {
          const {type, format} =  valToType(val)
          param.type = type
          if (format) param.format = format
        }
    })
    return params
}