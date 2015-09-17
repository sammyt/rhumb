var test  = require('tape')
  , rhumb = require('../../lib/rhumb')

test("should find one fixed part", function(t) {
  var out = rhumb._parse("/foo")

  t.plan(2)
  t.ok(out)
  t.deepEqual(out,
    [ { type: "fixed", input: "foo" } ]
  )
})

test("should find multiple fixed parts", function(t) {
  var out = rhumb._parse("/foo/bar/bing")

  t.plan(2)
  t.ok(out)
  t.deepEqual(out,
    [ { type: "fixed", input: "foo"  }
    , { type: "fixed", input: "bar"  }
    , { type: "fixed", input: "bing" }
    ]
  )
})
test("should find single fixed part for /", function(t) {
  var out = rhumb._parse("/")

  t.plan(2)
  t.ok(out)
  t.deepEqual(out,
    [ { type: "fixed", input: "" } ]
  )
})
