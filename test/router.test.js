
var makeRouter = require("../lib/tabs")

describe("router", function(){
    it("should trigger callback and get return value", function(){
        var router = makeRouter()
        router.add("/bar", function(){
            return "woo, bar triggered"
        })

        var triggered = router.match("/bar")
        expect(triggered).to.equal("woo, bar triggered")

        
        router.add("/bar/foo/farr", function(){
            return "bar/foo/farr triggered"
        })

        expect(router.match("/bar/foo/farr")).to.equal("bar/foo/farr triggered")
    })
})