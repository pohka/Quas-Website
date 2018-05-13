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
    DocsContent.pageID = DocsNav.getPageID(url);
    let startingPage = this.pages[DocsContent.pageID];
    if(startingPage !== undefined){
      DocsContent.currentPage = startingPage;
    }
  }

  static format(text){
    let arr = text.split("\n")
    return arr;
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
  let code1 =
  '<!--Linking Quas-->\n'+
  '<script src="quas/quas.js"></script>\n'+
  '<script src="quas/quas-dev.js"></script>\n'+
  '<script>Quas.devBuild("config.json");</script>';

  let configCode =
  '{\n'+
  '\t"js":[\n'+
  '\t\t"/js/main"\n'+
  '\t]\n'+
  '}';

  <quas>
    <div>
      <h1>Setting Up a Project</h1>
      <span class="centered">Download and extract the Quas boilerplate project</span>
      <button class="download-btn">Download</button>
      <hr>
      <h2>Getting Started</h2>
      <p>Quas uses a component based system to render elements. When a component is changed it can be rerendered to update the changes. But before we look at components and the rich features of Quas we will first have a quick look at the structure of the boilerplate project.</p>
      <br>
      index.html
      <pre>
      <code>
        {code1}
      </code>
      </pre>
      <ul>
        <li>quas.js is the library</li>
        <li>quas-dev.js is used for development builds which bundles at runtime based off a config file</li>
        <li>Quas.devBuild assigns the config file to use for the runtime bundling</li>
      </ul>
      <hr>
      <h2>The Config File</h2>
      config.json is a JSON file which will decide which files will be bundled for the development build. It is often a good idea to have a seperate JavaScript and CSS files for each component.
      <pre>
      <code>
        {configCode}
      </code>
      </pre>
      You can read more about this in the <a href="production-builds">Production Build</a> section.
    </div>
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
