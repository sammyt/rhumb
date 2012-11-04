
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
            findIn(["foo", "bar"], tree).should.eql(true)
        })
        it("should not find /foo as it is incomplete", function(){
            findIn(["foo"], tree).should.eql(false)
        })
        it("should not find /foo/bar/baz as it is too long", function(){
            findIn(["foo", "bar", "baz"], tree).should.eql(false)
        })
    })
})