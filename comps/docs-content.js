Quas.export(
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
          Router.pushByPath("/docs/" + key);
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


    static nextBtn(){
      return (
        <quas>
          <div class="docs-footer-nav">
            <div class="footer-nav-btn" onclick=DocsContent.handleNext>Next</div>
          </div>
        </quas>
      );
    };

    //setup - page content
    static setup(){
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

      let codeStart =
      "function startQuas()\{\n"+
      "\t//your code goes here\n"+
      "\}";

      return (
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
              <code q-code="{code1}"></code>
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
              <code q-code="{configCode}"></code>
            </pre>
            You can read more about this in the <a href="/docs/production-builds">Production Build</a> section.
            <hr>
            <h2>Starting Point</h2>
            <p>Once quas has loaded it will starts its executing the startQuas function.</p>
            <pre>
              <code q-code="{codeStart}"></code>
            </pre>
            {DocsContent.nextBtn()}

          </div>
        </quas>
      );
    }

    //props - page content
    static components(){
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

        let code3 =
        "let anotherComp = new MyFirstComponent();\n"+
        "Quas.render(anotherComp, myComponent.el);\n"+
        "\n//result\n<div>\n\tHello World\n"+
        "\t<div>Hello World</div>\n"+
        "</div>";

      let code4 = "Quas.renderRule(myComponent, 'body', 'prepend');";
      let code5 = "console.log(myComponent.el);";
      let code6 = "Quas.render(myComponent, '#myID');";

      return (
        <quas>
          <div>
            <h1>Components</h1>
            <p>Making your own component is as simple as making a new class which extends Component and giving it a render function. The render function should contain quas tags. The quas tags should be on seperate lines and everything between the opening and closing quas tag will use a html like syntax.</p>
            <pre>
              <code q-code="{basicVersion}"></code>
            </pre>

            <p>To make the content of the component appear on your page you must create an instance of it and call {func}. You can have multiple instances of a component at any time.</p>
            <pre>
              <code q-code="{renderCode}"></code>
            </pre>
            <hr>
            <h2>Rendering</h2>
            <p>"There is a few different ways you can render a component. The default way as shown above will append the content of the component as a child of the parent chosen using the query selector. The query selector works the same as JavaScript's document.querySelector( ) e.g. '#id' and '.class'."</p>
            <pre>
              <code q-code="{code6}"></code>//\""
            </pre>
            <p>Once a component has been rendered to the page the DOM tree for this instance the DOM element will be accessable quickly though 'el' variable.</p>
            <pre>
              <code q-code="{code5}"></code> //\""
            </pre>

            <p>Instead of using the query selector you can pass a DOM element as the parent for the rendering. The example below shows how you can make another instance of MyFirstComponent and add the new instance as a child to myComponent</p>

            <pre>
              <code q-code="{code3}"></code> //\""
            </pre>

            <hr>
            <h2>Render Rules</h2>
            <p>"You can use Quas.renderRule( ) to give extra options when rendering, such as prepend. Prepend will render the component as the first child to the parent rather than the last."</p>
            <pre>
              <code q-code="{code4}"></code>
            </pre>
            {DocsContent.nextBtn()}
          </div>


        </quas>
      );
    }

    //props - page content
    static props(){
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

      return (
        <quas>
          <div>
            <h1>Props</h1>
            <p>"A prop (property) allows you to pass a value as input. Just surround the value in curly brackets"</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>
            <hr>
            <h2>Multiple Props</h2>
            <p>If you need to use multiple props together you must put commas between each value. You can also pass arguments to the constructor.</p>
            <pre>
              <code q-code="{code2}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //updating props - page content
    static updatingProps(){
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

      return (
        <quas>
          <div>
            <h1>Updating Props</h1>
            <p>If the value of a a prop changes the component must be rerendered to update the value on the DOM tree.</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>
            <p>"Alternatively if you are only changing one prop you can use setProp( ) which will rerender the component after setting the new value"</p>
            <pre>
              <code q-code="{code2}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //event handling - page content
    static eventHandling(){
      let code1 =
        "class MyComponent extends Component{\n"+
        "\tstatic handleClick(event, component){\n"+
        "\t\tconsole.log('clicked');\n"+
        "\t}\n\n"+
        "\trender(){\n"+
        "\t\t\<quas\>\n"+
        "\t\t\t<button onclick={MyComponent.handleClick}>Click Me</button>\n"+
        "\t\t\</quas\>\n"+
        "\t}\n"+
        "}";

      return (
        <quas>
          <div>
            <h1>Event Handling</h1>
            <p>You can creat a function to which will handle the event. All of the HTML DOM Events are supported.</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //sub elements - page content
    static subElements(){
      let code1 =
        "class MyComponent extends Component{\n"+
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

      return (
        <quas>
          <div>
            <h1>Sub Elements</h1>
            <p>You can create sub elements like so:</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //conditional rendering - page content
    static conditionalRendering(){
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

      return (
        <quas>
          <div>
            <h1>Conditional Rendering</h1>
            <p>You can decide what the render with conditional statements. It is typically best practice to do this within sub elements rather than in the render function. This is becasue the brackets for the if statement should surround the quas blocks.</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //production builds - page content
    static productionBuilds(){
      let code1 =
        '<script src="/quas/quas.js"></script>\n'+
        '<script src="/quas/mybundle.js"></script>\n'+
        '<!--\n  <script src="/quas/quas-dev.js"></script>\n'+
        '  <script>Quas.devBuild("/config.json");</script>\n-->';

      let code2 =
        "// this will create mybundle.js with the bundled javascript\n"+
        "Quas.build('mybundle', 'js');\n\n\n"+
        "// If using css in the config file \n"+
        "// this command will create 2 files one for the \n"+
        "// javascript and another for the css\n"+
        "Quas.build();";

      return (
        <quas>
          <div>
            <h1>Production Builds</h1>
            <p>When using a development build the process of bundling will be done when the page loads, however you can export a production build which means you can remove the need of quas-dev.js
              <br><br>
              You can do this by opening your browsers console and using one of the following commands
            </p>
            <pre>
              <code q-code="{code2}"></code>
            </pre>

            <p>Once you have the bundled file you must link it in your html and then remove the code which links quas-dev.js and also remember to remove the call to Quas.devBuild</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //custom attributes - page content
    static customAttributes(){
      let code1 =
      "class Todo extends Component{\n"+
        "  constructor(listItems){\n"+
        "    super();\n"+
        "    this.listItems = listItems;\n"+
        "  }\n\n"+
        "   render(){\n"+
        "    <quas\>\n"+
        "       <div>\n"+
        "         <ul q-foreach-li={this.listItems}></ul>\n"+
        "       <div>\n"+
        "     \</quas\>\n"+
        "  }\n"+
        "}\n\n"+
        "Quas.render(new Todo([\n"+
        "  'item 1',\n"+
        "  'item 2',\n"+
        "  'item 3'\n"+
        "]), 'body');";

      let code2 =
        "<!-- format: q-CommandName-Param1-Param2=value -->\n"+
        "<div q-log-foo=10>example</div>\n\n"+
        "Quas.customAttrs['log'] = function(component, \n\tparentDOMElement, params, value){\n"+
        "  // prints the first param a number of times\n"+
        "  for(let i=0; i<value; i++){\n"+
        "    console.log(params[2]);\n"+
        "}";

      ;

      return (
        <quas>
          <div>
            <h1>Custom Attributes</h1>
            <p>Quas comes with some custom html attributes which allow you to define components easier. You can also add your own custom attributes and define how they should be handled</p>

            <pre>
              <code q-code="{code1}"></code>
            </pre>

            <p>To create your own custom attributes you must set add a function to Quas.customAttrs. All custom attribute will have the prefix 'q-' in the html code and the command will come next. Here is an example which will print out a parameter a given number of times</p>
            <pre>
              <code q-code="{code2}"></code>
            </pre>

            <p>Params will be the key of the attribute split by '-' so in the example it will be [ 'q', 'log', 'foo' ]</p>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //custom events - page content
    static customEvents(){
      let code1 =
        "Quas.addEventListener('myEvent', function(data){\n"+
        "  console.log('i am listening to' + data);\n"+
        "});\n\n"+
        "...\n\n"+
        "Quas.broadcastEvent('myEvent', 'music');";

      return (
        <quas>
          <div>
            <h1>Custom Events</h1>
            <p>This will allow you to broadcast data to all the existing listeners</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //ajax requests - page content
    static ajaxRequests(){
      let code1 =
        "Quas.ajax({\n"+
        "  url : 'login.php',\n"+
        "  type : 'POST',\n"+
        "  data : {\n"+
        "    username : 'john doe',\n"+
        "    pass : '123AA',\n"+
        "  }\n"+
        "  return : 'json',\n"+
        "  success : function(result){\n"+
        "    ...\n"+
        "  },\n"+
        "  error : function(errorMsg, errorCode){}\n"+
        "});";


      let testCode =
        "let i = 0;\n"+
        "while(i < 10){ //comment\n"+
        "  //another comment heere\n"+
        "  console.log('\'hi');\n"+
        "  i++;\n"+
        "}\n\n" +
        "\<quas\>\n"+
        "  <div class='{test}'></div>\n"+
        "\</quas\>\n\n"+
        "if(i==0){ let n =0;";


      return (
        <quas>
          <div>
            <h1>AJAX Requests</h1>
            <p>Request data from a server</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //url params - page content
    static urlVariables(){
      let code1 =
        "//returns json object with the key values\n"+
        "let data = Quas.getUrlValues(); \n\n"+
        "//example: site.com/watch?video=abc&hd=true\n"+
        "console.log(data['hd']); //true\n" +
        "data['video'] = 'xyz';\n\n"+
        "Quas.setUrlValues(data); \n"+
        "//result: site.com/watch?video=xyz&hd=true\n";

      let code2 =
        "//example: site.com/watch?video=abc&hd=true\n"+
        "let data = Quas.getUrlValues(); \n"+
        "delete data['hd'];\n"+
        "Quas.setUrlValues(data);\n" +
        "//result: site.com/watch?video=abc\n";

      return (
        <quas>
          <div>
            <h1>URL Variables</h1>
            <p>You can easily get and set url variables with quas<p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            <p>If you want to remove a variable simply get the current url variables and delete the key</p>
            <pre>
              <code q-code="{code2}"></code>
            </pre>

            <p>There is no need to encode or decord the uri because these 2 functions will do that for you</p>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //cookies - page content
    static cookies(){
      let code1 =
        "//get the expire date in 1 year time\n"+
        "let date = new Date();\n"+
        "date.setYear(date.getFullYear() + 1);\n\n"+
        "Quas.setCookie('loginID', 'abc', date);\n"+
        "let myLoginID = Quas.getCookie('loginID');\n"+
        "console.log(myLoginID); //abc\n\n"+
        "//remove the cookie\n" +
        "Quas.clearCookie('loginID');";

      return (
        <quas>
          <div>
            <h1>Cookies</h1>
            <p>You can easily get and set cookies with quas</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //query elements - page content
    static queryElements(){
    let code1 =
      "let c = new MyComponent();\n"+
      "Quas.render(c, 'body');\n\n"+

      "//this will return a HTMLDOMElement using the query selector\n"+
      "let element = Quas.findChild(c, '#nameInput');\n"+
      "element.value = 'hello';";

      return (
        <quas>
          <div>
            <h1>Query DOM tree</h1>
            <p>If you want to find a DOM element within your component after it is rendered you can use this function</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //scrolling breakpoints - page content
    static scrollingBreakpoints(){
      let code1 =
        "class MyComponent extends Component{\n"+
        "  static enteredViewPort(el){\n"+
        "    console.log('entered');\n"+
        "  }\n\n"+
        "   static exitViewPort(el){\n"+
        "    console.log('exit');\n"+
        "  }\n\n"+
        " ...\n\n"+
        "}\n\n"+
        "//Enable listening to the scroll event\n"+
        "Quas.enableScrollTracker();\n"+
        "let c = new MyComponent();\n\n"+
        "//set the callback functions which listen to the scroll events\n"+
        "Quas.onScroll('enter', c, c.enteredViewPort);\n"+
        "Quas.onScroll('exit', c, c.exitViewPort);";

      return (
        <quas>
          <div>
            <h1>Scrolling breakpoints</h1>
            <p>You can easily tell when a component enters or exits the viewport of the user</p>
            <pre>
              <code q-code="{code1}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //api - page content
    static spwa(){
      let code1 =
        '//map( PathID , path, pageTitle )\n'+
        'Router.map("index", "/", "Home");\n'+
        'Router.map("about", "/about", "About");\n'+
        'Router.map("news", "/news/new", "Recent News");';

      let code2 =
        "class Navbar extends Component{\n"+
        "  constructor(){\n"+
        "    this.super();\n"+
        "    this.items = ['home', 'about' 'news'];\n"+
        "    //now this component listens to new page state pushes\n"+
        "     Router.addPushListener(this);\n"+
        "  }\n\n"+
        "  //called when a new page loads\n"+
        "  onPush(newPath){\n"+
        "   Quas.rerender(this);\n"+
        " }\n\n"+
        "  static genItem(item){\n"+
        "   let pageName = Router.paths[item].title;\n"+
        "   let path  = Router.paths[item].path;\n"+
        "   let isActive = 'false';\n"+
        "    //check if the current pathID matches the item\n"+
        "    if(item == Router.getCurrentPathID()){\n"+
        "      isActive = 'true';\n"+
        "    }\n"+
        "    \<quas\>\n"+
        "      <a href='{path}' class='navItem' active='{isActive}'>\n"+
        "        {pageName}\n"+
        "      </a>\n"+
        "     \<quas\>\n"+
        "  }\n\n"+
        "  render(){\n"+
        "     \<quas\>\n"+
        "       <nav q-bind-for=[this.genItem,this.items]></nav>\n"+
        "     \</quas\>\n"+
        "  }\n"+
        "}\n\n"+
        "//this component will always exist\n"+
        "Quas.render(new Navbar(), 'body');\n\n"+
        "switch(Router.getCurrentPathID()){\n"+
        "  case 'index' : renderIndex(); break;\n"+
        "  case 'about' : renderAbout(); break;\n"+
        "  case 'news' : renderNews(); break;\n"+
        "}";

      return (
        <quas>
          <div>
            <h1>Single Page Web Application</h1>
            <p>Creating a single page web application (SPWA\) is completely optional with Quas. The first problem with SPWA is handling the url. You must make also rewrite or redict rules to your main html file i.e. index.html for this to work.</p>
            <p>Map all the uique pages that you will need to have for your web app using the Router</p>

            <pre>
              <code q-code="{code1}"></code>
            </pre>

            <pre>
              <code q-code="{code2}"></code>
            </pre>

            {DocsContent.nextBtn()}
          </div>
        </quas>
      );
    }

    //api - page content
    static api(){
      return (
        <quas>
          <div>api</div>
        </quas>
      );
    }

    static init(){
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
        "url-variables" : {
          name : "URL Variables",
          func : DocsContent.urlVariables
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
        "spwa" : {
          name : "SPWA",
          func : DocsContent.spwa
        },
        "api" : {
          name : "API",
          func : DocsContent.api
        }
      }
    }
  }
);
