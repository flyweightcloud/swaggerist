// Allow for easier setup of security policies in swagger

import { SecuritySchemeObject,} from "./swagger"

export const SwaggerSecuritySchemes = {

    "MicrosoftOauth": (scopes?: {[key: string]: string}): SecuritySchemeObject => {
        return {
            "type": "oauth2",
            "flow": "accessCode",
            "authorizationUrl": "https://login.windows.net/common/oauth2/authorize",
            "tokenUrl": "https://login.windows.net/common/oauth2/authorize",
            "scopes": scopes ?? {},
        }
    },

}
