var test  = require('tape')
  , rhumb = require('../../lib/rhumb')

test("should match /woo/wee over /woo/{wee}", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/woo/{wee}", function() {
    t.notOk(true, "should not be called")
  })

  router.add("/woo/wee", function() {
    t.ok(true, "should be called")
  })

  router.match("/woo/wee")
})