class DocsContent extends Component{
  constructor(){
    super();
  }

  static getCurrentPageID(){
    return location.pathname.replace("/docs/", "");
  }

  static format(text){
    let arr = text.split("\n")
    return arr;
  }

  //next section in the navigiation
  static handleNext(e,comp){
    var found=false;
    let currentPageID = DocsContent.getCurrentPageID();
  //  console.log(comp);
    for(let key in DocsContent.pages){
      if(found){
        Atlas.pushByPath("/docs/" + key);
        window.scrollTo(0,0);
        break;
      }
      else if(currentPageID == key){
        found = true;
      }
    }
  }

  render(){
    let pageID = DocsContent.getCurrentPageID();
    return DocsContent.pages[pageID].func();
  }
}

DocsContent.nextBtn = function(){
  <quas>
    <div class="docs-footer-nav">
      <div class="footer-nav-btn" onclick=DocsContent.handleNext>Next</div>
    </div>
  </quas>
};

//setup - page content
DocsContent.setup = function(){
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
      <h1>Setting up a Project</h1>
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
      <p>config.json is a JSON file which will decide which files will be bundled for the development build. It is often a good idea to have a seperate JavaScript and CSS files for each component.</p>
      <pre>
      <code>
        {configCode}
      </code>
      </pre>
      You can read more about this in the <a href="production-builds">Production Build</a> section.
      <hr>
      <h2>Starting Point</h2>
      <p>Once quas has loaded it will starts its executing the startQuas function.</p>
      <pre><code>
        "function startQuas()\{\n"+
        "\t//your code goes here\n"+
        "\}"
      </code></pre>
      {DocsContent.nextBtn()}

    </div>
  </quas>
}

//props - page content
DocsContent.components = function(){
  let basicVersion =
    "class MyFirstComponent extends Component{\n"+
    "\trender(){\n"+
    "\t\t\<quas\>\n"+
    "\t\t\t<div>Hello World</div>\n"+
    "\t\t\</quas\>\n"+
    "\t}\n"+
    "}";

  let func = "Quas.render( )";

  let renderCode =
    "// starting point\n"+
    "function startQuas(){\n"+
    "\tlet myComponent = new MyFirstComponent();\n"+
    "\tQuas.render(myComponent, 'body'); //render to the body tag\n"+
    "}";

    let helloRes =
    "\n//result\n<div>\n\tHello World\n"+
    "\t<div>Hello World</div>\n"+
    "</div>";

  <quas>
    <div>
      <h1>Components</h1>
      <p>Making your own component is as simple as making a new class which extends Component and giving it a render function. The render function should contain quas tags. The quas tags should be on seperate lines and everything between the opening and closing quas tag will use a html like syntax.</p>
      <pre>
        <code>{basicVersion}</code>
      </pre>

      <p>To make the content of the component appear on your page you must create an instance of it and call {func}. You can have multiple instances of a component at any time.</p>
      <pre>
        <code>{renderCode}</code>
      </pre>
      <hr>
      <h2>Rendering</h2>
      <p>"There is a few different ways you can render a component. The default way as shown above will append the content of the component as a child of the parent chosen using the query selector. The query selector works the same as JavaScript's document.querySelector( ) e.g. '#id' and '.class'."</p>
      <pre><code>"Quas.render(myComponent, '#myID');"</code></pre>
      <p>Once a component has been rendered to the page the DOM tree for this instance the DOM element will be accessable quickly though 'el' variable.</p>
      <pre><code>"console.log(myComponent.el);"</code></pre>
      <p>Instead of using the query selector you can pass a DOM element as the parent for the rendering. The example below shows how you can make another instance of MyFirstComponent and add the new instance as a child to myComponent</p>
      <pre><code>
        "let anotherComp = new MyFirstComponent();\nQuas.render(anotherComp, myComponent.el);\n{helloRes}" //"
      </code></pre>
      <hr>
      <h2>Render Rules</h2>
      <p>"You can use Quas.renderRule( ) to give extra options when rendering, such as prepend. Prepend will render the component as the first child to the parent rather than the last."</p>
      <pre><code>
        "Quas.renderRule(myComponent, 'body', 'prepend');"
      </code></pre>
      {DocsContent.nextBtn()}
    </div>


  </quas>
}

//props - page content
DocsContent.props = function(){
  <quas>
    <div>Props</div>
  </quas>
}

//updating props - page content
DocsContent.updatingProps = function(){
  <quas>
    <div>Updating Props</div>
  </quas>
}

//event handling - page content
DocsContent.eventHandling = function(){
  <quas>
    <div>Event Handling</div>
  </quas>
}

//sub elements - page content
DocsContent.subElements = function(){
  <quas>
    <div>Sub Elements</div>
  </quas>
}

//conditional rendering - page content
DocsContent.conditionalRendering = function(){
  <quas>
    <div>conditional rendering</div>
  </quas>
}

//production builds - page content
DocsContent.productionBuilds = function(){
  <quas>
    <div>production builds</div>
  </quas>
}

//custom attributes - page content
DocsContent.customAttributes = function(){
  <quas>
    <div>custom attrs</div>
  </quas>
}

//custom events - page content
DocsContent.customEvents = function(){
  <quas>
    <div>custom events</div>
  </quas>
}

//ajax requests - page content
DocsContent.ajaxRequests = function(){
  <quas>
    <div>ajax</div>
  </quas>
}

//url params - page content
DocsContent.urlParameters = function(){
  <quas>
    <div>url params</div>
  </quas>
}

//cookies - page content
DocsContent.cookies = function(){
  <quas>
    <div>Cookies</div>
  </quas>
}

//query elements - page content
DocsContent.queryElements = function(){
  <quas>
    <div>Query DOM tree</div>
  </quas>
}

//scrolling breakpoints - page content
DocsContent.scrollingBreakpoints = function(){
  <quas>
    <div>Scrolling breakpoints</div>
  </quas>
}

//api - page content
DocsContent.api = function(){
  <quas>
    <div>api</div>
  </quas>
}

DocsContent.pages = {
  "setup" : {
    name : "Setup",
    func : DocsContent.setup
  },
  "components" : {
    name : "Components",
    func : DocsContent.components
  },
  "props" : {
    name : "Props",
    func : DocsContent.props
  },
  "updating-props" : {
    name : "Updating Props",
    func : DocsContent.updatingProps
  },
  "event-handling" : {
    name : "Event Handling",
    func: DocsContent.eventHandling
  },
  "sub-elements" : {
    name : "Sub Elements",
    func : DocsContent.subElements
  },
  "conditional-rendering" : {
    name : "Conditional Rendering",
    func : DocsContent.conditionalRendering
  },
  "production-builds" :  {
    name : "Production Builds",
    func : DocsContent.productionBuilds
  },
  "custom-attributes" : {
    name : "Custom Attributes",
    func : DocsContent.customAttributes
  },
  "custom-events" : {
    name : "Custom Events",
    func : DocsContent.customEvents
  },
  "ajax-requests" : {
    name : "AJAX Requests",
    func : DocsContent.ajaxRequests
  },
  "url-parameters" : {
    name : "URL Parameters",
    func : DocsContent.urlParameters
  },
  "cookies" : {
    name : "Cookies",
    func : DocsContent.cookies
  },
  "query-elements" : {
    name : "Query Elements",
    func : DocsContent.queryElements
  },
  "scrolling-breakpoints" : {
    name : "Scrolling Breakpoints",
    func : DocsContent.scrollingBreakpoints
  },
  "api" : {
    name : "API",
    func : DocsContent.api
  }
}