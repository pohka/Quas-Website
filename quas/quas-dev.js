/*
This script is used for transpiling and bundling development builds
For production use a static build and remember to remove links to this script
*/

Quas.filesToBundle = 0; //count of the number of files being bundled
Quas.bundleData = []; //string data of each file
Quas.bundle = ""; //the current bundle as a string
Quas.cssFiles = [];
Quas.cssBundle = [];
Quas.cssFilesToBundle = 0;

//tags that require no closing tag
Quas.noClosingTag = ["img", "source", "br", "hr", "area", "track", "link", "col", "meta", "base", "embed", "param", "input"];

/**
  Creates a development build using a config file

  @param {String} configPath - path to the config file
*/
Quas.devBuild = function(config){
  Quas.isDevBuild = true;
  Quas.ajax({
    url : config,
    type : "GET",
    return: "json",
    success : function(data){

      let cssFiles = [];
      for(let i in data.css){
        if(data.css[i].constructor != String){
          for(let a in data.css[i]){
            for(let b in data.css[i][a]){
              Quas.cssFiles.push(a + data.css[i][a][b]);
            }
          }
        }
        else{
          Quas.cssFiles.push(data.css[i]);
        }
      }

      for(let i in Quas.cssFiles){
        var fileref = document.createElement("link");
        fileref.rel = "stylesheet";
        fileref.type = "text/css";
        fileref.href = Quas.cssFiles[i]+".css";
        document.getElementsByTagName("head")[0].appendChild(fileref)
      }

      //parse json to get javascript file names
      let files = [];
      for(let i in data.js){
        if(data.js[i].constructor != String){
          for(let a in data.js[i]){
            for(let b in data.js[i][a]){
              files.push(a + data.js[i][a][b]);
            }
          }
        }
        else{
          files.push(data.js[i]);
        }
      }

      //load javascript files
      for(let i in files){
        let file = files[i].trim();
        if(file !== ""){
          Quas.filesToBundle++;
          Quas.ajax({
            url : file+".js",
            type : "GET",
            success : function(res){
              Quas.bundleData[i] = res;

              if(Quas.filesToBundle == 1){
                Quas.evalDevBundle();
              }
              else{
                Quas.filesToBundle--;
              }
            }
          });
        }
      }
    }
  });
}

/**
  Concatates each file and evaluates it
*/
Quas.evalDevBundle = function(){
  let bundle = "";
  for(let i=0; i<Quas.bundleData.length; i++){
    if(Quas.bundleData[i] !== undefined){
      bundle += Quas.bundleData[i];
    }
    else{
      console.log("One or more files in the config file were not recognize");
    }
  }

  bundle = Quas.parseBundle(bundle);
  Quas.bundle = bundle;
  bundle += "\nif(typeof startQuas==='function'){startQuas();}";
  eval(bundle);
}

/**
  Returns the bundle as as javascript valid code
  The returned string will have all the HTML syntax transpiled to a render info array
  which is valid JavaScript syntax

  @param {Array} bundle

  @return {String}
*/
Quas.parseBundle = function(bundle){
  let lines = bundle.split("\n");
  let open = -1;
  let html = "";
  let tagName = "quas";
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
        let info = Quas.convertToRenderInfo(html);
        lines[i] = "\treturn " + info + ";" + lines[i].substr(closeIndex + tagName.length + 3);
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
Quas.jsArr = function(arr, tab){
  let str = "";
  if(tab === undefined){
    tab = 1;
  }

  for(let t=0; t<tab; t++){
    str += "\t";
  }
  str += "[\n";
  tab++;
  for(let i=0; i<arr.length; i++){
    for(let t=0; t<tab; t++){
      str += "\t";
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
        str += "\"" + key + "\":" + Quas.parseProps(arr[i][key]) + ",";
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
            str += Quas.jsArr(arr[2][j], tab);

            if(j != arr[2].length-1){
              str += ",\n";
            }
          }
          else{
            for(let t=0; t<tab; t++){
              str += "\t";
            }

            //function call prop
            if(arr[2][j].match(/\(.*?\)/g)){
              str += arr[2][j] + ",";
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
          str += "\t";
        }
        str += "]";
        tab--;
      }
    }
  }
  str += "\n";
  for(let t=0; t<tab-1; t++){
    str += "\t";
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
Quas.convertToRenderInfo = function(html){
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
          let trimmedText = text.trimExcess();
          let parseProps = Quas.parseProps(trimmedText);
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
        if(Quas.noClosingTag.indexOf(tagInfo[0]) == -1){
          depth++;
        }
      }
    }
    //text between tags
    else if(tagStart == -1){
      text += html[i];
    }
  }

  console.log(Quas.jsArr(info));
  return Quas.jsArr(info);
}

