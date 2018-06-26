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
* lazy loading routes
  * if you have a large web app it can be quicker to have certain parts in their own bundle and load them afterwards when requested. This is so we don't have to load a single massive bundle
* scroll behaviour (options)
  * go to top of page
  * save scroll height
  * save scroll anchor
  * is component visible

## DOCS
  * onclick-onscroll=function(){} - multiple events with same function
  * fix router with pushing href with no matching id

## Known Issues
* highlighter:
 * comment at end of string with no new line
 * removes space character after a comment
 * doesn't highlight keyword with different delimiters
   * e.g. func(this) 'this' key word is never highlighted
* rendering if parent is undefined
* test if unmounting and rendering the component again will mess up vdom synced with dom
* router aliases with dynamic urls e.g. /other/:page
* ensure async load meta data can be crawled by search engine
* /docs/ permission is denied

## routing features to add
* onBeforePush() - check permissions before loading
* fetch data and then navigate if no error
