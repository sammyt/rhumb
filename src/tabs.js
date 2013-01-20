(function(){

function findIn(parts, tree){
  var find = function(remaining, node){
    var part = remaining.shift()

    if(!part) return node.leaf || false;

    if(node.fixed && part in node.fixed){
        return find(remaining, node.fixed[part])
    }

    if(node.partial){
      var tests = node.partial
        , found = tests.some(function(partial){
            if(partial.ptn.test(part)){
              node = partial.node
              return true
            }
          })
          
        if(found){
          return find(remaining, node)
        }
    }

    if(node.var){
      return find(remaining, node.var)
    }
    return false
  }
  return find(parts, tree) 
}

function create (){
  var router = {}
    , tree   = {}

  function parse(ptn){
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
        , more = !!parts.length

      if(!part){ return }

      if(part.type == "fixed"){
        node["fixed"] || (node["fixed"] = {});
            
        var peek = node.fixed[part.input] || {}
        node.fixed[part.input] = peek

        if(!more){
          peek.leaf = fn
        } else {
          updateTree(parts, peek, fn)    
        }
      }
      else throw new Error("not yet!")
    }

    router.add = function(ptn, callback){
        updateTree(parse(ptn), tree, callback)
    }

    router.match = function(path){
        var parts = path.split("/").filter(function(d){ return !!d })
        var fn  = findIn(parts, tree)


        if(fn) return fn()
    }    
    return router
}

tabs = create()
tabs.create = create
tabs._findInTree = findIn

})()


