describe("routing", function(){
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

    router.add("/sing/{sound}", function(params){
      return params
    })
    expect(router.match("/sing/bird-song")).to.eql({
      sound : "bird-song"
    })
  })
  it("should find multiple params", function(){
    var router = rhumb.create()

    router.add("/sing/{sound}/{volume}", function(params){
      return params
    })
    expect(router.match("/sing/bird-song/loud")).to.eql({
      sound : "bird-song"
    , volume : "loud"
    })
  })
})
describe("parsing", function(){
  describe("paths that are fixed", function(){
    it("should find one fixed part", function(){
      var out = rhumb.parse("/foo")
      out.should.be.ok
      out.should.eql(
        [{ type: "fixed", input: "foo" }]
      )
    })
    it("should find multiple fixed parts", function(){
      var out = rhumb.parse("/foo/bar/bing")
      out.should.be.ok
      out.should.eql(
        [ { type: "fixed", input: "foo" }
        , { type: "fixed", input: "bar" }
        , { type: "fixed", input: "bing" }
        ]
      )
    })
    it("should find single fixed part for /", function(){
      var out = rhumb.parse("/")
      out.should.be.ok
      out.should.eql(
        [ { type: "fixed", input: "" }
        ]
      )
    })
  })
  describe("paths containing variables", function(){
    it("should find single variable part", function(){
      var out = rhumb.parse("/{wibble}")
      out.should.be.ok
      out.should.eql(
        [ { type: "var", input: "wibble" }
        ]
      )
    })
    it("should find multiple variable parts", function(){
      var out = rhumb.parse("/{wibble}/{wobble}")
      out.should.be.ok
      out.should.eql(
        [ { type: "var", input: "wibble" }
        , { type: "var", input: "wobble" }
        ]
      )
    })
    it("should find variable and fixed parts", function(){
      var out = rhumb.parse("/{wibble}/bar/{wobble}")
      out.should.be.ok
      out.should.eql(
        [ { type: "var", input: "wibble" }
        , { type: "fixed", input: "bar" }
        , { type: "var", input: "wobble" }
        ]
      )
    })
  })
  describe("paths containing partial variables", function(){
    it("should find a partial part with fixed left and right", function(){
      var out = rhumb.parse("/left{page}right")
      out.should.be.ok
      out.should.have.lengthOf(1)
      out[0].type.should.equal("partial")
    })
    it("should find a partial part with fixed right", function(){
      var out = rhumb.parse("/{page}right")
      out.should.be.ok
      out.should.have.lengthOf(1)
      out[0].type.should.equal("partial")
    })
    it("should find a partial part with fixed left", function(){
      var out = rhumb.parse("/left{page}")
      out.should.be.ok
      out.should.have.lengthOf(1)
      out[0].type.should.equal("partial")
    })
  })
  describe("paths with optional elements", function(){
    it("should find optional part at end of path", function(){
      var out = rhumb.parse("/one/two(/three)")
      out.should.be.ok
      out.should.eql(
        [ { type: "fixed", input: "one"}
        , { type: "fixed", input: "two"}
        , [ { type: "fixed", input: "three"} ]
        ]
      )
    })
    it("should find nested optional elements at end of path", function(){
      var out = rhumb.parse("/one/two(/three/four(/five))")
      out.should.be.ok
      out.should.eql(
        [ { type: "fixed", input: "one"}
        , { type: "fixed", input: "two"}
        , [ { type: "fixed", input: "three"}
          , { type: "fixed", input: "four"}
          , [ { type: "fixed", input: "five"} ]
          ]
        ]
      )
    })
    /*
    TODO: later :)
    it("should find optional elements anywhere in path", function(){
      var out = rhumb.parse("/one/two(/three)/gogogo")
      out.should.be.ok
      out.should.eql(
        [ { type: "fixed", input: "one"}
        , { type: "fixed", input: "two"}
        , [ { type: "fixed", input: "three"} ]
        , { type: "fixed", input: "gogogo"}
        ]
      )
    })
    */
  })
})




