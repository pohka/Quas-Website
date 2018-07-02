## Road Map
* API documentation
  * Dropdown for different API versions
  * search api
* Pages
  * Home Page
  * Download Page
* Quas
  * import Quas.Router (import main modules)
  * lazy loading routes
    * if you have a large web app it can be quicker to have certain parts in their own bundle and load them afterwards when requested. This is so we don't have to load a single massive bundle
  * scroll behaviour (options)
    * go to top of page
    * save scroll height
    * save scroll anchor
    * is component visible
  * finish markdown module
  * remake transpiler
    * fix all the custom attrs
    * remove need of quas tags
  * dealing events in child components
  * form handling
  * handling of animations (entry and exit)
  * keys, so components and list items don't do unnecessary rerender


## important stuff
* api gen
* import Quas.Router

## DOCS
  * onclick-onscroll=function(){} - multiple events with same function

## Known Issues
* highlighter:
 * comment at end of string with no new line
 * removes space character after a comment
 * doesn't highlight keyword with different delimiters
   * e.g. func(this) 'this' key word is never highlighted
* Quas
  * ensure async load meta data can be crawled by search engine
  * router with url values e.g. /video?w=123
  * problems with functions calls
* site
  * click

## routing features to add
* onBeforePush() - e.g. user navigates away but the current page has input data that they might not want to lose
* fetch data and then navigate if no caught error
