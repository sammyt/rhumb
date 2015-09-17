var test  = require('tape')
  , rhumb = require('../../lib/rhumb')

test("should find a partial part with fixed left and right", function(t) {
  var out = rhumb._parse("/left{page}right")

  t.plan(3)
  t.ok(out)
  t.equal(out.length, 1)
  t.equal(out[0].type, "partial")
})
test("should find a partial part with fixed right", function(t) {
  var out = rhumb._parse("/{page}right")

  t.plan(3)
  t.ok(out)
  t.equal(out.length, 1)
  t.equal(out[0].type, "partial")
})
test("should find a partial part with fixed left", function(t) {
  var out = rhumb._parse("/left{page}")

  t.plan(3)
  t.ok(out)
  t.equal(out.length, 1)
  t.equal(out[0].type, "partial")
})