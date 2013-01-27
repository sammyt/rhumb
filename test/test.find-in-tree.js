
var findIn = rhumb._findInTree

describe("find-in-tree", function(){
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
            findIn(["foo", "bar"], tree).should.be.ok
        })
        it("should not find /foo as it is incomplete", function(){
            findIn(["foo"], tree).should.not.be.ok
        })
        it("should not find /foo/bar/baz as it is too long", function(){
            findIn(["foo", "bar", "baz"], tree).should.not.be.ok
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
            findIn(["beans", "sock"], tree).should.be.ok
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
            findIn(["articles", "page-one"], tree).should.be.ok
        })
    })
})
