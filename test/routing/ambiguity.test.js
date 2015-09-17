var test  = require('tape')
  , rhumb = require('../../lib/rhumb')

test("should detect /foo/{bar} and /foo(/{maybe}) as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo/{bar})", function() {})

  try {
    router.add("/foo/{maybe})", function() {})
  } catch(e) {
    t.pass("should detect ambiguity")
  }
})