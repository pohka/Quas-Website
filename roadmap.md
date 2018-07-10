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
  * dealing changes in child components
  * form handling
  * handling of animations (entry and exit)
  * keys, so components and list items don't do unnecessary rerender
  * event attrs, some simple common functions
  * q-heading - set id and text content to same thing so it is possible to has navigate to it
    * <h2 q-heading="Test Me"></h2>
    * result: <h2 id="TestMe">Test Me</h2>
  * q-prepend
  * events  bind functon with variable i.e. on-click="increment, 1" on-click="increment, -1"
  * having props update reactivelt rather than using .setProps()
  * option to use:
    * <div .myClass #myID></div> rather than
    * <div class="myClass" id="myID"></div>
  * component style function for components css classes
  * Store data is get and set directly, state can be updated reactively without setState()
  * standardized way of dealing with async loading data, i.e. this.prop.isLoaded
  * new syntax for adding a vdom as a prop rather than appending it from a container, as there is an extra element created for no reason
    * current: <div q-append="{[vdom]}"></div><div q-append="{[vdom]}"></div>
    * change to: ?
  * easier way of doing tables, so you can hide rows
  * reuse a template multiple times without declaring an array or data
    * <div q-template-for="['myTemplate', [,,,]]"> //works but not optimal
    * <div q-template-for="['myTemplate', 4]">
  * Store, option to save data to local storage


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
* quas-dev doesn't properly transpile spaces in array:
  * e.g. #<tr q-for-td="['item 1', 'item 2']">
  * however this works: #<tr q-for-td="myArray">
* q-else="" remove requirement for attrs to have a value

## routing features to add
* onBeforePush() - e.g. user navigates away but the current page has input data that they might not want to lose





//built in module
import Quas.Router

//developer created component or module
const myModule = require("/modules/module-name.js")

//style sheets
link "/mystyle.css"


# important
* don't reuse vdoms after they have been evaluated once as a custom attr are not handled if evaluated twice. This is quite noticeable if you use q-append











-
