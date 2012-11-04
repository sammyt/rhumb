
var findIn = require("../lib/find-in-tree")

describe("Tree Walker", function(){
    describe("finding fixed paths", function(){
        var tree = {
            "fixed" : {
                "foo" : {
                    "fixed" : {
                        "bar" : { "leaf" : true }
                    }
                }
            }
        }

        it("should find /foo/bar", function(){
            findIn(["foo", "bar"], tree).should.be.true
        })
        it("should not find /foo as it is incomplete", function(){
            findIn(["foo"], tree).should.be.false
        })
        it("should not find /foo/bar/baz as it is too long", function(){
            findIn(["foo", "bar", "baz"], tree).should.be.false
        })
    })
    describe("finding paths containing variable parts", function(){
        var tree = {
            "fixed" : {
                "beans" : {
                    "var" : {
                        "leaf" : true
                    }
                }
            }
        }
        it("should find /beans/sock where sock is a variable", function(){
            findIn(["beans", "sock"], tree).should.be.true
        })
    })
    describe("finding partial parts", function(){
        var tree = {
            "fixed" : {
                "articles" : {
                    "partial" : [ { "ptn"  : /^page-/
                                  , "node" : { "leaf" : true }
                                  }
                                ]
                }
            }
        }
        it("should find /articles/page-one", function(){
            findIn(["articles", "page-one"], tree).should.be.true
        })
    })
})