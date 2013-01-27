(function(){

function findIn(parts, tree){
  var params = {}

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
      params[node.var.name] = part
      return find(remaining, node.var)
    }
    return false
  }

  var found = find(parts, tree, params)
  
  if(found){
    return {
      fn : found
    , params : params
    }
  }
  return false
}

function create (){
  var router = {}
    , tree   = {}  

  var updateTree = function(parts, node, fn){
    var part = parts.shift()
      , more = !!parts.length
      , peek

    if(!part){ return }

    if(part.type == "fixed"){
      node["fixed"] || (node["fixed"] = {});
          
      peek = node.fixed[part.input] || (node.fixed[part.input] = {})

      if(!more){
        peek.leaf = fn
      } else {
        updateTree(parts, peek, fn)
      }
    }
    else if(part.type == "var"){
      peek = node.var || (node.var = {})
      peek.name = part.input

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
      var parts = path.split("/").filter(falsy)
        , match  = findIn(parts, tree)

      if(match){
        return match.fn.apply(match.fn, [match.params])
      }
  }    
  return router
}

function falsy(d){
  return !!d
}


function parse(ptn){
  var variable = /^{(\w+)}$/
    , partial  = /([\w'-]+)?{([\w-]+)}([\w'-]+)?/
    , bracks   = /^[)]+/

  if(ptn.trim() == "/"){
    return [{type:"fixed", input: ""}]
  }

  function parseVar(part){
    var match = part.match(variable)
    return {
      type: "var"
    , input: match[1]
    }
  }

  function parseFixed(part){
    return {
      type: "fixed"
    , input: part
    }
  }

  function parsePartial(part){
    var match = part.match(partial)
      , ptn = ""

    if(match[1]){
      ptn += match[1]
    }

    ptn += "([\w-]+)"

    if(match[3]){
      ptn += match[3]
    }

    return {
      type: "partial"
    , input: new RegExp(ptn)
    }
  }

  function parsePtn(ptn){
    return ptn.split("/")
      .filter(falsy)
      .map(function(d){
        if(variable.test(d)){
          return parseVar(d)
        }
        if(partial.test(d)){
          return parsePartial(d)
        }
        return parseFixed(d)
      })
  }

  function parseOptional(ptn){
    
    var out =  ""
      , list = []

    var i = 0
      , len = ptn.length
      , curr
      , onePart = true

    while(onePart && i < len){
      curr = ptn[i]
      switch(curr){
        case ")":
        case "(":
          onePart = false
          break;

        default:
          out += curr
          break;
      }
      i++
    }

    if(!onePart){
      var next = parseOptional(ptn.substr(i + 1))
      if(next.length){
        list.push(
          next
        )  
      }
    }

    return parsePtn(out).concat(list)
  }

  if(ptn.indexOf("(") == -1){
    return parsePtn(ptn)
  }
  
  return parseOptional(ptn)
}

rhumb = create()
rhumb.create = create
rhumb.parse = parse
rhumb._findInTree = findIn

})()


