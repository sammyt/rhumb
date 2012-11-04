
var find = function(remaining, node){
	var part = remaining.shift()

    if(!part) return !!node.leaf;

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

module.exports = function(parts, tree){
    return find(parts, tree) 
}