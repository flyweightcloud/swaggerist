import { traverseAndReplace, } from "../src/utils"

describe("Utility functions", () => {
    const testTree = {
        url: "https://$$HOST$$/path",
        "$$FOO$$_get": "get_$$FOO$$",
        nested: {
            "$$FOO$$_post": "post_$$FOO$$",
            arr: [
                "$$FOO$$Array",
                "$$FOO$$Array",
            ],
            "arrOfObj_$$FOO$$": [
                {
                    "$$FOO$$_put": "put_$$FOO$$",
                },
            ],
        },
        200: {
            foo: "$$FOO$$",
        },

    }

    test("tree find and replace should work", async () => {
        const test = traverseAndReplace(testTree, {"host": "localhost", foo: "baz",}) as object
        expect(test["url"]).toBe("https://localhost/path")
        expect(test["baz_get"]).toBe("get_baz")
        expect(test["nested"]["baz_post"]).toBe("post_baz")
        expect(test["nested"]["arr"][0]).toBe("bazArray")
        expect(test["nested"]["arr"][1]).toBe("bazArray")
        expect(test["nested"]["arrOfObj_baz"][0]["baz_put"]).toBe("put_baz")
    })
})