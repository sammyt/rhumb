
var find = function(remaining, node){
	var part = remaining.shift()

    if(!part) return !!node.leaf;

    if(node.fixed && part in node.fixed){
        return find(remaining, node.fixed[part])
    }

    return false
}

module.exports = function(parts, tree){
    return find(parts, tree) 
}