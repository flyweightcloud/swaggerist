import { buildStandardSwagger, SwaggeristBaseDefinition } from "./builders"
import { SecuritySchemeObject, SwaggerObject, SwaggerPathItemObject } from "./swagger"
import { traverseAndReplace } from "./utils"

export * from "./swagger"
export * from "./security"
export * from "./builders"
export * from "./defaults"
export * from "./responses"

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

export default class Swaggerist {

    swaggerDoc: SwaggerObject
    swaggerSecurityDefinitions: string[]
    swaggerOperationIds: string[]

    // Give us an easy place to start
    public static create(def: SwaggeristBaseDefinition): Swaggerist {
        return new Swaggerist(buildStandardSwagger(def))
    }

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

    addPath(path: string, pathObject: SwaggerPathItemObject) {
        const method = Object.keys(pathObject)[0]
        const operationId = pathObject[method].operationId ?? this.getNextOperationId(`${method}_${path}`)
        if (this.swaggerOperationIds.includes(operationId)) {
            throw new DuplicateOperationIdError(operationId)
        }
        this.swaggerDoc.paths = {
            ...this.swaggerDoc.paths,
            [path]: pathObject,
        }
        this.swaggerOperationIds.push(operationId)
        return this
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


