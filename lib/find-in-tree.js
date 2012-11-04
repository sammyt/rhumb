define(function(){

    var find = function(remaining, node){
        var part = remaining.shift()
        if(!part) return true;

        if(node.fixed && part in node.fixed){
            return find(remaining, node.fixed[part])
        }

        return false
    }

    return function(parts, tree){
        return find(parts, tree) 
    }
})