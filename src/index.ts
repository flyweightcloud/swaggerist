import { buildStandardSwagger, SwaggeristBaseDefinition } from "./builders"
import { SecuritySchemeObject, SwaggerObject, SwaggerOperationObject, SwaggerPathItemObject } from "./swagger"
import { traverseAndReplace } from "./utils"

export * from "./swagger"
export * from "./security"
export * from "./builders"
export * from "./defaults"
export * from "./responses"


type HttpMethods = "get" | "post" | "put" | "delete" | "options" | "head" | "patch"
type AddRouteReturnType = {method: HttpMethods, path: string }

class BaseError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, BaseError.prototype);
    }
}

class CustomError extends BaseError {
    constructor(name: string, message: string) {
        super(message);
        this.name = name
    }
}

class DuplicateOperationIdError extends BaseError {
    constructor(key: string) {
        super(`OperationId '${key}' already exists`);
        this.name = "DuplicateOperationIdError";
    }
}

class DuplicateSecurityPolicyError extends BaseError {
    constructor(key: string) {
        super(`Security policy '${key}' already exists`);
        this.name = "DuplicateSecurityPolicyError";
    }
}

/**
 * @class Swaggerist
 * @description A class to build a swagger object
 */
export default class Swaggerist {

    swaggerDoc: SwaggerObject
    swaggerSecurityDefinitions: string[]
    swaggerOperationIds: string[]

    /**
     * The static method to create a new instance of the class with sensible defaults
     * 
     * Example:
     * ```
     * const swagger = Swaggerist.create({
     *  info: {
     *    title: "My API",
     *    description: "This is my API",
     *    version: "1.0.0"
     *  }
     * })
     * ```
     *
     */
    public static create(def: SwaggeristBaseDefinition): Swaggerist {
        return new Swaggerist(buildStandardSwagger(def))
    }

    /**
     * The constructor of the `Swaggerist` class.
     * You probably want to use the static method [[default.create]] instead
     * to create a new instance of the class.with sensible defaults
     *
     * @param {SwaggerObject} definition The swagger object to build based on the passed in definition
     */
    constructor(definition: SwaggerObject) {
        this.swaggerDoc = definition
        this.swaggerOperationIds = []
        this.swaggerSecurityDefinitions = []
    }

    addSecurityPolicy(key: string, securityPolicy: SecuritySchemeObject) {
        if (this.swaggerSecurityDefinitions.includes(key)) {
            throw new DuplicateSecurityPolicyError(key)
        }
        this.swaggerDoc.securityDefinitions = this.swaggerDoc.securityDefinitions ?? {}
        this.swaggerDoc.securityDefinitions[key] = securityPolicy

        this.swaggerDoc.security = this.swaggerDoc.security ?? []
        this.swaggerDoc.security.push({[key]: []})

        this.swaggerSecurityDefinitions.push(key)
    }

    addRoute(method: HttpMethods, path: string, swaggerOp: SwaggerOperationObject): AddRouteReturnType {
        const swaggerMethod = {[method]: swaggerOp} as SwaggerPathItemObject

        this.swaggerDoc.paths = this.swaggerDoc.paths || {}

        if (this.swaggerDoc.paths[path] && this.swaggerDoc.paths[path][method]) {
            throw new Error("Path and method already exists")
        }

        const operationId = swaggerOp.operationId ?? this.getNextOperationId(`${method}_${path}`)
        if (this.swaggerOperationIds.includes(operationId)) {
            throw new DuplicateOperationIdError(operationId)
        }

        this.swaggerDoc.paths[path] = {...this.swaggerDoc.paths[path] || {}, ...swaggerMethod}
        this.swaggerOperationIds.push(operationId)

        return {method: method as HttpMethods, path}
    }

    get(path: string, swaggerOp: SwaggerOperationObject): AddRouteReturnType {
        return this.addRoute("get", path, swaggerOp)
    }

    post(path: string, swaggerOp: SwaggerOperationObject): AddRouteReturnType {
        return this.addRoute("post", path, swaggerOp)
    }

    put(path: string, swaggerOp: SwaggerOperationObject): AddRouteReturnType {
        return this.addRoute("put", path, swaggerOp)
    }

    patch(path: string, swaggerOp: SwaggerOperationObject): AddRouteReturnType {
        return this.addRoute("patch", path, swaggerOp)
    }

    delete(path: string, swaggerOp: SwaggerOperationObject): AddRouteReturnType {
        return this.addRoute("delete", path, swaggerOp)
    }

    // TODO: allow for substitutions for things like $$HOST$$
    generate(version: string, opts: {[key: string]: string} = {}): SwaggerObject {
        if (version === "2.0" || version === "2") {
            return traverseAndReplace(this.swaggerDoc, opts) as unknown as SwaggerObject
        }
        throw new CustomError("InvalidSwaggerVersion", "Only swagger version 2.0 is supported currently")
    }

    private getNextOperationId(key: string): string {
        let testKey = key
        let idx = 1
        while(this.swaggerOperationIds.includes(testKey)) {
            idx++
            testKey = `${key}_${idx}`
        }
        return testKey
    }


}


