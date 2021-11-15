// Traverses a tree of nodes of an object and replaces the values of the properties and keys
// with the given values.
// Example: findAndReplaceObject({host: "$$HOST$$"}, {host: "localhost"})

type AnyJson =  boolean | number | string | null | JsonArray | JsonMap;
interface JsonMap {  [key: string]: AnyJson; }
type JsonArray = Array<AnyJson>

const replaceText = (text: string, replacements: [RegExp, string][]): string => {
    if (typeof text !== "string") {
        return text
    }
    let out  = `${text}`
    replacements.forEach(([regex, replacement]) => {
        out = out.replace(regex, replacement);
    })
    return out
}

const recursiveReplace = (objSrc: AnyJson, replacements: [RegExp, string][], objTarget = {}): AnyJson => {

    if (Array.isArray(objSrc)) {
        return objSrc.map((item) => recursiveReplace(item, replacements))
    } else if (typeof objSrc === "string") {
        return replaceText(objSrc, replacements)
    } else if (typeof objSrc !== "object") { // number, bigint, undefined, null, boolean
        return objSrc
    }

    Object.keys(objSrc).forEach(key => {
        objTarget[replaceText(key, replacements)] = recursiveReplace(objSrc[key], replacements);
    })
    return objTarget
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const traverseAndReplace = (objSrc: any, replacements: {[key: string]: string}): AnyJson => {
    const replacementList = []
    for (const key in replacements) {
        const tag = key.replace(/([A-Z])/g, "_$1").toUpperCase()
        replacementList.push([new RegExp(`\\$\\$${tag}\\$\\$`, "g"), replacements[key]])
    }
    return recursiveReplace(objSrc, replacementList, {})
}