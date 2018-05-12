class DocsContent extends Component{
  constructor(){
    super();
    this.pages = {
      "setup" : this.setup,
      "props" : this.props,
      "updating-props" : this.updatingProps,
      "event-handling" : this.eventHandling,
      "sub-elements" : this.subElements,
      "conditional-rendering" : this.conditionalRendering,
      "production-builds" : this.productionBuilds,
      "custom-attributes" : this.customAttributes,
      "custom-events" : this.customEvents,
      "ajax-requests" : this.ajaxRequests,
      "url-parameters" : this.urlParameters,
      "cookies" : this.cookies,
      "query-elements" : this.queryElements,
      "scrolling-breakpoints" : this.scrollingBreakpoints,
      "api" : this.api
    }

    //decide starting page content based on the url
    DocsContent.currentPage = this.setup;
    let url = location.pathname.replace("/docs/", "");
    let pageID = DocsNav.getPageID(url);
    let startingPage = this.pages[pageID];
    if(startingPage !== undefined){
      DocsContent.currentPage = startingPage;
    }
  }

  render(){
    return DocsContent.currentPage();
  }
}

//change the content on the page, using the pageID
DocsContent.prototype.set = function(pageID){
  if(this.pages[pageID] != this.currentPage){
    DocsContent.currentPage = this.pages[pageID];
  }
  Quas.rerender(DocsNav.content);
}

//setup - page content
DocsContent.prototype.setup = function(){
  <quas>
    <div>How to setup</div>
  </quas>
}

//props - page content
DocsContent.prototype.props = function(){
  <quas>
    <div>Props</div>
  </quas>
}

//updating props - page content
DocsContent.prototype.updatingProps = function(){
  <quas>
    <div>Updating Props</div>
  </quas>
}

//event handling - page content
DocsContent.prototype.eventHandling = function(){
  <quas>
    <div>Event Handling</div>
  </quas>
}

//sub elements - page content
DocsContent.prototype.subElements = function(){
  <quas>
    <div>Sub Elements</div>
  </quas>
}

//conditional rendering - page content
DocsContent.prototype.conditionalRendering = function(){
  <quas>
    <div>conditional rendering</div>
  </quas>
}

//production builds - page content
DocsContent.prototype.productionBuilds = function(){
  <quas>
    <div>production builds</div>
  </quas>
}

//custom attributes - page content
DocsContent.prototype.customAttributes = function(){
  <quas>
    <div>custom attrs</div>
  </quas>
}

//custom events - page content
DocsContent.prototype.customEvents = function(){
  <quas>
    <div>custom events</div>
  </quas>
}

//ajax requests - page content
DocsContent.prototype.ajaxRequests = function(){
  <quas>
    <div>ajax</div>
  </quas>
}

//url params - page content
DocsContent.prototype.urlParameters = function(){
  <quas>
    <div>url params</div>
  </quas>
}

//cookies - page content
DocsContent.prototype.cookies = function(){
  <quas>
    <div>Cookies</div>
  </quas>
}

//query elements - page content
DocsContent.prototype.queryElements = function(){
  <quas>
    <div>Query DOM tree</div>
  </quas>
}

//scrolling breakpoints - page content
DocsContent.prototype.scrollingBreakpoints = function(){
  <quas>
    <div>Scrolling breakpoints</div>
  </quas>
}

//api - page content
DocsContent.prototype.api = function(){
  <quas>
    <div>api</div>
  </quas>
}
