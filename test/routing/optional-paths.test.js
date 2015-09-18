var test  = require('tape')
  , rhumb = require('../../lib/rhumb')

test("Routing should match /foo(/bar) with /foo and /foo/bar", function(t) {
  t.plan(2)
  var router = rhumb.create()

  router.add("/foo(/bar)", function() {
    t.pass("should be called")
  })

  router.match("/foo")
  router.match("/foo/bar")
})

test("Routing should match /foo(/{bar}(/{bay})) with /foo, /foo/knew & /foo/knew/you", function(t) {
  t.plan(6)
  var router = rhumb.create()

  router.add("/foo(/{bar}(/{bay}))", function(params) {
    t.pass("should be called")

    params.bar && t.equal(params.bar, "knew")
    params.bay && t.equal(params.bay, "you")
  })

  router.match("/foo")
  router.match("/foo/knew")
  router.match("/foo/knew/you")
})