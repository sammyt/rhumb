var path = require("path")

var r = require("requirejs").config({
    baseUrl : path.resolve(__dirname, '../', "lib")
})


r(["../lib/find-in-tree"], function(findIn){

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
    })
})

})

