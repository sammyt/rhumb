Rhumb
=====

routing, this and that.


Bells and Whistles
------------------
* automatic path precedence
* ambiguity detection
* variables parts
* partially variable parts
* optional parts
* parameter parsing


Basic Usage
-----------

Rhumb allows you to map paths to functions

```javascript
rhumb.add("/happy/shoes", function(){
  return shoes
})
```

If those paths contain vairable parts, rhumb will grab them for you

```javascript
rhumb.add("/happy/shoes/{color}", function(params){
  return shoes.inColor(params.color)
})
```

Whatever you return in the callback will to handed back to the caller

```javascript
redShoes = rhumb.match("/happy/shoes/red")
```

License
-------

License: http://sammyt.mit-license.org
