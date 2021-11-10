import { DefaultResponses, DefaultSchemas, } from "./defaults"
import { SecuritySchemeObject, SwaggerObject, SwaggerPathItemObject, } from "./swagger"
import { traverseAndReplace, } from "./utils"

export * from "./swagger"
export * from "./security"
export * from "./builders"
export * from "./defaults"
export * from "./responses"


class DuplicateOperationIdError extends Error {
  constructor(key: string) {
    super(`OperationId '${key}' already exists`);
    this.name = "DuplicateOperationIdError";
  }
}

class DuplicateSecurityPolicyError extends Error {
  constructor(key: string) {
    super(`Security policy '${key}' already exists`);
    this.name = "DuplicateSecurityPolicyError";
  }
}

export interface SwaggerBuilderDefinition {
  swagger?: string
  info: {
    title: string
    description?: string
    version: string
    contact?: {
      name: string
      url?: string
      email?: string
    }
  }
  host?: string
  basePath?: string
  schemes?: string[]
}

const buildMininumViableSwagger = (definition: SwaggerBuilderDefinition): SwaggerObject => {
    return ({
        swagger: definition.swagger ?? "2.0",
        info: {
            title: definition.info.title,
            description: definition.info.description ?? definition.info.title,
            version: definition.info.version ?? "1.0.0",
        },
        schemes: definition.schemes ?? ["$$SCHEMA$$",],
        host: definition.host ?? "$$HOST$$",
        basePath: definition.basePath ?? "/",
        paths: {},
        definitions: DefaultSchemas,
        responses: DefaultResponses,
    })
}

export default class SwaggerBuilder {

    swaggerDoc: SwaggerObject
    swaggerSecurityDefinitions: string[]
    swaggerOperationIds: string[]


    constructor(definition: SwaggerBuilderDefinition) {
        this.swaggerDoc = buildMininumViableSwagger(definition)
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
        this.swaggerDoc.security.push({[key]: [],})

        this.swaggerSecurityDefinitions.push(key)
    }

    addPath(path: string, pathObject: SwaggerPathItemObject) {
        const method = Object.keys(pathObject)[0]
        const operationId = pathObject[method].operationId ?? `${method}_${path}`
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
    generate(opts: {[key: string]: string} = {}) {
        return traverseAndReplace(this.swaggerDoc, opts)
    }


}


