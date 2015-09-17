PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

build: node_modules src/rhumb.js
	echo "--> Building project ..."
	mkdir -p lib
	browserify src/rhumb.js --standalone rhumb -o lib/rhumb.js

test: build
	echo "--> Running tests ..."
	tape test/**/*.js | faucet

node_modules: package.json
	echo "--> Installing dependencies ..."
	npm install

clean:
	rm -rf lib node_modules

all: clean build test

.PHONY: clean all
.SILENT: build test node_modules clean