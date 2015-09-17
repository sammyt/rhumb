var test  = require('tape')
  , rhumb = require('../../lib/rhumb')

test("routing should match /page-{num} with path /page-four", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/page-{num}", function(params) {
    t.deepEqual(params, { num : "four" })
  })

  router.match("/page-four")
})

test("routing should match /page-{num} with path /page-4", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/page-{num}", function(params) {
    t.deepEqual(params, { num : "4" })
  })

  router.match("/page-4")
})

test("routing should match /i-{action}-you with path /i-poke-you", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/i-{action}-you", function(params) {
    t.deepEqual(params, { action: "poke" })
  })

  router.match("/i-poke-you")
})

test("routing should match /fix/i-{action}-you/faff with path /fix/i-poke-you/faff", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/fix/i-{action}-you/faff", function(params) {
    t.deepEqual(params, { action: "poke" })
  })

  router.match("/fix/i-poke-you/faff")
})

test("routing should match /{day}-{month}-{year} with path /mon-01-2020", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/{day}-{month}-{year}", function(params) {
    t.deepEqual(params, { day: "mon", month: "01", year: "2020" })
  })

  router.match("mon-01-2020")
})
