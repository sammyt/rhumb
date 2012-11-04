
var makeRouter = require("../lib/tabs")

describe("router", function(){
    it("should trigger callback and get return value", function(){
        var router    = makeRouter()
        router.add("/bar", function(){
            return "woo, bar triggered"
        })

        var triggered = router.match("/bar")
        expect(triggered).to.be.equal("woo, bar triggered")
    })
})