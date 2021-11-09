interface OpenApiTag {
    name: string
    description?: string
    externalDocs?: OpenApiExternalDocumentation[]
}

interface OpenApiInfo {
    title: string
    version: string
    description?: string
    termsOfService?: string
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
interface OpenApiServer {
    url: string
    description?: string
    variables: {
        [key: string]: {
            default: string
            enum?: string[]
            description?: string
        }
    }
}

interface OpenApiReference {
    [ref: string]: string
}

interface OpenApiExternalDocumentation {
    url: string
    description?: string
}

interface OpenApiSecurityScheme {
    [name: string]: {
        type: string
        description?: string
        name?: string
        in?: string
        scheme?: string
        bearerFormat?: string
        flows?: any
        openConnectUrl?: string
    }
}

interface OpenApiSecurity {
    [name: string]: string[]
}

// Generic interface for setting up an OpenAPI schema
// Should work for 2.0 and 3.0
export interface ApiConfig {
    info: OpenApiInfo
    server: OpenApiServer
    tags?: OpenApiTag[]
    security: {
        securitySchemes: OpenApiSecurityScheme
        security: OpenApiSecurity
    }
}

export interface ApiParams {
    query: any
    path: any
    body: any
}

export interface ApiResponse {
    description: string
    
}

export interface ApiResponseItem {
    type: string
    properties: {

    }
}