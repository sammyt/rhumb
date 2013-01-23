describe("router", function(){
    it("should trigger callback and get return value", function(){
        var router = rhumb.create()
        
        router.add("/bar", function(){
            return "woo, bar triggered"
        })
        router.add("/bar/foo/farr", function(){
            return "bar/foo/farr triggered"
        })        
        expect(router.match("/bar/foo/farr")).to.equal("bar/foo/farr triggered")
        expect(router.match("/bar")).to.equal("woo, bar triggered")
    })
    it("should pass params obect to callback", function(){
        var router = rhumb.create()

        router.add("/sing/:sound", function(params){
            return params
        })
        expect(router.match("/sing/bird-song")).to.eql({
            sound : "bird-song"
        })
    })
    it("should find multiple params", function(){
        var router = rhumb.create()

        router.add("/sing/:sound/:volume", function(params){
            return params
        })
        expect(router.match("/sing/bird-song/loud")).to.eql({
            sound : "bird-song"
          , volume : "loud"
        })
    })
})