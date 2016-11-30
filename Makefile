.PHONY: build var node proxy properties amd size hint clean test web preview pages dependencies

# repository name
REPO = restyle

# make var files
VAR = src/$(REPO).js

# make node files
NODE = $(VAR)

# make amd files
AMD = $(VAR)

LICENSE = template/license.before\
          LICENSE.txt\
          template/license.after

# README constant


# default build task
build:
	make clean
	make var
	make node
	make amd
	make proxy
	make properties
	make test
#	make hint
	make size

# build generic version
var:
	mkdir -p build
	cat template/var.before $(VAR) template/var.after >build/no-copy.$(REPO).max.js
	node node_modules/.bin/uglifyjs --verbose build/no-copy.$(REPO).max.js >build/no-copy.$(REPO).js
	cat $(LICENSE) build/no-copy.$(REPO).max.js >build/$(REPO).max.js
	cat template/copyright build/no-copy.$(REPO).js >build/$(REPO).js
	rm build/no-copy.$(REPO).max.js
	rm build/no-copy.$(REPO).js

# build node.js version
node:
	mkdir -p build
	cat template/license.before LICENSE.txt template/license.after template/node.before $(NODE) template/node.after >build/$(REPO).node.js

# build AMD version
amd:
	mkdir -p build
	cat template/amd.before $(AMD) template/amd.after >build/no-copy.$(REPO).max.amd.js
	node node_modules/.bin/uglifyjs --verbose build/no-copy.$(REPO).max.amd.js >build/no-copy.$(REPO).amd.js
	cat $(LICENSE) build/no-copy.$(REPO).max.amd.js >build/$(REPO).max.amd.js
	cat template/copyright build/no-copy.$(REPO).amd.js >build/$(REPO).amd.js
	rm build/no-copy.$(REPO).max.amd.js
	rm build/no-copy.$(REPO).amd.js


# build restyle.proxy
proxy:
	mkdir -p build
	cat src/proxy-a.js src/utils.js src/proxyHandler.js src/proxy-z.js >build/no-copy.$(REPO).max.proxy.js
	node node_modules/.bin/uglifyjs --verbose build/no-copy.$(REPO).max.proxy.js >build/no-copy.$(REPO).proxy.js
	cat $(LICENSE) build/no-copy.$(REPO).max.proxy.js >build/$(REPO).max.proxy.js
	cat template/copyright build/no-copy.$(REPO).proxy.js >build/$(REPO).proxy.js
	rm build/no-copy.$(REPO).max.proxy.js
	rm build/no-copy.$(REPO).proxy.js


# build restyle.properties (similar to proxy but more compatible)
properties:
	mkdir -p build
	cat src/properties-a.js src/utils.js src/properties.js src/properties-z.js >build/no-copy.$(REPO).max.properties.js
	node node_modules/.bin/uglifyjs --verbose build/no-copy.$(REPO).max.properties.js >build/no-copy.$(REPO).properties.js
	cat $(LICENSE) build/no-copy.$(REPO).max.properties.js >build/$(REPO).max.properties.js
	cat template/copyright build/no-copy.$(REPO).properties.js >build/$(REPO).properties.js
	rm build/no-copy.$(REPO).max.properties.js
	rm build/no-copy.$(REPO).properties.js

size:
	wc -c build/$(REPO).max.js
	gzip -c build/$(REPO).js | wc -c

# hint built file
hint:
	node node_modules/.bin/jshint build/$(REPO).max.js

# clean/remove build folder
clean:
	rm -rf build

# tests, as usual and of course
test:
	npm test

# launch polpetta (ctrl+click to open the page)
web:
	node node_modules/.bin/tiny-cdn run

# markdown the readme and view it
preview:
	node_modules/.bin/md2html.js README.md >README.md.htm
	cat template/md.before README.md.htm template/md.after >README.md.html
	open README.md.html
	sleep 3
	rm README.md.htm README.md.html

pages:
	make var
	mkdir -p ~/tmp
	mkdir -p ~/tmp/$(REPO)
	cp .gitignore ~/tmp/
	cp -rf src ~/tmp/$(REPO)
	cp -rf build ~/tmp/$(REPO)
	cp -rf test ~/tmp/$(REPO)
	cp index.html ~/tmp/$(REPO)
	git checkout gh-pages
	cp ~/tmp/.gitignore ./
	mkdir -p test
	rm -rf test
	cp -rf ~/tmp/$(REPO) test
	git add .gitignore
	git add test
	git add test/.
	git commit -m 'automatic test generator'
	git push
	git checkout master
	rm -r ~/tmp/$(REPO)

# modules used in this repo
dependencies:
	rm -rf node_modules
	mkdir node_modules
	npm install wru
	npm install polpetta
	npm install uglify-js@1
	npm install jshint
	npm install markdown
