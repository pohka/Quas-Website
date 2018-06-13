/*---------- /js/root.js ----------*/

const jsKeyWords = [
  "arguments",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield"
];

let jsKeyWordEnd = [
  "{",
  "}",
  "(",
  ")",
  ";",
  ":",
  "."
];

var isHTML = false;
Quas.customAttrs["code"] = function(comp, parent, params, data){
//  let matches = data.indexOf(/"|'|`/g);
  let lastCharWasSpace = false;
  let quoteException = false;
  let word = "";
  let char = "";
  let isSpace = false;
  let isNewLine = false;
  let isQuote = false;
  let quoteOpen = false;
  let quoteType; // ' or " or `
  let lastChar = "";
  let isKeyWordEnd = false;
  let isComment = false;
  let isMultilineComment = false;
  let last2Chars;
  isHTML = false;

  for(let i=0; i<data.length; i++){
    quoteException = false;
    char = data.charAt(i);
    isSpace = char.match(/ +s?/);
    isNewLine = char.match("\n");
    isKeyWordEnd = (jsKeyWordEnd.indexOf(char) > -1);

    //matches a quote but not an escaped quote
    isQuote = char.match(/"|'|`/) && !lastChar.match(/\\"|'|`/);

    last2Chars = lastChar + char;

    //javascript
    if(!isHTML){
      if(isComment){
        if((isNewLine && !isMultilineComment) || (last2Chars == "*/" && isMultilineComment)){
          let span = document.createElement("span");
          span.setAttribute("class", "code-comment");

          if(isMultilineComment){
            span.textContent = word + char;
            word = "";
          }
          else{
            span.textContent = word;
            word = char;
          }
          parent.appendChild(span);
          isComment = false;
          isMultilineComment = false;

        }
        else{
          word += char;
        }
      }
      //html not in comment
      else{
        //detect comment
        if(!quoteOpen){
          if(last2Chars == "//" || last2Chars == "/*"){
            word = word.substr(0,word.length-1); //remove /
            highlightWord(parent, word, ""); //handle current word
            word = "/";
            isComment = true;
            if(last2Chars == "/*"){
              isMultilineComment = true;
            }
          }
          else if((isNewLine && !isMultilineComment) || (last2Chars == "*/" && isMultilineComment)){
            isComment = false;
          }
        }

        //opening quote
        if(isQuote && !quoteOpen){
          quoteOpen = true;
          quoteType = char;
          highlightWord(parent, word, ""); //handle current word
          word = char;
        }

        //end of quote
        else if(isQuote && quoteOpen && char == quoteType){
          word += char;
          quoteOpen = false;

          let span = document.createElement("span");
          span.setAttribute("class", "code-quote");
          span.textContent = word;
          parent.appendChild(span);
          quoteException = true;

          word = "";
        }
        //inside quote
        else if(quoteOpen){
          word += char;
        }

        //end of word
        if(!quoteOpen && !quoteException){
          //console.log(word + ":" + isKeyWordEnd + ":" + jsKeyWords.indexOf(word.trim()));
          if(!lastCharWasSpace && (isNewLine || isSpace)){
            highlightWord(parent, word, char);
            word = "";
            lastCharWasSpace = true;
          }
          //ending a keyword with a symbol
          else if(isKeyWordEnd && jsKeyWords.indexOf(word.trim()) > -1){
            console.log("here");
            highlightWord(parent, word, "");
            word = char;
            lastCharWasSpace = false;
          }
          //append character to word
          else if(!isSpace){
            word += char;
            lastCharWasSpace = false;
          }
          //convert double spaces to tabs
          else if(lastCharWasSpace && isSpace){
            word += "\t";
            lastCharWasSpace = false;
          }
        }
      }

      //add last word
      if(i == data.length-1){
        highlightWord(parent, word, "");
      }
      else{
        lastChar = char;
      }
    }

    //html
    else{
      word += char;

      if(isNewLine || i == data.length-1){
        highlightHTMLLine(parent, word);
        word = "";
      }
    }
  }
};

//highlights a word, if its a keyword it will have the keyword class
function highlightWord(parent, word, char){
  let text = word + char;
  let isChange = false;
  if(!isHTML && text.indexOf("\<quas\>") > -1){
    isHTML = true;
    isChange = true;
  }

  if(isChange){
    let arr = text.split("<");
    let pre = arr[0] + "<";
    let next = arr[1];
    arr = next.split(">");
    let mid = arr[0];
    let after = ">" + arr[1];

    let span1 = document.createElement("span");
    span1.textContent = pre;
    parent.appendChild(span1);

    let span2 = document.createElement("span");
    span2.textContent = mid;
    span2.setAttribute("class", "code-htmltag");
    parent.appendChild(span2);

    let span3 = document.createElement("span");
    span3.textContent = after;
    parent.appendChild(span3);
  }
  else{
    //javascript
    if(!isHTML){
      let span = document.createElement("span");
      if(jsKeyWords.indexOf(word.trim()) > -1){
        span.setAttribute("class", "code-keyword");
      }

      span.textContent = text;
      parent.appendChild(span);
    }
  }
}

function highlightHTMLLine(parent, word){
  let strs = word.split(/<(.*?)>/g);
  let tags = word.match(/<(.*?)>/g);

//  console.log(strs);
  let isTag = false;
  for(let i=0; i<strs.length; i++){

    if(isTag){
      let open = document.createElement("span");
      open.textContent = "<";
      let close = document.createElement("span");
      close.textContent = ">";

      let midSpans = [];

      let attrs = strs[i].match(/"[^"]*"|\S+/g);

      for(let i=0; i<attrs.length; i++){
        if(i != 0){
          attrs[i] = " " + attrs[i];
        }

        //html tag
        if(i == 0){
          let span = document.createElement("span");
          span.setAttribute("class", "code-htmltag");
          span.textContent = attrs[i];
          midSpans.push(span);
        }
        //html attribute
        else{
          let kv = attrs[i].split("=");
          let key = document.createElement("span");
          key.textContent = kv[0];
          key.setAttribute("class", "code-htmlkey");
          midSpans.push(key);

          if(kv.length > 1){
            let equals = document.createElement("span");
            equals.textContent = "=";
            midSpans.push(equals);

            let val = document.createElement("span");
            val.setAttribute("class", "code-htmlval");
            val.textContent = kv[1];
            midSpans.push(val);
          }
        }
      }


      parent.appendChild(open);
      for(let i in midSpans){
        parent.appendChild(midSpans[i]);
      }
      parent.appendChild(close);
    }
    else{
      let span = document.createElement("span");
      span.textContent = strs[i];
      parent.appendChild(span);
    }

    isTag = !isTag;
  }


  if(word.indexOf("\</quas\>") > -1){
    isHTML = false;
  }
}


function ready(){
  console.log("ready");


  /*
  let path = location.pathname.replace("/", "");
  if(path === ""){
    pageHome();
  }
  else if(path.indexOf("docs") == 0){
    pageDocs();
  }
  */



  Atlas.map("index", "/", "Quas");
  Atlas.map("docs", "/docs/setup", "Docs");
  Atlas.map("download", "/download", "Download");

//  console.log(Quas.paths);

  let nav = new Navbar(["docs", "download"]);
  Quas.renderRule(nav, "body", "prepend");

  let body = new Body();
  Quas.render(body, "body");
}


function atest(){
  //Quas.setUrlValues({"key":"value"});
  let str = "/docs/set"
  let newurl = window.origin + str;
  window.history.pushState('','',newurl);
}

function pageHome(){
  let card1 = new Card("small-rocket-ship-silhouette.png", "Super Fast", "Some text");
  Quas.render(card1, "#card-row-1");

  let card2 = new Card("lightning-bolt-shadow.png", "Lightweight", "Less than 3KB with gzip");
  Quas.render(card2, "#card-row-1");

  let card3 = new Card("couple-of-arrows-changing-places.png", "Modular Components", "Definately not the poor mans versin of react");
  Quas.render(card3, "#card-row-1");

  let card4 = new Card("code.png", "Custom HTML Attributes", "what to put here");
  Quas.render(card4, "#card-row-2");

  let card5 = new Card("desktop-monitor.png", "Breakpoints", "what to put here");
  Quas.render(card5, "#card-row-2");

  let card6 = new Card("refresh-page-option.png", "Cookies", "what to put here");

  Quas.render(card6, "#card-row-2");
  card6.setProp("title", "hello");
  card6.remove();

  playground(
    'class Example extends Component{\n'+
    'constructor(img, title, text){\n'+
      'super();\n'+
      'this.img = img;\n'+
      'this.title = title;\n'+
      'this.text = text;\n'+
    '}\n'+
    '\n'+
    'render(){\n'+
      '&lt;quas&gt;\n'+
        '<div class="card">\n'+
          '<img src=this.img>\n'+
          '<h3>{this.title}</h3>\n'+
          '<span>{this.text}</span>\n'+
        '</div>\n'+
      '&lt;/quas&gt;\n'+
    '}\n'+
  '}\n'+
  'let c = new Example("/img/logo_landing.png",\n'+
  '  "Quas.js", "A lightweight UI library");\n'+
  'Quas.render(c, "#pg1 .playground-output");',
  "#pg1");
}

var nav;
function pageDocs(){
  nav = new DocsNav();
  DocsNav.loadPath();
  Quas.render(nav, ".docs-con");
}



//playground (requires quas-dev.js)
function playground(code, target){
  code = formatCode(code);
  let input = document.querySelector(target + " .playground-input");
  let codeTarget = input.querySelector("code");
  codeTarget.textContent = code;
  eval(Quas.parseBundle(code));
}

var noClosingTag = ["img", "source", "br", "hr", "area", "track", "link", "col", "meta", "base", "embed", "param", "input"];


//indents a code string
function formatCode(code){
  code = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  let lines = code.split("\n");

  let indent = 0;
  let indentChange = 0;
  for(let i in lines){
    let hasOpenBracket = lines[i].indexOf("{") > -1;
    let hasCloseBracket = lines[i].indexOf("}") > -1;


    if(!hasOpenBracket && hasCloseBracket){
      indent--;
    }

    let tags = lines[i].match(/<.*?>/g);
    let extra = false;
    if(tags != null){
      let curOpen = [];
      let curClose = [];
      for(let t in tags){
        let tagName = tags[t].split(" ")[0].substr(1);
        if(tagName.charAt(tagName.length-1) === ">"){
          tagName = tagName.substr(0, tagName.length-1);
        }

        if(tagName[0] !== "/"){
          if(noClosingTag.indexOf(tagName) == -1){
            curOpen.push(tagName);
          }
        }
        else{
          let openIndex = curOpen.indexOf(tagName.substr(1));
          if(openIndex > -1){
            curOpen.splice(openIndex, 1);
          }
          else{
            curClose.push(tagName);
          }
        }
      }

      if(curClose.length > 0){
        indentChange--;
      }
      else if(curOpen.length > 0){
        indentChange++;
        extra=true;
      }
    }

    if(indentChange > 0){
      indent++

    }
    else if(indentChange < 0){
      indent--;
    }

    indentChange=0;
    for(let a=0; a<indent; a++){
      lines[i] = "  " + lines[i];
    }

    if((hasOpenBracket && !hasCloseBracket) || extra){
      indentChange++;
    }
  }
  return "\n" + lines.join("\n");
}

/*---------- /comps/card.js ----------*/

class Card extends Component{
  constructor(img, title, text){
    super();
    this.img = img;
    this.title = title;
    this.text = text;
  }

  render(){
	return   [
    "div",
    {"class":"card"}, 
    [
      [
        "img",
        {"src":"/img/"+this.img+""}, 
        []
      ],
      [
        "h3",
        {}, 
        [
          ""+this.title+""
        ]
      ],
      [
        "span",
        {}, 
        [
          ""+this.text+""
        ]
      ]
    ]
  ];
  }
}

/*---------- /comps/navbar.js ----------*/

class Navbar extends Component{
  constructor(items){
    super();
    this.pathIDs = items;
    Atlas.addPushListener(this);
  }

  static createOption(pathID){
    let cls="";
    if(pathID == Atlas.getCurrentPathID() || (pathID == "docs" && Atlas.currentPathStartsWith("/docs"))){
      cls = "active";
    }
    let pathInfo = Atlas.paths[pathID];
    let title = pathID;
    let link = "";
    if(pathInfo){
      link = pathInfo.path;
      title = pathInfo.title
    }

	return   [
    "div",
    {}, 
    [
      [
        "a",
        {"class":"nav-item "+cls+"","href":""+link+"","target":"push"}, 
        [
          ""+title+""
        ]
      ]
    ]
  ];
  }

  onPush(path){
    console.log(path);
    Quas.rerender(this);
  }

  render(){
	return   [
    "nav",
    {}, 
    [
      [
        "a",
        {"class":"nav-logo","href":"/","target":"push"}, 
        [
          [
            "img",
            {"src":"/img/logo_sm.png"}, 
            []
          ],
          [
            "span",
            {}, 
            [
              "Quas.js"
            ]
          ]
        ]
      ],
      [
        "div",
        {"q-bind-for":[Navbar.createOption,this.pathIDs],"class":"nav-con"}, 
        []
      ],
      [
        "div",
        {"class":"search-bar-con"}, 
        [
          [
            "input",
            {"type":"text","class":"search-bar","autocomplete":"off","spellcheck":"false","placeholder":"Search API"}, 
            []
          ]
        ]
      ],
      [
        "div",
        {"id":"hex1","class":"hexagon-wrapper"}, 
        [
          [
            "span",
            {"id":"color1","class":"hexagon"}, 
            []
          ]
        ]
      ],
      [
        "div",
        {"class":"nav-right"}, 
        [
          [
            "a",
            {"href":"https://github.com/pohka/Quas","target":"_blank"}, 
            [
              [
                "img",
                {"src":"/img/github-logo.png"}, 
                []
              ]
            ]
          ]
        ]
      ]
    ]
  ];
  }
}

/*---------- /comps/docs-nav.js ----------*/

class DocsNav extends Component{
  constructor(){
    super();
  }
  //set the url
  static setPath(e, comp){
    let page = this["data-page"];
    Atlas.pushByPath("/docs/" + page);
    window.scrollTo(0,0); //scroll to top
  }

  //converts a DocsNav.pages object into a valid url page name
  static getPageID(page){
    return page.toLowerCase().replace(/\s/g, "-");
  }

  //list items
  genItem(item){
    let page = DocsNav.getPageID(item.name);
    let currentURLPage = location.pathname.replace("/docs/", "");
    let isActive = (page == currentURLPage);
	return   [
    "div",
    {"class":"docs-nav-item","onclick":DocsNav.setPath,"data-page":""+page+"","active":""+isActive+""}, 
    [
      ""+item.name+""
    ]
  ];
  }


  render(){
	return   [
    "div",
    {"class":"docs-nav-con"}, 
    [
      [
        "div",
        {"class":"docs-nav-list","q-bind-for":[this.genItem,DocsContent.pages]}, 
        []
      ]
    ]
  ];
  }
}

/*---------- /comps/docs-content.js ----------*/

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
	return   [
    "div",
    {"class":"docs-footer-nav"}, 
    [
      [
        "div",
        {"class":"footer-nav-btn","onclick":DocsContent.handleNext}, 
        [
          "Next"
        ]
      ]
    ]
  ];
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

  let codeStart =
  "function startQuas()\{\n"+
  "\t//your code goes here\n"+
  "\}";

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Setting up a Project"
        ]
      ],
      [
        "span",
        {"class":"centered"}, 
        [
          "Download and extract the Quas boilerplate project"
        ]
      ],
      [
        "button",
        {"class":"download-btn"}, 
        [
          "Download"
        ]
      ],
      [
        "hr",
        {}, 
        []
      ],
      [
        "h2",
        {}, 
        [
          "Getting Started"
        ]
      ],
      [
        "p",
        {}, 
        [
          "Quas uses a component based system to render elements. When a component is changed it can be rerendered to update the changes. But before we look at components and the rich features of Quas we will first have a quick look at the structure of the boilerplate project."
        ]
      ],
      [
        "br",
        {}, 
        []
      ],
      "index.html ",
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      [
        "ul",
        {}, 
        [
          [
            "li",
            {}, 
            [
              "quas.js is the library"
            ]
          ],
          [
            "li",
            {}, 
            [
              "quas-dev.js is used for development builds which bundles at runtime based off a config file"
            ]
          ],
          [
            "li",
            {}, 
            [
              "Quas.devBuild assigns the config file to use for the runtime bundling"
            ]
          ]
        ]
      ],
      [
        "hr",
        {}, 
        []
      ],
      [
        "h2",
        {}, 
        [
          "The Config File"
        ]
      ],
      [
        "p",
        {}, 
        [
          "config.json is a JSON file which will decide which files will be bundled for the development build. It is often a good idea to have a seperate JavaScript and CSS files for each component."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+configCode+""}, 
            []
          ]
        ]
      ],
      "You can read more about this in the  ",
      [
        "a",
        {"href":"production-builds"}, 
        [
          "Production Build"
        ]
      ],
      "  section. ",
      [
        "hr",
        {}, 
        []
      ],
      [
        "h2",
        {}, 
        [
          "Starting Point"
        ]
      ],
      [
        "p",
        {}, 
        [
          "Once quas has loaded it will starts its executing the startQuas function."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+codeStart+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
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

    let code3 =
    "let anotherComp = new MyFirstComponent();\n"+
    "Quas.render(anotherComp, myComponent.el);\n"+
    "\n//result\n<div>\n\tHello World\n"+
    "\t<div>Hello World</div>\n"+
    "</div>";

  let code4 = "Quas.renderRule(myComponent, 'body', 'prepend');";
  let code5 = "console.log(myComponent.el);";
  let code6 = "Quas.render(myComponent, '#myID');";

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Components"
        ]
      ],
      [
        "p",
        {}, 
        [
          "Making your own component is as simple as making a new class which extends Component and giving it a render function. The render function should contain quas tags. The quas tags should be on seperate lines and everything between the opening and closing quas tag will use a html like syntax."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+basicVersion+""}, 
            []
          ]
        ]
      ],
      [
        "p",
        {}, 
        [
          "To make the content of the component appear on your page you must create an instance of it and call "+func+". You can have multiple instances of a component at any time."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+renderCode+""}, 
            []
          ]
        ]
      ],
      [
        "hr",
        {}, 
        []
      ],
      [
        "h2",
        {}, 
        [
          "Rendering"
        ]
      ],
      [
        "p",
        {}, 
        [
          "There is a few different ways you can render a component. The default way as shown above will append the content of the component as a child of the parent chosen using the query selector. The query selector works the same as JavaScript's document.querySelector( ) e.g. '#id' and '.class'.",
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code6+""}, 
            []
          ]
        ]
      ],
      [
        "p",
        {}, 
        [
          "Once a component has been rendered to the page the DOM tree for this instance the DOM element will be accessable quickly though 'el' variable."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code5+""}, 
            []
          ]
        ]
      ],
      [
        "p",
        {}, 
        [
          "Instead of using the query selector you can pass a DOM element as the parent for the rendering. The example below shows how you can make another instance of MyFirstComponent and add the new instance as a child to myComponent"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code3+""}, 
            []
          ]
        ]
      ],
      [
        "hr",
        {}, 
        []
      ],
      [
        "h2",
        {}, 
        [
          "Render Rules"
        ]
      ],
      [
        "p",
        {}, 
        [
          "You can use Quas.renderRule( ) to give extra options when rendering, such as prepend. Prepend will render the component as the first child to the parent rather than the last.",
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code4+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
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

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Props"
        ]
      ],
      [
        "p",
        {}, 
        [
          "A prop (property) allows you to pass a value as input. Just surround the value in curly brackets",
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      [
        "hr",
        {}, 
        []
      ],
      [
        "h2",
        {}, 
        [
          "Multiple Props"
        ]
      ],
      [
        "p",
        {}, 
        [
          "If you need to use multiple props together you must put commas between each value. You can also pass arguments to the constructor."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code2+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
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

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Updating Props"
        ]
      ],
      [
        "p",
        {}, 
        [
          "If the value of a a prop changes the component must be rerendered to update the value on the DOM tree."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      [
        "p",
        {}, 
        [
          "Alternatively if you are only changing one prop you can use setProp( ) which will rerender the component after setting the new value",
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code2+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//event handling - page content
DocsContent.eventHandling = function(){
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

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Event Handling"
        ]
      ],
      [
        "p",
        {}, 
        [
          "You can creat a function to which will handle the event. All of the HTML DOM Events are supported."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//sub elements - page content
DocsContent.subElements = function(){
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

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Sub Elements"
        ]
      ],
      [
        "p",
        {}, 
        [
          "You can create sub elements like so:"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
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

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Conditional Rendering"
        ]
      ],
      [
        "p",
        {}, 
        [
          "You can decide what the render with conditional statements. It is typically best practice to do this within sub elements rather than in the render function. This is becasue the brackets for the if statement should surround the quas blocks."
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//production builds - page content
DocsContent.productionBuilds = function(){
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

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Production Builds"
        ]
      ],
      [
        "p",
        {}, 
        [
          "When using a development build the process of bundling will be done when the page loads, however you can export a production build which means you can remove the need of quas-dev.js ",
          [
            "br",
            {}, 
            []
          ],
          [
            "br",
            {}, 
            []
          ],
          "You can do this by opening your browsers console and using one of the following commands "
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code2+""}, 
            []
          ]
        ]
      ],
      [
        "p",
        {}, 
        [
          "Once you have the bundled file you must link it in your html and then remove the code which links quas-dev.js and also remember to remove the call to Quas.devBuild"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//custom attributes - page content
DocsContent.customAttributes = function(){
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
	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Custom Attributes"
        ]
      ],
      [
        "p",
        {}, 
        [
          "Quas comes with some custom html attributes which allow you to define components easier. You can also add your own custom attributes and define how they should be handled"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      [
        "p",
        {}, 
        [
          "To create your own custom attributes you must set add a function to Quas.customAttrs. All custom attribute will have the prefix 'q-' in the html code and the command will come next. Here is an example which will print out a parameter a given number of times"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code2+""}, 
            []
          ]
        ]
      ],
      [
        "p",
        {}, 
        [
          "Params will be the key of the attribute split by '-' so in the example it will be [ 'q', 'log', 'foo' ]"
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//custom events - page content
DocsContent.customEvents = function(){
  let code1 =
    "Quas.addEventListener('myEvent', function(data){\n"+
    "  console.log('i am listening to' + data);\n"+
    "});\n\n"+
    "...\n\n"+
    "Quas.broadcastEvent('myEvent', 'music');";

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Custom Events"
        ]
      ],
      [
        "p",
        {}, 
        [
          "This will allow you to broadcast data to all the existing listeners"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//ajax requests - page content
DocsContent.ajaxRequests = function(){
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


	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "AJAX Requests"
        ]
      ],
      [
        "p",
        {}, 
        [
          "Request data from a server"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//url params - page content
DocsContent.urlVariables = function(){
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

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "URL Variables"
        ]
      ],
      [
        "p",
        {}, 
        [
          "You can easily get and set url variables with quas",
          [
            "p",
            {}, 
            [
              [
                "pre",
                {}, 
                [
                  [
                    "code",
                    {"q-code":""+code1+""}, 
                    []
                  ]
                ]
              ],
              [
                "p",
                {}, 
                [
                  "If you want to remove a variable simply get the current url variables and delete the key"
                ]
              ],
              [
                "pre",
                {}, 
                [
                  [
                    "code",
                    {"q-code":""+code2+""}, 
                    []
                  ]
                ]
              ],
              [
                "p",
                {}, 
                [
                  "There is no need to encode or decord the uri because these 2 functions will do that for you"
                ]
              ],
              DocsContent.nextBtn(),
            ]
          ]
        ]
      ]
    ]
  ];
}

//cookies - page content
DocsContent.cookies = function(){
  let code1 =
    "//get the expire date in 1 year time\n"+
    "let date = new Date();\n"+
    "date.setYear(date.getFullYear() + 1);\n\n"+
    "Quas.setCookie('loginID', 'abc', date);\n"+
    "let myLoginID = Quas.getCookie('loginID');\n"+
    "console.log(myLoginID); //abc\n\n"+
    "//remove the cookie\n" +
    "Quas.clearCookie('loginID');";

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Cookies"
        ]
      ],
      [
        "p",
        {}, 
        [
          "You can easily get and set cookies with quas"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//query elements - page content
DocsContent.queryElements = function(){
let code1 =
  "let c = new MyComponent();\n"+
  "Quas.render(c, 'body');\n\n"+

  "//this will return a HTMLDOMElement using the query selector\n"+
  "let element = Quas.findChild(c, '#nameInput');\n"+
  "element.value = 'hello';";

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Query DOM tree"
        ]
      ],
      [
        "p",
        {}, 
        [
          "If you want to find a DOM element within your component after it is rendered you can use this function"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//scrolling breakpoints - page content
DocsContent.scrollingBreakpoints = function(){
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

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Scrolling breakpoints"
        ]
      ],
      [
        "p",
        {}, 
        [
          "You can easily tell when a component enters or exits the viewport of the user"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//api - page content
DocsContent.spwa = function(){
  let code1 =
    '//map( PathID , path, pageTitle )\n'+
    'Atlas.map("index", "/", "Home");\n'+
    'Atlas.map("about", "/about", "About");\n'+
    'Atlas.map("news", "/news/new", "Recent News");';

  let code2 =
    "class Navbar extends Component{\n"+
    "  constructor(){\n"+
    "    this.super();\n"+
    "    this.items = ['home', 'about' 'news'];\n"+
    "    //now this component listens to new page state pushes\n"+
    "     Atlas.addPushListener(this);\n"+
    "  }\n\n"+
    "  //called when a new page loads\n"+
    "  onPush(newPath){\n"+
    "   Quas.rerender(this);\n"+
    " }\n\n"+
    "  static genItem(item){\n"+
    "   let pageName = Atlas.paths[item].title;\n"+
    "   let path  = Atlas.paths[item].path;\n"+
    "   let isActive = 'false';\n"+
    "    //check if the current pathID matches the item\n"+
    "    if(item == Atlas.getCurrentPathID()){\n"+
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
    "switch(Atlas.getCurrentPathID()){\n"+
    "  case 'index' : renderIndex(); break;\n"+
    "  case 'about' : renderAbout(); break;\n"+
    "  case 'news' : renderNews(); break;\n"+
    "}";

	return   [
    "div",
    {}, 
    [
      [
        "h1",
        {}, 
        [
          "Single Page Web Application"
        ]
      ],
      [
        "p",
        {}, 
        [
          "Creating a single page web application (SPWA--/( is completely optional with Quas. The first problem with SPWA is handling the url. You must make also rewrite or redict rules to your main html file i.e. index.html for this to work."
        ]
      ],
      [
        "p",
        {}, 
        [
          "Map all the uique pages that you will need to have for your web app using the Atlas"
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code1+""}, 
            []
          ]
        ]
      ],
      [
        "pre",
        {}, 
        [
          [
            "code",
            {"q-code":""+code2+""}, 
            []
          ]
        ]
      ],
      DocsContent.nextBtn(),
    ]
  ];
}

//api - page content
DocsContent.api = function(){
	return   [
    "div",
    {}, 
    [
      "api"
    ]
  ];
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

/*---------- /comps/body.js ----------*/

class Body extends Component{
  constructor(){
    super();
    Atlas.addPushListener(this);
  }

  onPush(path){
    Quas.rerender(this);
  }

  render(){
    let currentPathID = Atlas.getCurrentPathID();
    if(currentPathID == "index"){
      return Body.renderIndex();
    }
    else if(Atlas.currentPathStartsWith("/docs")){
      return Body.renderDocs();
    }
    else if(currentPathID == "download"){
	return   [
    "div",
    {}, 
    [
      "download"
    ]
  ];
    }
    else{
	return   [
    "div",
    {}, 
    [
      "404"
    ]
  ];
    }
  }

  static renderIndex(){
    let card1 = new Card("small-rocket-ship-silhouette.png", "Super Fast", "Some text");
    let card2 = new Card("lightning-bolt-shadow.png", "Lightweight", "Less than 3KB with gzip");
    let card3 = new Card("couple-of-arrows-changing-places.png", "Modular Components", "Definately not the poor mans versin of react");
    let card4 = new Card("code.png", "Custom HTML Attributes", "what to put here");
    let card5 = new Card("desktop-monitor.png", "Breakpoints", "what to put here");
    let card6 = new Card("refresh-page-option.png", "Cookies", "what to put here");

	return   [
    "div",
    {}, 
    [
      [
        "div",
        {"class":"landing-top"}, 
        [
          [
            "img",
            {"class":"landing-logo","src":"/img/logo_landing.png"}, 
            []
          ],
          [
            "div",
            {"class":"landing-desc"}, 
            [
              [
                "h1",
                {}, 
                [
                  "Quas.js"
                ]
              ],
              [
                "h2",
                {}, 
                [
                  "A progressive JavaScript UI library"
                ]
              ]
            ]
          ]
        ]
      ],
      [
        "h2",
        {"class":"section-heading"}, 
        [
          "Features"
        ]
      ],
      [
        "div",
        {"class":"card-con","id":"card-row-1"}, 
        [
          card1.render(), card2.render(), card3.render(),
        ]
      ],
      [
        "div",
        {"class":"card-con","id":"card-row-2"}, 
        [
          card4.render(), card5.render(), card6.render(),
        ]
      ]
    ]
  ];
  }

  static renderDocs(){
    if(Body.docsNav === undefined){
      Body.docsNav = new DocsNav();
    }
    if(Body.docsContent === undefined){
      Body.docsContent = new DocsContent();
    }

	return   [
    "div",
    {}, 
    [
      Body.docsNav.render(),,
      [
        "div",
        {"class":"docs-content"}, 
        [
          Body.docsContent.render(),
        ]
      ]
    ]
  ];
  }
}


if(typeof ready==='function'){ready();}