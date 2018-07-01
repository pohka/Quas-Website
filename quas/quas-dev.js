/*
This script is used for transpiling and bundling development builds
For production use a static build and remember to remove links to this script
*/

//structure of vdom
// ["tag", { key, "val" }, []]
// [ tag, attrs, children]
const VDOM = {
  tag : (vdom) => {
    return vdom[0];
  },
  attrs : (vdom) => {
    return vdom[1];
  },
  childNodes : (vdom) => {
    return vdom[2];
  },
  getAttr : (vdom, key) => {
    return vdom[1][key];
  },
  setAttr : (vdom, key, val) => {
    vdom[1][key] = val;
  },
  addChild : (vdom, childNode) => {
    vdom[2].push(childNode);
  },
  getLastChild : (vdom) => {
    return vdom[2][vdom[2].length-1];
  },
  createNode : (tag, attrs, children) => {
    if(!attrs){
      attrs = {};
    }
    if(!children){
      children = []
    }
    return [tag, attrs, children];
  }
}


const Dev = {};

//tags that require no closing tag
Dev.noClosingTag = ["img", "source", "br", "hr", "area", "track", "link", "col", "meta", "base", "embed", "param", "input"];



//all he imported files
Dev.imports = {
  "js" : {
    content : [],
    importsLeft : 0,
  }
};

Dev.bundle = {};

Dev.transpileHTML = (html) => {
//  console.log("html:" + html);
  let res = Dev.transpileRecur(html);
//  console.log(res);
  return JSON.stringify(res);

  /*
  note:
  - make a seperate func for parsing the root
  - and another for the children
  */
}

Dev.transpileRecur = (html, isRoot) =>{
  let inQuote = false;
  let quoteType;
//  let inTag = false;
//  let tags = [];
  let quoteRegex = /"(.*?)"|`(.*?)`|'(.*?)'/;
  let char, lastChar = "";
  let tagContent = "";
  let insideTag = false;
  let hasEndedTag = false;
  let children = [];
  let tagDepth = 0;
  let text = "";
  let parent;
  let root;
  const states = Object.freeze({
      other : 0,
      insideTag : 1,
    });
  let state  = states.other;
  let depth = 0;

  for(let i=0; i<html.length; i++){
    hasEndedTag = false;

    char = html.charAt(i);
    if(!inQuote && lastChar != "\\" && char.match(quoteRegex)){
      inQuote = true;
      quoteType = char;
    }

    //parse tags
    if(!inQuote){
      //start of tag
      if(char == "<"){
        //insideTag = true;
        state = states.insideTag;
        tagContent = "";

        //add text node before new child node
        let trimmed = text.trim();
        if(trimmed.length > 0){
          VDOM.addChild(parent, text);
          text = "";
        }
      }
      //end of tag
      else if(char == ">"){
        let tagVDOM = Dev.tagStringToVDOM(tagContent);
        state = states.other;
        hasEndedTag = true;

        //end of opening tag
        if(tagVDOM){

          if(Dev.requiresClosingTag(VDOM.tag(tagVDOM))){
            depth++;
            //add root tag
            if(!root){
              root = tagVDOM
              parent = root;
            }
            //add child tag and set new parent
            else{
              VDOM.addChild(parent, tagVDOM);
              parent = parent[2][parent[2].length-1];
            }
          }
          //no closing tag required
          else{
            //console.log(Dev.requiresClosingTag(VDOM.tag(tagVDOM)));
            VDOM.addChild(parent, tagVDOM);
          }
        }
        //end of closing tag
        else{
          let tagName = tagContent.substr(tagContent.indexOf("/") + 1).trim();

          //set parent to parent node
          if(Dev.requiresClosingTag(tagName)){

            //add text node before end of node
            let trimmed = text.trim();
            if(trimmed.length > 0){
              VDOM.addChild(parent, text);
              text = "";
            }

            depth -= 1;

            //end of root tag
            if(depth == 0){
              break;
            }
            else{
              parent = root;
              for(let d=1; d<depth; d++){
                parent = VDOM.getLastChild(parent); //last child
              }
            }
          }
        }
      }

      //inside tag text e.g. div id="myID"
      else if(state == states.insideTag){
        tagContent += char;
      }
    }

    //keep track of text between tags
    if(state == states.other && !hasEndedTag){
      text += char;
    }

    lastChar = char;
  }

  return root;
}

