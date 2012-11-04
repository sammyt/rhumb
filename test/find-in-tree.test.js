
var findIn = require("../lib/find-in-tree")

describe("Tree Walker", function(){
    describe("finding fixed paths", function(){
        it("should find /foo/bar", function(){
            var tree = {
                "fixed" : {
                    "foo" : {
                        "fixed" : {
                            "bar" : {}
                        }
                    }
                }
            }

            findIn(["foo", "bar"], tree).should.eql(true)
        })
        it("should not find /foo as its incomplete", function(){
            var tree = {
                "fixed" : {
                    "foo" : {
                        "fixed" : {
                            "bar" : {}
                        }
                    }
                }
            }

            findIn(["bar"], tree).should.eql(false)
        })
    })
})