import { SwaggerParameterInStrings, SwaggerParameterObject } from "."
import { valToType } from "./value_typer"

type QuickParamsSchema = {
    [key: string]: string | number | boolean | SwaggerParameterObject
}

export const convertJsonToParams = (paramIn: SwaggerParameterInStrings, json: QuickParamsSchema ): SwaggerParameterObject[] => {
    const params: SwaggerParameterObject[] = []
    Object.keys(json).forEach(k => {
        const val = json[k]
        const param: SwaggerParameterObject = {
            in: paramIn,
            name: k,
        }

        // Path params are required
        if (paramIn === "path") {
            param["required"] = true
        }

        if (typeof val === "object") {
            Object.assign(param, val)
        } else {
            const {type, format} =  valToType(val)
            param.type = type
            if (format) param.format = format
            param.description = `${k} - Ex. '${val}'(${type})`
        }
        params.push(param)
    })
    return params
}