Dev.requiresClosingTag = (tagName) => {
  return (Dev.noClosingTag.indexOf(tagName) == -1);
}

Dev.tagStringToVDOM = (str) =>{
  str = str.trim();
  //return undefined if closing tag
  if(str.charAt(0) == "/"){
    return;
  }

  //split by space but no in quotes
  let arr = str.match(/(?:[^\s+"]+|"[^"]*")+/g);
  let tagName = arr[0];
  let vdom = [tagName, {}, []];

  //get all the attrs
  for(let i=1; i<arr.length; i++){
    let attr = arr[i].split("=");
    let key = attr[0];
    let val = "";
    if(attr[1]){
      let match = attr[1].match(/"(.*?)"/);
      if(match){
        val  = match[1];
      }
    }
    vdom[1][key] = val;
  }
  return vdom;
}

Dev.calcTagDepthChange = (line) => {
  //ignore all text in quotes
 let quoteRegex = /"(.*?)"|`(.*?)`|'(.*?)'/;
 line = line.split(quoteRegex).join("");
  let count = 0;
  let curLineWithoutQuotes = line.split(quoteRegex).join("");
  let tags = curLineWithoutQuotes.match(/<.*?>/g);


  if(tags){
    for(let t=0; t<tags.length; t++){
      let tagName = tags[t].substr(1, tags[t].length-2).split(/\s/)[0];
      //dont count for when no closing tag is required
      if(Dev.requiresClosingTag(tagName)){
        if(tags[t].charAt(1) == "/"){
          //if using closing tag when no required
          if(Dev.requiresClosingTag(tagName.substr(1))){
            count -= 1;
          }
        }
        else{
          count += 1;
        }
      }
    }
  }
  return count;
}


Dev.transpile = (bundle) => {
  let lines = bundle.split("\n");

  let inCommentBlock = false;
  let result = "";
  let quoteRegex = /"(.*?)"|`(.*?)`|'(.*?)'/;
  let hasCommentBlockChange;
  let inHtmlBlock = false;
  let hasHtmlBlockChanged = false;
  let htmlText = "";
  let vdom;
  let depth = 0;

  let tagContent = "";
  let inMultiLineTag = false;


  for(let i=0; i<lines.length; i++){
    let lineContents = lines[i].split(quoteRegex).join(" ");
    let hasCommentBlockChange = false;
    let curLine = "";

    //remove comment block
    if(!inCommentBlock && lineContents.indexOf("/*") > -1){
      let arr = lines[i].split("/*");
      curLine += arr[0];
      inCommentBlock = true;
      hasCommentBlockChange = true;
    }
    if(inCommentBlock && lineContents.indexOf("*/") > -1){
      let arr = lines[i].split("*/");
      curLine += " " + arr[1];
      inCommentBlock = false;
      hasCommentBlockChange = true;
    }

    //no code blocks, so just use the raw line
    if(!hasCommentBlockChange){
      curLine = lines[i];
    }

    if(!inCommentBlock){
      //remove end of line comment
      curLine = curLine.split("//")[0];

      //find start of html parse
      if(!inHtmlBlock && curLine.indexOf("#<") > -1){
        depth = 0;
        inHtmlBlock = true;
        //add js to result
        let arr = curLine.split("#<");
        result += arr[0];
        htmlString = "";

        curLine = "<" + arr[1];
        hasHtmlBlockChanged = true;
      }

      if(inHtmlBlock){

      //  htmlString += curLine;
      //console.log("before replac32");
        let curLineNoQuotes = curLine.replace(new RegExp(quoteRegex, "g"), "");
        //console.log("after");
        let change = 0;

        let openBrackets = curLineNoQuotes.match(/</g);
        if(openBrackets != null){
          change += openBrackets.length;
        }
        let closeBrackets = curLineNoQuotes.match(/>/g);
        if(closeBrackets != null){
          change -= closeBrackets.length;
        }

        //has at least 1 full tag on this line
        if(change == 0 && openBrackets && closeBrackets){
          let tags = curLineNoQuotes.match(/<.*?>/g);

          if(tags){
            for(let t=0; t<tags.length; t++){
              let tagName = tags[t].substr(1, tags[t].length-2).split(/\s/)[0];
              //dont count for when no closing tag is required
              if(Dev.requiresClosingTag(tagName)){
                //is closing
                if(tags[t].charAt(1) == "/"){
                  //if using closing tag when no required
                  if(Dev.requiresClosingTag(tagName.substr(1))){
                    depth -= 1;
                  }
                }
                //is opening
                else{
                  depth += 1;
                }
              }
            }
          }
          htmlString += curLine;
        }
        else if(change > 0){
          tagContent = Dev.getStringAfterLastOpenBraket(curLine);
          inMultiLineTag = true;
        }
        //in multiline tag
        else if(inMultiLineTag){

          //end of multiline
          if(change < 0){
            tagContent += curLine;
            inMultiLineTag = false;
            htmlString += tagContent;
            tagContent = "";
            depth += 1;
          }
          //within multiline tag, but not ending on this line
          else{
            tagContent += curLine;
          }
        }
        else if(!inMultiLineTag && change == 0){
          htmlString += curLine
        }


        if(!inMultiLineTag && depth <= 0 && !hasHtmlBlockChanged){
          result += Dev.transpileHTML(htmlString);
          inHtmlBlock = false;
        }
        if(hasHtmlBlockChanged){
          hasHtmlBlockChanged = false;
        }
      }

      else {
        result += curLine + "\n";
      }
    }
  }
  return result;
}

Dev.getStringAfterLastOpenBraket = (line) => {
  let indexOfLastBracket = -1;
  let inQuote = false;
  let quoteType;
  let char;
  let lastChar = "";
  let quote = /"|`|'/;

  for(let i=0; i<line.length; i++){
    char = line.charAt(i);


    if(!inQuote && char.match(quote)){
      quoteType = char;
      inQuote = true;
    }
    else if(inQuote && quoteType == char && lastChar != "\\"){
      inQuote = false;
    }
    else if(!inQuote && char == "<"){
      indexOfLastBracket = i;
    }

    lastChar = char;
  }

  return line.substr(indexOfLastBracket);
}



//<div id="wow">   returns: div
Dev.getTagName = (str) => {
  str = str.trim();
  return str.substr(1, str.length-2).trim().split(/\s/)[0];
}


/**
  Returns the bundle as as javascript valid code
  The returned string will have all the HTML syntax transpiled to a render info array
  which is valid JavaScript syntax

  @param {Array} bundle

  @return {String}
*/
Dev.parseBundle = function(bundle){
  return Dev.transpile(bundle);
  let lines = bundle.split("\n");
  let open = -1;
  let html = "";
  let tagName = "quas";
  let inRender = false;
  for(let i=0; i<lines.length; i++){
    //open tag
    let openIndex = lines[i].indexOf("<"+tagName+">");
    if(openIndex > -1){
      html += lines[i].substr(openIndex += tagName.length + 2);
      open = i;
      lines.splice(i, 1);
      i--;
    }

    //currently open
    else if(open > -1){

      //closed tag
      let closeIndex = lines[i].indexOf("</"+tagName+">");
      if(closeIndex > -1){
        html += lines[i].substr(0, closeIndex);
        let info = Dev.convertHTMLToVDOM(html);
        lines[i] = info + lines[i].substr(closeIndex + tagName.length + 3);
        open = -1;
        html = "";
      }
      //still currently open
      else{
        //split by "//" out side of quotes
        let match = lines[i].split(/(?=(?:[^"]*"[^"]*")*[^"]*$)\/\//g);
        html += match[0];
        lines.splice(i, 1);
        i--;
      }
    }
  }
  bundle = lines.join("\n");
  return bundle;
}

/**
  Returns an array as a javascript valid styntax for the array with indentation

  @param {Array} array
  @param {Number} indentCount

  @return {String}
*/
Dev.jsArr = function(arr, tab){
  let str = "";
  if(tab === undefined){
    tab = 1;
  }

  for(let t=0; t<tab; t++){
    str += "  ";
  }
  str += "[\n";
  tab++;
  for(let i=0; i<arr.length; i++){
    for(let t=0; t<tab; t++){
      str += "  ";
    }
    //tag
    if(i == 0){
      str += '"' + arr[i] + '",\n';
    }

    //attrs
    else if(i == 1){
      str += "{"
      for(let key in arr[i]){
        if(arr[i][key] === ""){
          arr[i][key] = "\"\"";
        }
        str += "\"" + key + "\":" + Dev.parseProps(arr[i][key]) + ",";
      }
      //remove last comma, only if this element has attributes
      if(Object.keys(arr[i]).length>0){
        str = str.substr(0,str.length-1);
      }
      str += "}, \n";
    }

    //children
    else if(i==2){
      if(arr[2].length == 0){
        str += "[]";
      }
      else{
        str += "[\n";
        tab++;
        for(let j=0; j<arr[2].length; j++){
          //child element
          if(Array.isArray(arr[2][j])){
            str += Dev.jsArr(arr[2][j], tab);

            if(j != arr[2].length-1){
              str += ",\n";
            }
          }
          else{
            for(let t=0; t<tab; t++){
              str += "  ";
            }

            //function call prop
            if(arr[2][j].match(/\(.*?\)/g)){
              str += arr[2][j];
            }
            //text context
            else{
              str += '"'+ arr[2][j] + '"';
            }
            if(j != arr[2].length-1){
              str += ",\n";
            }
          }
        }

        str += "\n";
        for(let t=0; t<tab-1; t++){
          str += "  ";
        }
        str += "]";
        tab--;
      }
    }
  }
  str += "\n";
  for(let t=0; t<tab-1; t++){
    str += "  ";
  }
  str += "]";
  return str;
}

/**
  Convert HTML syntax to render info as a string
  with JavaScript valid syntax for an array

  @param {String} htmlString

  @return {Sting}
*/
Dev.convertHTMLToVDOM = function(html){
  let info;
  let depth = 0;
  let tagStart = -1;
  let text = "";
  for(let i=0; i<html.length; i++){
    if(html[i] === "<"){
      tagStart = i;
      if(info!==undefined && text.trimExcess() !== ""){
        let parent = info[2];
        for(let d=1; d<depth; d++){
            parent = parent[parent.length-1][2];
        }

        if(parent !== undefined){
          //console.log(text);
          let trimmedText = text.trimExcess();

          //escaping round brackets
          let matches =  trimmedText.match(/\\\)/g);
          for(let i in matches){
            let newStr = "--/(";
            trimmedText = trimmedText.replace(matches[i], newStr);
          }

          let parseProps = Dev.parseProps(trimmedText);
          parent.push(parseProps);
        }
        text = "";
      }
    }
    else if(html[i] === ">"){
      let tagContent = html.substr(tagStart+1, i - 1 - tagStart);
      tagStart = -1;

      //split by space but ignore spaces in quotes
      let tagInfo = tagContent.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g);

      //this is a closing tag
      if(tagInfo[0][0] === "/"){
        depth--;
      }
      //opening tag
      else{
        let attrs = {};
        let events = {};

        for(let v=1; v<tagInfo.length; v++){
          //events
          if(tagInfo[v].substr(0,2) === "on"){
            let arr = tagInfo[v].split("=");
            if(arr[1] !== undefined){
              attrs[arr[0]] = arr[1];
            }
          }
          //attrs
          else{
            let arr = tagInfo[v].split("=");
            if(arr[1] !== undefined){
              attrs[arr[0]] = arr[1];
            }
            else{
              attrs[arr[0]] = "";
            }
          }
        }

        //adding root
        if(info === undefined){
          info = [tagInfo[0], attrs, []];
        }
        else{
          //find location to add this element
          let parent = info[2];
          for(let d=0; d<depth; d++){
            if(d == depth-1){
                parent.push([tagInfo[0], attrs, []]);
            }
            else{
              parent = parent[parent.length-1][2];
            }
          }
        }
        if(Dev.noClosingTag.indexOf(tagInfo[0]) == -1){
          depth++;
        }
      }
    }
    //text between tags
    else if(tagStart == -1){
      text += html[i];
    }
  }

  return Dev.jsArr(info);
}

/**
  Parses the props in the HTML syntax

  @param {String} htmlString

  @param {String}
*/
Dev.parseProps = function(str){
  let matches =  str.match(/\{.*?\}/g);
  let hasFunc = false;
  for(let i in matches){

  	let parsed = matches[i].replace("{", '"+');
    parsed = parsed.replace("}", '+"');
    let res = matches[i].substr(1,matches[i].length-2);

    //ignore is using \}
    let char = matches[i].charAt(matches[i].length-2);
    if(char !== "\\"){
      //function
      if(res.match(/\(.*?\)/g)){
        hasFunc=true;
        return res;
      }
      else{
      //text component
        str = str.replace(matches[i], parsed);
      }
    }
  }

  if((str.indexOf("\"+") == 0 && str.indexOf("+\"") == str.length-3) || hasFunc){
    return "\"" + str + "\"";
  }

  return str;
}

/**
  Returns a string with the excess white spacing removed

  @return {String}
*/
String.prototype.trimExcess = function(){
  let end = "";
  let start = "";

  if(this.charAt(0) === " "){
    start = " ";
  }
  if(this.charAt(this.length-1) === " "){
    end = " ";
  }
  let removedSpace = this.replace(/[\n\r]+|[\s]{2,}/g, '');
  if(removedSpace === ""){
    return "";
  }
  return start + removedSpace + end;
}


/**
  Exports file(s) for a static build

  @param {String[]} content
  @param {String} filename
*/
Dev.exportToFile = function(content, filename){
  let text = "";
  for(let i in content){
    text += content[i] + "\n";
  }

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

//imports a file
Dev.import = function(path, type, key){
  if(Dev.imports[type] === undefined){
    Dev.imports[type] = {
      content : {},
      importsLeft : 1
    };
  }
  else{
    Dev.imports[type].importsLeft += 1;
  }
  Quas.ajax({
    url : path,
    type : "GET",
    success : (file) => {
      if(type == "js"){
        Dev.parseImports(path, file, key);
      }
      else if(type == "css"){
        cssContent = Dev.imports[type].content;
        if(!cssContent[path]){
          cssContent[path] = file;
        }
      }

      Dev.imports[type].importsLeft -= 1;

      //check if all the files loaded of this type have been completed
      if(Dev.imports[type].importsLeft == 0){
        Dev.addImports(type);
      }
    },
    error : (e) => {
      Dev.imports[type].importsLeft -= 1;
    }
  });
}

//concatanate and add the current imports
Dev.addImports = function(type){
  let bundle = "";
  if(type == "js"){
    let jsContent = Dev.imports.js.content;
    let keys = "";
    for(let i=0; i<jsContent.length; i++){
      //root file is not a module
      if(jsContent[i].key == "root"){
        bundle +=
          "/*---------- " + jsContent[i].path + " ----------*/\n" +
          jsContent[i].file.trim() + "\n\n";
      }
      else{
        bundle += "/*---------- " + jsContent[i].path + " ----------*/\n";

        //replace all "Quas.export(" with "Quas.modules[key] = ("
        let exportMatch = jsContent[i].file.match(/Quas\.export\(/);

        if(exportMatch){
          let setModule = "Quas.modules['" + jsContent[i].key + "'] = (";
          jsContent[i].file = jsContent[i].file.replace(exportMatch[0], setModule);
        }

        bundle += jsContent[i].file + "\n";
        keys +="const " + jsContent[i].key + " = Quas.modules['" + jsContent[i].key + "'];\n" +
          "if(typeof Quas.modules['" + jsContent[i].key + "'].init =='function'){\n" +
          "  Quas.modules['" + jsContent[i].key + "'].init('" + jsContent[i].key + "');\n}\n";

      }
    }

    //add all the references to modules to the end
    //e.g. const Card = Quas.modules["Card"];
    bundle += keys;

    bundle = Dev.parseBundle(bundle);
    Dev.bundle.js = bundle;
    bundle += "\nif(typeof ready==='function'){ready();}";

    console.log(bundle);
    var script = document.createElement("script");
    script.type = 'text/javascript';
    script.textContent = bundle;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  else if(type == "css"){
    for(let i in Dev.imports.css.content){
      bundle +=
        "/*---------- " + i + " ----------*/\n\n" +
        Dev.imports.css.content[i].trim() + "\n\n";
    }
    Dev.bundle.css = bundle;
    var style = document.createElement("style");
    style.textContent = bundle;
    document.getElementsByTagName("head")[0].appendChild(style);
  }
}

//for development builds
Dev.load = function(){
  let mainFile;
  if(!Dev.main){
    mainFile = "/main.js";
  }
  else{
    mainFile = Dev.main;
  }

  Quas.ajax({
    url : mainFile,
    type : "GET",
    success : (file) => {
      let hasImport = Dev.parseImports(mainFile, file, "root");

      //if no imports just add the root
      if(!hasImport){
        Dev.addImports("js");
      }
    },
    error : (e) => {
      console.error("Root file not found: " + mainFile);
    }
  });
}

//checks a javascript file to see if it has any imports
Dev.parseImports = (filename, file, key) => {
//  if(key === undefined){
//  }

  //check if this file key has already been imported
  for(let i=0; i<Dev.imports.js.content.length; i++){
    if(Dev.imports.js.content[i].key == key){
      return false;
    }
  }

  let lines = file.split("\n");
  let importModuleRegex = /import+\s.*?\sfrom+\s".*"|import+\s.*?\sfrom+\s'.*'|import+\s.*?\sfrom+\s`.*`/;
  let importCssRegex = /import+\s".*"|import+\s'.*'|import+\s`.*`/;
  let multiLineCommentOpen = false;
  let parsedFile = "";
  let hasImport = false;

  for(let i=0; i<lines.length; i++){
    let validLine = "";
    if(lines[i].indexOf("/*") > -1){
      multiLineCommentOpen = true;
      validLine += lines[i].split("/*")[0];
    }

    if(lines[i].indexOf("*/") > -1){
      multiLineCommentOpen = false;
      validLine += lines[i].split("*/")[1];
    }

    if(!multiLineCommentOpen && validLine == ""){
      validLine = lines[i].split("//")[0];
    }
    else if(!multiLineCommentOpen && validLine != ""){
      validLine = validLine.split("//")[0];
    }

    let importModuleMatch = validLine.match(importModuleRegex);
    let importCssMatch = validLine.match(importCssRegex);
    if(importModuleMatch){
      hasImport = true;
      let key = importModuleMatch[0].split(/\s/)[1];
      let path = importModuleMatch[0].match(/".*?"|'.*?'|`.*?`/)[0];
      path = path.substr(1,path.length-2); //remove quotes

      let arr = path.split(".");
      let extention = arr[arr.length-1];

      if(extention == "js"){
        Dev.import(path, extention, key);
      }
    }
    else if(importCssMatch){
      hasImport = true;
      let path = importCssMatch[0].match(/".*?"|'.*?'|`.*?`/)[0];
      path = path.substr(1,path.length-2); //remove quotes
      let arr = path.split(".");
      let extention = arr[arr.length-1];
      Dev.import(path, extention);
    }
    else{
      parsedFile += lines[i] + "\n";
    }
  }

  //add file
  Dev.imports.js.content.push({
    path : filename,
    key : key,
    file : parsedFile
  });

  return hasImport;
}

//export the bundle
Dev.build = function(filename, extention){
  if(!filename){
    var filename = "bundle";
  }
  let types = Dev.bundle;
  if(extention !== undefined){
    types = [extention];
  }

  for(let i in types){
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + Dev.bundle[types[i]]);
    element.setAttribute('download', filename+"."+types[i]);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  Dev.load();
});
