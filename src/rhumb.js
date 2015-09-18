function findIn(parts, tree){
  var params = {}

  var find = function(remaining, node){
    
    var part = remaining.shift()

    if(!part) return node.leaf || false;

    if(node.fixed && part in node.fixed){
      return find(remaining, node.fixed[part])
    }

    if(node.partial){
      var tests = node.partial.tests
        , found = tests.some(function(partial){
            if(partial.ptn.test(part)){
              var match = part.match(partial.ptn)
              partial.vars.forEach(function(d, i){
                params[d] = match[i+1]
              })
              node = partial
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

function isArr(inst){
  return inst instanceof Array
}

function create (){
  var router = {}
    , tree   = {}  

  function updateTree(parts, node, fn){
    var part = parts.shift()
      , more = !!parts.length
      , peek

    
    if(isArr(part)){
      node.leaf = fn
      updateTree(part, node, fn)
      return
    }

    if(!part){ return }

    if(part.type == "fixed"){
      node["fixed"] || (node["fixed"] = {});
          
      peek = node.fixed[part.input] || (node.fixed[part.input] = {})
    }
    else if(part.type == "var"){
      if(node.var) {
        if(node.var.name == part.input) {
          peek = node.var
        } else {
          throw new Error("Ambiguity")
        }
      } else {
        peek = node.var = { name : part.input }
      }
    }
    else if(part.type = "partial"){
      if(node.partial){
        if(node.partial.names[part.name]) {
          throw new Error("Ambiguity")
        }
      }
      node.partial || (node.partial = { names : {}, tests : [] })

      peek = {}
      peek.ptn = part.input
      peek.vars = part.vars

      node.partial.names[part.name] = peek
      node.partial.tests.push(peek)  
    }
    if(!more){
      peek.leaf = fn
    } else {
      updateTree(parts, peek, fn)
    }
  }

  router.add = function(ptn, callback){
      updateTree(parse(ptn), tree, callback)
  }

  router.match = function(path){
    
    var split = path.split("?").filter(falsy)
      , parts = split[0].split("/").filter(falsy)
      , params = parseQueryString(split[1])
      , match = findIn(parts, tree)

    if(match){
      for (var prop in match.params) {
        params[prop] = match.params[prop]
      }
      return match.fn.apply(match.fn, [params])
    }
  }   
  return router
}

function falsy(d){
  return !!d
}

function parseQueryString(s) {
  if(!s) return {}
  return s.split("&").filter(falsy).reduce(function(qs, kv) {
    var pair = kv.split('=').filter(falsy)
    qs[pair[0]] = pair[1]
    return qs
  }, {})
}


function parse(ptn){
  var variable  = /^{(\w+)}$/
    , partial   = /([\w'-]+)?{([\w-]+)}([\w'-]+)?/
    , bracks    = /^[)]+/

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
      , len = part.length
      , i = 0

    while(i < len && match){
      i += match[0].length

      if(match[1]){
        ptn += match[1]
      }

      ptn += "([\\w-]+)"

      if(match[3]){
        ptn += match[3]
      }

      match = part.substr(i).match(partial)
    }

    var vars = []
      , name = part.replace(
      /{([\w-]+)}/g
    , function(p, d){
        vars.push(d)
        return "{var}"
      }
    )
    
    return {
      type: "partial"
    , input: new RegExp(ptn)
    , name: name
    , vars: vars
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

var rhumb = create()
rhumb.create = create
rhumb._parse = parse
rhumb._findInTree = findIn

module.exports = rhumb
