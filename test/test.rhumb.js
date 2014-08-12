var rhumb  = require('../src/rhumb')
  , sinon  = require('sinon')
  , expect = require('chai').expect

require('chai').should()
require('chai').use(require('sinon-chai'))

describe("routing", function(){
  describe("callback", function(){
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
  })
  describe("matching with variable paths", function(){
    it("should match /{foo} with path /bar", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/{foo}", spy)
      router.match("/bar")
      spy.should.have.been.calledOnce
    })
    it("should match /wibble/{foo} with path /wibble/bean", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/wibble/{foo}", spy)
      router.match("/wibble/bean")
      spy.should.have.been.calledOnce
    })
    it("should match /wibble/{foo}/wobble with path /wibble/humm/wobble", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/wibble/{foo}/wobble", spy)
      router.match("/wibble/humm/wobble")
      spy.should.have.been.calledOnce
    })
    it("should match /foo/{bar} and /foo/{bar}/{baz} as different paths", function(){
      var router = rhumb.create()
        , one = sinon.spy()
        , two = sinon.spy()

      router.add("/foo/{bar}", one)
      router.add("/foo/{bar}/{baz}", two)  

      router.match("/foo/wee")
      router.match("/foo/wee/waa")

      one.should.have.been.calledOnce.calledWith({bar:"wee"})
      two.should.have.been.calledOnce.calledWith({bar:"wee", baz:"waa"})
    })
  })
  describe("matching with partially variable paths", function(){
    it("should match /page-{num} with path /page-four", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/page-{num}", spy)
      router.match("/page-four")
      spy.should.have.been.calledOnce
    })
    it("should match /page-{num} with path /page-4", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/page-{num}", spy)
      router.match("/page-4")
      spy.should.have.been.calledOnce
    })
    it("should match /i-{action}-you with path /i-poke-you", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/i-{action}-you", spy)
      router.match("/i-poke-you")
      spy.should.have.been.calledOnce
      spy.should.have.been.calledWith({action: "poke"})
    })
    it("should match /fix/i-{action}-you/faff with path /fix/i-poke-you/faff", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/fix/i-{action}-you/faff", spy)
      router.match("/fix/i-poke-you/faff")
      spy.should.have.been.calledOnce
      spy.should.have.been.calledWith({action: "poke"})
    })
    it("should match /{day}-{month}-{year} with path /mon-01-2020", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/{day}-{month}-{year}", spy)
      router.match("mon-01-2020")
      spy.should.have.been.calledOnce
      spy.should.have.been.calledWith(
        { day: "mon"
        , month: "01"
        , year: "2020"
        }
      )
    })
  })
  describe("matching with optional paths", function(){
    it("should match /foo(/bar) with /foo and /foo/bar", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/foo(/bar)", spy)
      router.match("/foo")
      router.match("/foo/bar")
      spy.should.have.been.calledTwice
    })
    it("should match /foo(/{bar}(/{bay})) with /foo, /foo/knew & /foo/knew/you", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/foo(/{bar}(/{bay}))", spy)
      router.match("/foo")
      spy.should.have.been.calledOnce
      router.match("/foo/knew")
      spy.should.have.been.calledTwice
      router.match("/foo/knew/you")
      spy.should.have.been.calledThrice
    })
  })
  describe("ambiguity detection", function(){
    it("should detect /foo/{bar} and /foo(/{maybe}) as ambiguous", function(){
      var router = rhumb.create()
      var spy = sinon.spy()

      router.add("/foo/{bar})", spy)
      expect(
        function(){
          router.add("/foo/{maybe})", spy)  
        }
      ).to.throw(Error, /Ambiguity/)
    })
  })
  describe("precedence", function(){
    it("should match /woo/wee over /woo/{wee}", function(){
      var router = rhumb.create()
        , one = sinon.spy()
        , two = sinon.spy()

      router.add("/woo/{wee}", two)
      router.add("/woo/wee", one)
      
      router.match("/woo/wee")

      one.should.have.been.calledOnce
      two.should.not.have.been.called
    })
  })
})
describe("parsing", function(){
  describe("paths that are fixed", function(){
    it("should find one fixed part", function(){
      var out = rhumb._parse("/foo")
      out.should.be.ok
      out.should.eql(
        [{ type: "fixed", input: "foo" }]
      )
    })
    it("should find multiple fixed parts", function(){
      var out = rhumb._parse("/foo/bar/bing")
      out.should.be.ok
      out.should.eql(
        [ { type: "fixed", input: "foo" }
        , { type: "fixed", input: "bar" }
        , { type: "fixed", input: "bing" }
        ]
      )
    })
    it("should find single fixed part for /", function(){
      var out = rhumb._parse("/")
      out.should.be.ok
      out.should.eql(
        [ { type: "fixed", input: "" }
        ]
      )
    })
  })
  describe("paths containing variables", function(){
    it("should find single variable part", function(){
      var out = rhumb._parse("/{wibble}")
      out.should.be.ok
      out.should.eql(
        [ { type: "var", input: "wibble" }
        ]
      )
    })
    it("should find multiple variable parts", function(){
      var out = rhumb._parse("/{wibble}/{wobble}")
      out.should.be.ok
      out.should.eql(
        [ { type: "var", input: "wibble" }
        , { type: "var", input: "wobble" }
        ]
      )
    })
    it("should find variable and fixed parts", function(){
      var out = rhumb._parse("/{wibble}/bar/{wobble}")
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
      var out = rhumb._parse("/left{page}right")
      out.should.be.ok
      out.should.have.lengthOf(1)
      out[0].type.should.equal("partial")
    })
    it("should find a partial part with fixed right", function(){
      var out = rhumb._parse("/{page}right")
      out.should.be.ok
      out.should.have.lengthOf(1)
      out[0].type.should.equal("partial")
    })
    it("should find a partial part with fixed left", function(){
      var out = rhumb._parse("/left{page}")
      out.should.be.ok
      out.should.have.lengthOf(1)
      out[0].type.should.equal("partial")
    })
  })
  describe("paths with optional elements", function(){
    it("should find optional part at end of path", function(){
      var out = rhumb._parse("/one/two(/three)")
      out.should.be.ok
      out.should.eql(
        [ { type: "fixed", input: "one"}
        , { type: "fixed", input: "two"}
        , [ { type: "fixed", input: "three"} ]
        ]
      )
    })
    it("should find nested optional elements at end of path", function(){
      var out = rhumb._parse("/one/two(/three/four(/five))")
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
      var out = rhumb._parse("/one/two(/three)/gogogo")
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




