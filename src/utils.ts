// Traverses a tree of nodes of an object and replaces the values of the properties and keys
// with the given values.
// Example: findAndReplaceObject({host: "$$HOST$$"}, {host: "localhost"})

const replaceText = (text: string | number, replacements: [RegExp, string][]): string | number => {
  if (typeof text !== "string") {
    return text
  }
  let out: string  = `${text}`
  replacements.forEach(([regex, replacement]) => {
    out = out.replace(regex, replacement);
  })
  return out
}

const recursiveReplace = (objSrc: any, replacements: [RegExp, string][], objTarget = {}): object | string | number | any[]=> {

  if (Array.isArray(objSrc)) {
    return objSrc.map((item) => recursiveReplace(item, replacements))
  } else if (typeof objSrc !== "object") {
    return replaceText(objSrc, replacements)
  }

  Object.keys(objSrc).forEach(key => {
    objTarget[replaceText(key, replacements)] = recursiveReplace(objSrc[key], replacements);
  })
  return objTarget
}

export const traverseAndReplace = (objSrc, replacements: object): any => {
  const replacementList = []
  for (const key in replacements) {
    replacementList.push([new RegExp(`\\$\\$${key.toUpperCase()}\\$\\$`, 'g'), replacements[key]])
  }
  return recursiveReplace(objSrc, replacementList, {})
}