import "/comps/navbar"
import "/comps/card"
import "/comps/docs-nav.js"
import "/comps/docs-content.js"
import "/comps/body.js"
import "/css/quas-site.css"

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
