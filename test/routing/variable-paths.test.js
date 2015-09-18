var test  = require('tape')
  , rhumb = require('../../lib/rhumb')

test("Routing should match /{foo} with path /bar", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/{foo}", function(params) {
    t.deepEqual(params, { foo: "bar" })
  })

  router.match("/bar")
})

test("Routing should match /wibble/{foo} with path /wibble/bean", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/wibble/{foo}", function(params) {
    t.deepEqual(params, { foo: "bean" })
  })

  router.match("/wibble/bean")
})

test("Routing should match /wibble/{foo}/wobble with path /wibble/humm/wobble", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/wibble/{foo}/wobble", function(params) {
    t.deepEqual(params, { foo: "humm" })
  })

  router.match("/wibble/humm/wobble")
})

test("Routing should match /foo/{bar} and /foo/{bar}/{baz} as different paths", function(t) {
  t.plan(2)

  var router = rhumb.create()

  router.add("/foo/{bar}", function(params) {
    t.deepEqual(params, { bar: "one" })
  })

  router.add("/foo/{bar}/{baz}", function(params) {
    t.deepEqual(params, { bar: "two", baz: "three" })
  })

  router.match("/foo/one")
  router.match("/foo/two/three")
})
