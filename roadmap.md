## Road Map
* API documentation generator
* API for different versions
* Home Page
* Download Page
* decide what other functionality within quas needs to be separated into its own module
  * scroll tracker
* import Quas.Router (import main modules)
* static comps, dont diff vdom when rerendering
* vdom events use promises so you can use this keyword
* q-append (append an array of vdoms)

## Known Issues
* highlighter:
 * comment at end of string with no new line
 * removes space character after a comment
 * doesn't highlight keyword with different delimiters
   * e.g. func(this) 'this' key word is never highlighted

## DOCS
* onclick-onscroll=function(){} - multiple events with same function
* fix router with pushing href with no matching id

## issues
* rendering if parent is undefined
* back and forward history doesn't work properly (make sure it also works with router aliases and redirects)
* test if unmounting and rendering the component again will mess up vdom synced with dom
* router aliases with dynamic urls e.g. /other/:page
* ensure async load meta data can be crawled by search engine
* vdom diffing bug if root tag changes e.g. h1 to div
* /docs/ permission is denied

## routing
* vue
  * each route has an array of components
  * reusing components
  * child routes for nesting
  * params from path: /user/:userid
  * push with params e.g. router.push({ path: `/user/${userId}` })
  * redirects (for old urls)
  * path meta data
  * route navigation states
    * beforeRouteEnter
    * beforeRouteUpdate
    * beforeRouteExit
  * feching data from server
    * navigate and then fetch
    * fetch data and then navigate
  * scroll behaviour (options)
    * go to top of page
    * save scroll height
    * save scroll anchor
  * lazy loading routes
    * if you have a large web app it can be quicker to have certain parts in their own bundle and load them afterwards when requested. This is so we don't have to load a single massive bundle
