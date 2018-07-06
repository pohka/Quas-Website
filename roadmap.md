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
    * fix all the custom attrs*** remake them
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
  * state manager, for not spwa
  * standardized way of dealing with async loading data, i.e. this.prop.isLoaded
  * emit custom event to all components
  * new syntax for adding a vdom as a prop rather than appending it from a container, as there is an extra element created for no reason
    * current: <div q-append="{[vdom]}"></div><div q-append="{[vdom]}"></div>
    * change to: ?
  * easier way of doing tables, so you can hide rows


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
* quas-dev doesn't properly transpile spaces in array
  * e.g. #<tr q-for-td="['item 1', 'item 2']">
  * however this works: #<tr q-for-td="myArray">
* q-else="" remove requirement for attrs to have a value

## routing features to add
* onBeforePush() - e.g. user navigates away but the current page has input data that they might not want to lose
* fetch data and then navigate if no caught error





## new custom attrs
* data param types:
  * variable (string/number/boolean)
  * array of variables (strings/numbers/boolean)
  * object (keys and values)
  * array of objects

* combine with other custom attrs
  * if statements (conditional)

* output
 * set or remove a basic attribute
 * create/remove a childNode
  * single node
  * template
 * change a childNode

* need to be able to parse {} within {} e.g. {myfunc( {name:"world"} )}
----

this.templates = {};
templates["sample"] = #<div>animal is a {name}</div>;
templates["user"] = {
    temp : #<div>{user.name} is {user.age} years old</div>;
    props : [user]
}

* if statement with variable
q-if="{(age > 18)}"


* if statement with an object
user = { age: 10, name: "john" };
q-if="{(user.age > 18)}"


* if statement with array of variables
items = ["dog", "cat", "bird"];
<div
q-for="{i in animals}"
q-if="{(animals[i] > 18)}"
q-template="sample"
q-props="{name:animals[i]}" ></div>


* if statement with array of objects
users = [{ age:10, name: "john" }, ...]
q-for="{user in users}"
q-if="{(user.age > 18)}"
q-template="user"
q-props="{user}"



-
