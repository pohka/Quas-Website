function startQuas(){
  let nav = new Navbar([
    {text : "Docs", action:"/docs/setup"},
    {text : "Download", action:"/"},
  ]);
  Quas.renderRule(nav, "body", "prepend");

  let path = location.pathname.replace("/", "");
  if(path === ""){
    pageHome();
  }
  else if(path.indexOf("docs") == 0){
    pageDocs();
  }
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
