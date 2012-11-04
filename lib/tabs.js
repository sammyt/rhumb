

function create (){
    var router = {}
      , findIn = require("./find-in-tree")
      , tree   = {}


    var parse = function(ptn){
        var parts = ptn.split("/")
            .filter(function(d){ return !!d })
            .map(function(d){
                var type = (d[0] == ":")  ? "var" : "fixed";
                return {
                    "type"  : type,
                    "input" : d
                }
            })

        return parts
    }

    var updateTree = function(parts, node, fn){
        var part = parts.shift()
          , next = {}
          , more = !!parts.length

        if(!part) return;

        if(part.type == "fixed"){
            node["fixed"] || (node["fixed"] = {});
            
            node.fixed[part.input] = next
            !more && (node.leaf = fn)
            return updateTree(parts, next, fn)
        }
    }

    router.add = function(ptn, callback){
        updateTree(parse(ptn), tree, callback)
    }

    router.match = function(path){
        var parts = path.split("/")
          , fn  = findIn(parts, tree)

        if(fn) return fn()
    }    
    return router
}


module.exports = function(){
    return create()
}