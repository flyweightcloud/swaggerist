import { HttpRequest } from "@azure/functions";
import { StringifyOptions } from "querystring";
import { Route } from "../route";

export interface SwaggerObject {
    swagger?: string
    info: SwaggerInfo
    host?: string
    basepath?: string
    schemes?: string[]
    consumes?: string[]
    produces?: string[]
    paths?: SwaggerPath
    securityDefinitions: SecurityDefinitions
}

interface SecurityDefinitions {
    [name: string]: SecuritySchemeObject
}

interface SecuritySchemeObject {
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

export interface SwaggerInfo {
    title: string
    version: string
    description?: string
    termsofservice?: string
    license?: {
        name: string
        url: string
    }
    contact?: {
        name: string
        url: string
        email: string
    }
}

interface SwaggerReference {
    [ref: string]: string
}

interface SwaggerExternalDocumentation {
    url: string
    description?: string
}

interface SwaggerPath {
    [key: string]: SwaggerPathItemObject
}

interface SwaggerPathItemObject {
    [method: string]: SwaggerOperationObject | string
    parameters?: SwaggerParameterObject | SwaggerReference
}

interface SwaggerParameterObject {
    name: string
    in: string
    description?: string
    required?: boolean
    schema?: SwaggerSchemaObject 
}

interface SwaggerSchemaObject {
    type?: string
    required?: string[]
    properties?: {
        [key: string]: any
    }
    items?: SwaggerSchemaObject
    definitions?: any
}

export interface SwaggerOperationObject {
        description?: string
        summary?: string
        tags?: string[]
        operationid?: string
        consumes?: string[]
        produces?: string[]
        schemes?: string[]
        deprecated?: boolean
        externaldocs?: SwaggerExternalDocumentation
        parameters?: SwaggerParameterObject[] | SwaggerReference[]
        responses?: SwaggerResponsesObject
}

interface SwaggerResponsesObject {
    [statusCode: string]: SwaggerReference | {
        description?: string
        schema: SwaggerSchemaObject
        headers?: SwaggerHeadersObject
        examples?: SwaggerExamplesObject
    }

}

interface SwaggerHeadersObject {
    [name: string]: {
        [key: string]: string
    }
}

interface SwaggerExamplesObject {
    [mimetype: string]: {
        [key: string]: string
    }
}


export function build(request: Pick<HttpRequest, 'url'>, swaggerObject: SwaggerObject, routes: Route[]): object {
    const url = new URL(request.url);
    const path = url.pathname;
    swaggerObject.swagger = "2.0"
    swaggerObject.host = swaggerObject.host || url.hostname
    swaggerObject.schemes = [url.protocol.slice(0,-1)]
    swaggerObject.paths = swaggerObject.paths || {}
    for (let route of routes) {
        const method = {}
        method[route.method.toLowerCase()] = route.opts.swaggerOperation
        swaggerObject.paths[`${path}${route.path}`] = method
    }
    return swaggerObject
}