## Road Map
* Atlas.pathMatches("/docs/\*")
* custom attribute loader and packager
* new bundling system
* API documentation generator
* API for different versions
* Home Page
* Download Page

## Known Issues
* highlighter:
 * comment at end of string with no new line
 * removes space character after a comment
 * doesn't highlight keyword with different delimiters
   * e.g. func(this) 'this' key word is never highlighted

## diffVDOM
* proper diffing for custom attrs
* custom attributes should append the vdom when creating dom elements
* change event listeners

## DOCS
* onclick-onscroll=function(){} - multiple events with same function
