/*
todo:
- nested list items
- tables
- embed youtube
- video
*/

/*
notes:
---
rules can create conflicts if their patterns are similar.

example:
rule 1: [text](link)
rule 2: ![alt](src)

rule 1 will match the pattern and ignore rule 2
to prevent this conflict the rules should be in order of most complexity

the new order should be:
rule 1: ![alt](src)
rule 2: [text](link)

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

    Markdown.addRule("starts-with", {
      name : "heading",
      pattern : /#+\s+/,

      output : (pattern, line) => {
        let headingSize = line.match(/#+/)[0].length
        let match = line.match(pattern)[0];
        let text = line.substr(match.length);

        let vdom = ["h"+headingSize, {}, [text], []];

        return [vdom];
      }
    });

    Markdown.addRule("block", {
      name : "code",
      pattern : /```+/,

      //text == text between open and close block
      output : (pattern, lines) => {
        let codeLang  = lines[0].replace(pattern, "").trim();
        lines.shift(0);
        lines.pop();
        let code = lines.join("\n");
        let vdom;

        if(Quas.hasModule("CodeHighlighter")){
          vdom =  (
            #<pre>
              <code q-code="code" data-type="{codeLang}"></code>
            </pre>
          );
        }
        else{
          vdom = (
            #<pre>
              <code data-type="{codeLang}">{code}</code>
            </pre>
          );
        }

        return [vdom];
      }
    });

    Markdown.addRule("starts-with-multiline", {
      name : "list",
      // matches * or - or 1.
      pattern : /\s*(-|\*|(\d\.))\s*/,
      output : (pattern, lines) => {
        let isOrdered = false;
        //matches digits such as 1. or 2.
        let firstDigitMatch = lines[0].match(/\s*\d\.\s*/);

        if(firstDigitMatch != null && firstDigitMatch.index == 0){
          isOrdered = true;
        }

        for(let i=0; i<lines.length; i++){
          let hasSpace = (lines[i].charAt(0).match(/\s/) != null);
          let spaceCount;
          if(hasSpace){
            spaceCount = lines[i].match(/\s+/)[0].length;
          }
          else{
            spaceCount = 0;
          }
          let match = lines[i].match(pattern);
          if(match.index == 0){
            lines[i] = lines[i].substr(match[0].length);
          }
        }

        if(isOrdered){
          return #<ol q-for-li="lines"></ol>;
        }
        else{
          return #<ul q-for-li="lines"></ul>;
        }
      }
    });


    Markdown.addRule("starts-with-multiline", {
      name : "quote",
      pattern : />\s+/,
      output : (pattern, lines) => {
        let nodes = [];
        for(let i=0; i<lines.length; i++){
          let match = lines[i].match(pattern);
          nodes.push(lines[i].substr(match[0].length));
          if(i < lines.length-1){
            nodes.push(["br", {}, [], []]);
          }
        }

        return #<quote q-append="nodes"></quote>;
      }
    });

    //allow option for async loading
    Markdown.addRule("inline", {
      name : "image",
      pattern : /!\[.*?\]\(.*?\)/,
      output : (pattern, match) => {
        let els = match[0].substr(2, match[0].length-3).split("](");
        let alt = els[0];
        let src = els[1];
        let vdom =  #<div><img src="{src}" alt="{alt}"></img></div>

        return vdom;
      }
    });

    Markdown.addRule("inline", {
      name : "link",
      pattern : /\[.*?\]\(.*?\)/,
      output : (pattern, match) => {
        let els = match[0].substr(1, match[0].length-2).split("](");
        let anchor = els[0];
        let link = els[1];

        let matchOrigin = link.match(location.origin);
        let isMatchingOrigin = (matchOrigin != null && matchOrigin.index == 0);
        if(!isMatchingOrigin && link.charAt(0) == "/"){
          isMatchingOrigin = true;
        }


        let vdom;
        //cross origin link should open in new tab
        if(!isMatchingOrigin){
          vdom =  #<a href="{link}" target="_blank">{anchor}</a>
        }
        else{
          vdom =  #<a href="{link}" target="push">{anchor}</a>
        }

        return vdom;
      }
    });

    Markdown.addRule("inline", {
      name : "bold",
      pattern : /(\*\*.*?\*\*)|__.*?__/,
      output : (pattern, match) => {
        let text = match[0].substr(2, match[0].length-4);
        return #<b>{text}</b>;
      }
    });

    Markdown.addRule("inline", {
      name : "italic",
      pattern : /(\*.*?\*)|_.*?_/,
      output : (pattern, match) => {
        let text = match[0].substr(1, match[0].length-2);
        return #<i>{text}</i>;
      }
    });

    Markdown.addRule("inline", {
      name : "strikethrough",
      pattern : /~~.*?~~/,
      output : (pattern, match) => {
        let text = match[0].substr(2, match[0].length-4);
        return #<s>{text}</s>;
      }
    });
  },

  addRule(type, obj){
    if(!Markdown.rules[type]){
      Markdown.rules[type] = [obj];
    }
    else{
      Markdown.rules[type].push(obj);
    }
  },

  parseInlineRules : (text) => {
    let vdoms = [];
    for(let a=0; a<Markdown.rules["inline"].length; a++){
      let rule = Markdown.rules["inline"][a];
      let match = text.match(rule.pattern);
      while(match != null){
        let inlineVDOM = rule.output(rule.pattern, match);
        let beforeText = text.substr(0, match.index);
        var afterText = text.substr(match.index + match[0].length);
        if(match.index > 0){
          vdoms.push(beforeText);
        }
        vdoms.push(inlineVDOM);
        text = afterText;
        match = text.match(rule.pattern);
      }
    }

    if(text.length > 0){
     vdoms.push(text);
    }

    return vdoms;
  },

  newVersion : (text) =>{
    let vdoms = [];
    let lines = text.split(/\n/);
    let paragraph = "";
    let inBlock = false;
    let blockName = "";
    let blockText = [];
    let multiLine = [];
    let multiLineName = "";
    let isInMultiLine = false;

    for(let i=0; i<lines.length; i++){
      let line = lines[i];
      let matchingRule = false;
      let trimmedLine = line.trim();

      if(trimmedLine.length == 0){
        if(paragraph.length > 0){
          let nodes = Markdown.parseInlineRules(paragraph);
          vdoms.push(#<p q-append="nodes"></p>);
          paragraph = "";
        }

        if(isInMultiLine){
          let rule = Markdown.findRule(multiLineName,"starts-with-multiline");
          let node = rule.output(rule.pattern, multiLine);
          vdoms.push(node);
          isInMultiLine = false;
          multiLineName = "";
          multiLine = [];
        }
      }
      else{
        if(!inBlock){
          //starts-with-multiline rule
          for(let a=0; a<Markdown.rules["starts-with-multiline"].length && !matchingRule; a++){
            let rule = Markdown.rules["starts-with-multiline"][a];
            if(!isInMultiLine || (isInMultiLine && rule.name == multiLineName)){
              let match = line.match(rule.pattern);
              if(match != null && match.index == 0){
                multiLine.push(line);
                multiLineName = rule.name;
                isInMultiLine = true;
                matchingRule = true;
              }
            }
          }

          //end of multiline
          if(isInMultiLine && !matchingRule){
            let rule = Markdown.findRule(multiLineName,"starts-with-multiline");
            let node = rule.output(rule.pattern, multiLine);
            vdoms.push(node);
            isInMultiLine = false;
            multiLineName = "";
            multiLine = [];
          }

          //starts-with rule
          for(let a=0; a<Markdown.rules["starts-with"].length && !matchingRule; a++){
            let rule = Markdown.rules["starts-with"][a];
            let match = line.match(rule.pattern);
            if(match != null && match.index == 0){
              let nodes = rule.output(rule.pattern, line)
              vdoms = vdoms.concat(nodes);
              matchingRule = true;
            }
          }
        }

        //block rule
        for(let a=0; a<Markdown.rules["block"].length && !matchingRule; a++){
          let rule = Markdown.rules["block"][a];
          if(!inBlock){
            let match = line.match(rule.pattern);
            if(match != null && match.index == 0){
              inBlock = true;
              matchingRule = true;
              blockName = rule.name;
            }
          }
          else if(inBlock && blockName == rule.name){
            let match = line.match(rule.pattern);
            if(match != null && match.index == 0){
              inBlock = false;
              matchingRule = true;
              blockText.push(line);
              let nodes = rule.output(rule.pattern, blockText);
              vdoms = vdoms.concat(nodes);
              blockText = [];
            }
          }
        }

        if(inBlock){
          blockText.push(line);
        }


        if(!matchingRule && !inBlock){
          paragraph += line;
        }
      }
    }

    console.log("markdown result:", vdoms);
    return vdoms;
  },

  findRule(name, type){
    for(let i=0; i<Markdown.rules[type].length; i++){
      if(Markdown.rules[type][i].name == name){
        return Markdown.rules[type][i];
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
    return Markdown.newVersion(text);


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

    return vdoms;
  }
})
