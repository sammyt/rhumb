describe("router", function(){
    it("should trigger callback and get return value", function(){
        var router = tabs.create()
        
        router.add("/bar", function(){
            return "woo, bar triggered"
        })
        router.add("/bar/foo/farr", function(){
            return "bar/foo/farr triggered"
        })        
        

        expect(router.match("/bar/foo/farr")).to.equal("bar/foo/farr triggered")
        expect(router.match("/bar")).to.equal("woo, bar triggered")
    })
})