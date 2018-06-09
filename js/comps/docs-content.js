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
  let code1 = "class MyComponent extends Component{\n"+
  "\tconstructor(){\n"+
  "\t\tsuper();\n"+
  "\t\tthis.name = 'john doe';\n"+
  "\t}\n\n"+
  "\t//Hello john doe\n"+
  "\trender(){\n"+
  "\t\t\<quas\>\n"+
  "\t\t\t<div>Hello {this.name}</div>\n"+
  "\t\t\</quas\>\n"+
  "\t}\n"+
  "}";

  let code2 = "class MyComponent extends Component{\n"+
  "\tconstructor(name){\n"+
  "\t\tsuper();\n"+
  "\t\tthis.name = name;\n"+
  "\t\tthis.surname = 'doe';\n"+
  "\t}\n\n"+
  "\trender(){\n"+
  "\t\t\<quas\>\n"+
  "\t\t\t<div>\n"+
  "\t\t\t\t{this.name, ' ', this.surname}, is your name really {this.name}?\n"+
  "\t\t\t</div>\n"+
  "\t\t\</quas\>\n"+
  "\t}\n"+
  "}\n"+
  "\n...\n\n"+
  "//render 'john doe, is your name really john?' to the body tag\n"+
  "Quas.render(new MyComponent('john'), 'body');"
  ;

  <quas>
    <div>
      <h1>Props</h1>
      <p>"A prop (property) allows you to pass a value as input. Just surround the value in curly brackets"</p>
      <pre>
        <code>
          {code1}
        </code>
      </pre>
      <hr>
      <h2>Multiple Props</h2>
      <p>If you need to use multiple props together you must put commas between each value. You can also pass arguments to the constructor.</p>
      <pre>
        <code>
          {code2}
        </code>
      </pre>

      {DocsContent.nextBtn()}
    </div>
  </quas>
}

//updating props - page content
DocsContent.updatingProps = function(){
  let code1 =
    "//comp.name = john\n"+
    "let comp = new MyComponent('john');\n"+
    "Quas.render(comp, 'body');\n"+
    "comp.name = doe;\n\n"+
    "//comp has not updated on the page, so you must rerender it\n"+
    "Quas.rerender(comp);"
  ;

  let code2 =
  "let comp = new MyComponent('john');\n"+
  "Quas.render(comp, 'body');\n"+
  "comp.setProp('name', 'doe'); //sets and rerenders the component";

  <quas>
    <div>
      <h1>Updating Props</h1>
      <p>If the value of a a prop changes the component must be rerendered to update the value on the DOM tree.</p>
      <pre><code>
        {code1}
      </code></pre>
      <p>"Alternatively if you are only changing one prop you can use setProp( ) which will rerender the component after setting the new value"</p>
      <pre><code>
        {code2}
      </code></pre>

      {DocsContent.nextBtn()}
    </div>
  </quas>
}

//event handling - page content
DocsContent.eventHandling = function(){
  let code1 =
    "class MyComponent extends Component{\n\n"+
    "\tstatic handleClick(event, component){\n"+
    "\t\tconsole.log('clicked');\n"+
    "\t}\n\n"+
    "\trender(){\n"+
    "\t\t\<quas\>\n"+
    "\t\t\t<button onclick={MyComponent.handleClick}>Click Me</button>\n"+
    "\t\t\</quas\>\n"+
    "\t}\n"+
    "}";

  <quas>
    <div>
      <h1>Event Handling</h1>
      <p>You can creat a function to which will handle the event. All of the HTML DOM Events are supported.</p>
      <pre><code>
        {code1}
      </code></pre>

      {DocsContent.nextBtn()}
    </div>
  </quas>
}

//sub elements - page content
DocsContent.subElements = function(){
  let code1 =
    "class MyComponent extends Component{\n\n"+
    "\tstatic genItem(name){\n"+
    "\t\t\<quas\>\n"+
    "\t\t\t<div>Hello {name}<div>\n"+
    "\t\t\</quas\>\n"+
    "\t}\n\n"+
    "\trender(){\n"+
    "\t\t\<quas\>\n"+
    "\t\t\t{MyComponent.genItem('john')}\n"+
    "\t\t\</quas\>\n"+
    "\t}\n"+
    "}";

  <quas>
    <div>
      <h1>Sub Elements</h1>
      <p>You can create sub elements like so:</p>
      <pre><code>
        {code1}
      </code></pre>

      {DocsContent.nextBtn()}
    </div>
  </quas>
}

//conditional rendering - page content
DocsContent.conditionalRendering = function(){
  let code1 =
    "class MyComponent extends Component{\n"+
    "\tconstructor(name, age){\n"+
    "\t\tsuper();\n"+
    "\t\tthis.name = name;\n"+
    "\t\tthis.age = age;\n"+
    "\t}\n\n"+
    "\tstatic genItem(name, age){\n"+
    "\t\tif(age > 12){\n"+
    "\t\t\t\<quas\>\n"+
    "\t\t\t\t<div>Welcome {name}<div>\n"+
    "\t\t\t\</quas\>\n"+
    "\t\t}\n"+
    "\t\telse{\n"+
    "\t\t\t\<quas\>\n"+
    "\t\t\t\t<div>You are too young to use this website<div>\n"+
    "\t\t\t\</quas\>\n"+
    "\t\t}\n"+
    "\t}\n\n"+
    "\trender(){\n"+
    "\t\t\<quas\>\n"+
    "\t\t\t{MyComponent.genItem(this.name, this.age)}\n"+
    "\t\t\</quas\>\n"+
    "\t}\n"+
    "}";

  <quas>
    <div>
      <h1>Conditional Rendering</h1>
      <p>You can decide what the render with conditional statements. It is typically best practice to do this within sub elements rather than in the render function. This is becasue the brackets for the if statement should surround the quas blocks.</p>
      <pre><code>
        {code1}
      </code></pre>

      {DocsContent.nextBtn()}
    </div>
  </quas>
}

