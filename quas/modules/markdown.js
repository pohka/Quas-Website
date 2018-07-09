/*
todo:
- nested list items
- ordered list
- links [text](link)
- list items with minus sign
- images ![Alt Text](/imgs/logo.png)
- *italic*  _italic_
- **bold**
- __bold__
- _combine **them** too_
- ~~stikethrough~~
- tables
- embed youtube
- video
*/

/**
  # module
  ---
  Handling markdown
  ---
*/
export({

  init : () => {
    Markdown.rules = {}

    //need rule for matching paragraphs

    //
    Markdown.rules["heading"] = {
      type : "starts-with",
      pattern : /#+\s+/,

      output : (pattern, line) => {
        let headingSize = line.match(/#+/)[0].length
        let match = line.match(pattern)[0];
        let text = line.substr(text.length);

        return ["h"+headingSize, {}, [text], []];
      }
    }

    Markdown.rules["code"] = {
      type : "block",
      pattern : /```+/,

      //text == text between open and close block
      output : (pattern, text) => {
        if(Quas.hasModule("CodeHighlighter")){
          return (
            #<pre>
              <code q-code="text" data-type="{codeLang}"></code>
            </pre>
          );
        }
        else{
          return (
            #<pre>
              <code data-type="{codeLang}">{text}</code>
            </pre>
          );
        }
      }
    }

    Markdown.rules["ul"] = {
      type : "starts-with-multiline",
      pattern : /\*\s+|\s+\*\s+/,
      output : (pattern, lines) => {
      //  let initalSpace = parseInt(lines[0].indexOf("*")/2);
        let parsedLines = [];
        for(let i=0; i<lines.length; i++){
          let text = lines[i].substr(lines[i].indexOf("*") + 1)
          parsedLines.push(text);
        }

        return #<ul q-for-li="parsedLines"></ul>
      }
    }

    Markdown.rules["quote"] = {
      type : "starts-with-multiline",
      pattern : />\s+/,
      output : (pattern, lines) => {
        for(let i=0; i<lines.length; i++){
          let match = lines[i].match(pattern);
            lines[i] = lines[i].substr(match[0].length);
        }
        let text = lines.join(" ");

        return #<quote>{text}</quote>
      }
    }

    //should just be handling the parsing of the matched text and returning the result node
    //the text before and after should be solved by a bigger function
    Markdown.rules["link"] = {
      type : "inline",
      pattern : /\[.*?\]\(.*?\)/,
      output : (pattern, line) => {
        //let regex = new RegExp(pattern, "g");
        //let matches =
        let nodes = [];
        let hasMatch = true;
        let text = line;
        while(hasMatch){
          let match = text.match(pattern);
          if(!match){
            hasMatch = false;
          }
          else{
            let textBefore = text.substr(0, match.index);
            let matchedText = match[0];
            text = text.substr(match.index + matchedText.length); //text after

            if(textBefore.length > 0){
              nodes.push(textBefore);
            }

            let arr = matchedText.substr(1,matchedText.length-2).split("](");

            //should have case for opening cross origin links with _blank
            //also using target="push"
            nodes.push(
              #<a href="{arr[1]}" target="push">{arr[0]}</a>
            );
          }
        }
      }
    }
  },
  /**
    ---
    Parses markdown text and returns a virtual dom
    ---

    @param {String} text - plain text

    @return {Array<AST>}
  */
  parseToVDOM : (text)=>{
    let vdoms = [];
    let lines = text.split("\n");
    let paragraph  = "";
    let listItems = [];
    let lastLineType = "";
    let codeLang = "";
    let code = "";
    let codeBlockOpen = false;

    for(let i=0; i<lines.length; i++){
      let words = lines[i].split(/\s+/);
      let firstWord = words[0];
      let afterFirstWord = words.splice(1).join(" ");
      let firstChar = lines[i].charAt(0);
      let isLineParsed = false;
      let trimmedLine = lines[i].trim();


      if(codeBlockOpen){
        //end of code block
        if(trimmedLine == "```"){
          if(Quas.hasModule("CodeHighlighter")){
            vdoms.push(
              #<pre>
                <code q-code="code" data-type="{codeLang}"></code>
              </pre>
            );
          }
          else{
            vdoms.push(
              #<pre>
                <code data-type="{codeLang}">{code}</code>
              </pre>
            );
          }
          code = "";
          codeLang = "";
          codeBlockOpen = false;
        }
        //insdie code block
        else{
          if(code.length == 0){
            code += lines[i];
          }
          else{
            code += "\n" + lines[i];
          }
        }
        isLineParsed = true;
      }

      //new line
      if(!isLineParsed && trimmedLine == ""){
        if(paragraph.length > 0){
          vdoms.push(#<p>{paragraph}</p>);
          paragraph = "";
        }

        else if(lastLineType == "ul" || lastLineType == "ol"){
          let listVDOM = [lastLineType, {}, [], []]
          for(let a=0; a<listItems.length; a++){
            //nested list items
            if(Array.isArray(listItems[a])){

            }
            else{
              listVDOM[2].push(#<li>{listItems[a]}</li>);
            }
          }
          vdoms.push(listVDOM);
          listItems = [];
        }

        lastLineType = "newline";
        isLineParsed = true;
      }

      //multiline quote
      else if(lastLineType == "quote" && firstChar == ">"){
        let lastItem = vdoms[vdoms.length-1];
        lastItem[2].push(["br", {}, [], []]);
        lastItem[2].push(afterFirstWord);
        isLineParsed = true;
      }

      //heading
      else if(!isLineParsed && firstChar == "#"){
        let validHeading = true;
        for(let a=1; a<firstWord.length; a++){
          if(firstWord.charAt(a) != "#"){
            validHeading = false;
            break;
          }
        }
        if(validHeading){
          let tag = "h" + firstWord.length;
          vdoms.push([tag, {}, [afterFirstWord], []]);
          lastLineType = "heading";
          isLineParsed = true;
        }
      }

      //quote
      else if(!isLineParsed && firstChar == ">"){
        vdoms.push(#<quote>{afterFirstWord}</quote>);
        lastLineType = "quote";
        isLineParsed = true;
      }

      //open code block
      else if(!isLineParsed && trimmedLine.substr(0,3) == "```"){
        codeBlockOpen = true;
        codeLang = trimmedLine.substr(3);
        isLineParsed = true;
      }

      //list items
      if(!isLineParsed){
        let index = trimmedLine.indexOf("* ");
        if(index > -1){
          listItems.push(trimmedLine.substr(index+2));
          lastLineType = "ul";
          isLineParsed = true;
        }
      }

      //append line to paragraph
      if(!isLineParsed){
        paragraph += lines[i];
        lastLineType = "paragraph";
      }

      //last line
      if(i == lines.length-1){
        if(paragraph.length > 0){
          vdoms.push(#<p>{paragraph}</p>);
        }
      }
    }

    //console.log("vdoms:");
    //console.log(vdoms);

    return vdoms;
  }
})