/**
  Parses the props in the HTML syntax

  @param {String} htmlString

  @param {String}
*/
Quas.parseProps = function(str){
  let matches =  str.match(/\{.*?\}/g);
  for(let i in matches){
  	let parsed = matches[i].replace("{", '"+');
    parsed = parsed.replace("}", '+"');
    let res = matches[i].substr(1,matches[i].length-2);

    //ignore is using \}
    let char = matches[i].charAt(matches[i].length-2);
    if(char !== "\\"){
      //function
      if(res.match(/\(.*?\)/g)){
        return res;
      }
      //text component
      str = str.replace(matches[i], parsed);
    }
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
  Downloads the current bundle.
  You can call this from you browsers console examples:
    Quas.bundle();
    Quas.bundle(false, "my-bundle-name");

  type will only export only the file types defined all,css or js
  the default value is all

  set useMinfier to true to use minifier
  fileName will set the name of the file being downloaded

  Note: The minifier is experimental and it is recommented that
  you use something like UglifyJS, minfier.org or Closure


  @param {String} fileName - (optional) default value is bundle
  @param {String} type - (optional) all|css|js
  @param {Boolean} useMinifier - (optional)
*/
Quas.build = function(filename, type, minify){
  if(type === undefined){
    type = "all";
  }

  if(type === "all" || type === "js"){
    var text = Quas.bundle;
    let extention = "";
    if(filename === undefined){
      filename = "bundle";
    }
    if(minify){
      text = Quas.minify(text);
      extention = ".min";
    }

   let element = document.createElement('a');
   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
   element.setAttribute('download', filename + extention+ ".js");
   element.style.display = 'none';
   document.body.appendChild(element);

   element.click();

   document.body.removeChild(element);
 }
 if(type === "all" || type === "css"){
   Quas.cssFilesToBundle = Quas.cssFiles.length;
   for(let i in Quas.cssFiles){
     Quas.ajax({
       url : Quas.cssFiles[i]+".css",
       type : "GET",
       success : function(text){
         Quas.cssBundle[i] = text;
         Quas.cssFilesToBundle--;
         if(Quas.cssFilesToBundle == 0){
           Quas.exportToFile(Quas.cssBundle, filename+".css");
         }
       }
     });
   }
 }

}

/**

@param {String[]} content
@param {String} filename
*/
Quas.exportToFile = function(content, filename){
  let text = "";
  for(let i in content){
    text += content[i];
  }

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
  This will minify a JavaScript string

  @param {String}

  @return {String}
*/
Quas.minify = function(str){
  let lines = str.split("\n");

  //remove comments
  let openCommentIndex = -1;
  for(let i=0; i<lines.length; i++){
    lines[i] = lines[i].trim();
    let commentIndex = lines[i].indexOf("//");
    if(lines[i].indexOf("//") > -1){
      lines[i] = lines[i].substr(0, lines[i].indexOf("//"));
    }

    //opening of multi line comment
    if(openCommentIndex == -1){
      if(lines[i].indexOf("/*") > -1){
        openCommentIndex = i;
      }
    }

    //closing of multi line comment
    if(openCommentIndex > -1 && lines[i].indexOf("*/") > -1){
      //same line comment
      if(openCommentIndex == i){
        let start = lines[i].indexOf("/*");
        let end = lines[i].indexOf("*/")+2;
        lines[i].replace(lines[i].slice(start, end), "");
      }
      else{
        //remove first line
        lines[openCommentIndex] = lines[openCommentIndex].substr(0, lines[openCommentIndex].indexOf("/*"));
        for(let c=openCommentIndex+1; c<i-1; c++){
          lines[i]="";
        }
        //remove last lines
        lines[i] = lines[i].substr(lines[i].indexOf("*/")+2);
      }

      openCommentIndex = -1;
    }
  }
  str = lines.join("\n");
  str = str.replace(/\n\n/g, "");
  str = str.replace(/(,\s)(?=(?:[^"]|"[^"]*")*$)/g,',');
  str = str.replace(/(;\s)(?=(?:[^"]|"[^"]*")*$)/g,';');
  str = str.replace(/({\s)(?=(?:[^"]|"[^"]*")*$)/g,'{');
  str = str.replace(/(}\s)(?=(?:[^"]|"[^"]*")*$)/g,'}');
  str = str.replace(/(\[\s)(?=(?:[^"]|"[^"]*")*$)/g,'[');
  str = str.replace(/(]\s)(?=(?:[^"]|"[^"]*")*$)/g,']');
  str = str.replace(/(\s=\s)(?=(?:[^"]|"[^"]*")*$)/g,'=');
  str+="\nif(typeof startQuas==='function'){startQuas();}";

  return str;
}
