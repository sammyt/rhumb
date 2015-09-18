var test  = require('tape')
  , rhumb = require('../../lib/rhumb')

test("Routing should match /woo/wee over /woo/{wee}", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/woo/{wee}", function() {
    t.fail("should not be called")
  })

  router.add("/woo/wee", function() {
    t.pass("should be called")
  })

  router.match("/woo/wee")
})