//production builds - page content
DocsContent.productionBuilds = function(){
  let code1 =
    '<script src="/quas/quas.js"></script>\n'+
    '<script src="/quas/mybundle.js"></script>\n'+
    '<!--\n\t<script src="/quas/quas-dev.js"></script>\n'+
    '\t<script>Quas.devBuild("/config.json");</script>\n-->';

  <quas>
    <div>
      <h1>Production Builds</h1>
      <p>When using a development build the process of bundling will be done when the page loads, however you can export a production build which means you can remove the need of quas-dev.js
        <br><br>
        You can do this by opening your browsers console and using one of the following commands
      </p>
      <pre><code>
        "// this will create mybundle.js with the bundled javascript\n"+
        "Quas.build('mybundle', 'js');\n\n\n"+
        "// If using css in the config file \n"+
        "// this command will create 2 files one for the \n"+
        "// javascript and another for the css\n"+
        "Quas.build();"
      </code></pre>

      <p>Once you have the bundled file you must link it in your html and then remove the code which links quas-dev.js and also remember to remove the call to Quas.devBuild</p>
      <pre><code>
        {code1}
      </code></pre>

      {DocsContent.nextBtn()}
    </div>
  </quas>
}

//custom attributes - page content
DocsContent.customAttributes = function(){
  let code1 =
  "class Todo extends Component{\n"+
    "\tconstructor(listItems){\n"+
    "\t\tsuper();\n"+
    "\t\tthis.listItems = listItems;\n"+
    "\t}\n\n"+
    "\trender(){\n"+
    "\t\t\<quas\>\n"+
    "\t\t\t<div>\n"+
    "\t\t\t\t<ul q-foreach-li={this.listItems}></ul>\n"+
    "\t\t\t<div>\n"+
    "\t\t\</quas\>\n"+
    "\t}\n"+
    "}\n\n"+
    "Quas.render(new Todo([\n"+
    "\t'item 1',\n"+
    "\t'item 2',\n"+
    "\t'item 3'\n"+
    "]), 'body');";

  let code2 =
    "<!-- format: q-CommandName-Param1-Param2=value -->\n"+
    "<div q-log-foo=10>example</div>\n\n"+
    "Quas.customAttrs['log'] = function(component, \n\tparentDOMElement, params, value){\n"+
    "\t// prints the first param a number of times\n"+
    "\tfor(let i=0; i<value; i++){\n"+
    "\t\tconsole.log(params[2]);\n"+
    "}";

  ;
  <quas>
    <div>
      <h1>Custom Attributes</h1>
      <p>Quas comes with some custom html attributes which allow you to define components easier. You can also add your own custom attributes and define how they should be handled</p>

      <pre><code>
        {code1}
      </code></pre>

      <p>To create your own custom attributes you must set add a function to Quas.customAttrs. All custom attribute will have the prefix 'q-' in the html code and the command will come next. Here is an example which will print out a parameter a given number of times</p>
      <pre><code>
        {code2}
      </code></pre>

      <p>Params will be the key of the attribute split by '-' so in the example it will be [ 'q', 'log', 'foo' ]</p>

      {DocsContent.nextBtn()}
    </div>
  </quas>
}

//custom events - page content
DocsContent.customEvents = function(){
  let code1 =
    "Quas.addEventListener('myEvent', function(data){\n"+
    "\tconsole.log('i am listening to' + data);\n"+
    "});\n\n"+
    "...\n\n"+
    "Quas.broadcastEvent('myEvent', 'music');";

  <quas>
    <div>
      <h1>Custom Events</h1>
      <p>This will allow you to broadcast data to all the existing listeners</p>
      <pre><code>
        {code1}
      </code></pro>

      {DocsContent.nextBtn()}
    </div>
  </quas>
}

//ajax requests - page content
DocsContent.ajaxRequests = function(){
  let code1 =
    "Quas.ajax({\n"+
    "\turl : 'login.php',\n"+
    "\ttype : 'POST',\n"+
    "\tdata : {\n"+
    "\t\tusername : 'john doe',\n"+
    "\t\tpass : '123AA',\n"+
    "\t}\n"+
    "\treturn : 'json',\n"+
    "\tsuccess : function(result){\n"+
    "\t\t...\n"+
    "\t},\n"+
    "\terror : function(errorMsg, errorCode){}\n"+
    "});";


  let testCode = "let i = 0;\nvar j=1;";

  <quas>
    <div>
      <h1>AJAX Requests</h1>
      <p>Request data from a server</p>
      <pre>
        <code q-code="{testCode}"></code>
      </pre>

      {DocsContent.nextBtn()}
    </div>
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
