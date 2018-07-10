/*
todo:
- nested list items
- tables
- embed youtube
- video
- hr tag

- async images
- parse multiple types of inline rules
- parse inline for all text in other rules
- option to disable inline rules for text e.g. quote with links and bold text disabled
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

  rule types:
  - begin
  - multiline
  - block
  - inline
*/
export({

  init : () => {
    Markdown.rules = {}

    //heading
    Markdown.addRule("begin", {
      name : "heading",
      pattern : /#+\s*/,

      output : (pattern, line) => {
        let headingSize = line.match(/#+/)[0].length
        let match = line.match(pattern)[0];
        let text = line.substr(match.length);

        let vdom = ["h"+headingSize, {}, [text], []];

        return [vdom];
      }
    });

    //code
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

    //lists
    Markdown.addRule("multiline", {
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

    //quote
    Markdown.addRule("multiline", {
      name : "quote",
      pattern : />\s*/,
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

    //todo: allow option for async loading
    //image
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

    //link
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

    //bold text
    Markdown.addRule("inline", {
      name : "bold",
      pattern : /(\*\*.*?\*\*)|__.*?__/,
      output : (pattern, match) => {
        let text = match[0].substr(2, match[0].length-4);
        return #<b>{text}</b>;
      }
    });

    //italic text
    Markdown.addRule("inline", {
      name : "italic",
      pattern : /(\*.*?\*)|_.*?_/,
      output : (pattern, match) => {
        let text = match[0].substr(1, match[0].length-2);
        return #<i>{text}</i>;
      }
    });

    //strike through text
    Markdown.addRule("inline", {
      name : "strikethrough",
      pattern : /~~.*?~~/,
      output : (pattern, match) => {
        let text = match[0].substr(2, match[0].length-4);
        return #<s>{text}</s>;
      }
    });
  },

  /**
    ---
    Parses markdown text and returns a virtual dom
    ---

    @param {String} text - plain text

    @return {Array<AST>}
  */
  parseToVDOM : (text) =>{
    let vdoms = [];
    let lines = text.split(/\n/);
    let paragraph = "";

    //block rule variables
    let isInBlock = false; //true if within a block rule
    let blockName = ""; //name of the current block rule
    let blockLines = []; //lines collected within the current block

    //multiline rule variables
    let isInMultiline = false; //true if in a multiline rule
    let multilineName = ""; //name of the current multiline rule
    let multilineLines = []; //lines collected for a multiline rule

    //reused vairables in the loop
    let match,
        line,
        matchingRule,
        trimmedLine,
        rule;

    for(let i=0; i<lines.length; i++){
      line = lines[i];
      matchingRule = false;
      trimmedLine = line.trim();

      //empty line
      if(trimmedLine.length == 0){
        if(paragraph.length > 0){
          let nodes = Markdown.parseInlineRules(paragraph);
          vdoms.push(#<p q-append="nodes"></p>);
          paragraph = "";
        }

        if(isInMultiline){
          rule = Markdown.findRule(multilineName,"multiline");
          let node = rule.output(rule.pattern, multilineLines);
          vdoms.push(node);
          isInMultiline = false;
          multilineName = "";
          multilineLines = [];
        }
      }
      else{
        if(!isInBlock){
          //multiline rule
          for(let a=0; a<Markdown.rules["multiline"].length && !matchingRule; a++){
            rule = Markdown.rules["multiline"][a];
            if(!rule.isDisabled && (!isInMultiline || (isInMultiline && rule.name == multilineName))){
              match = line.match(rule.pattern);
              if(match != null && match.index == 0){
                multilineLines.push(line);
                multilineName = rule.name;
                isInMultiline = true;
                matchingRule = true;
              }
            }
          }

          //end of multiline
          if(isInMultiline && !matchingRule){
            rule = Markdown.findRule(multilineName,"multiline");
            let node = rule.output(rule.pattern, multilineLines);
            vdoms.push(node);
            isInMultiline = false;
            multilineName = "";
            multilineLines = [];
          }

          //begin rule
          for(let a=0; a<Markdown.rules["begin"].length && !matchingRule; a++){
            rule = Markdown.rules["begin"][a];
            if(!rule.isDisabled){
              match = line.match(rule.pattern);
              if(match != null && match.index == 0){
                let nodes = rule.output(rule.pattern, line)
                vdoms = vdoms.concat(nodes);
                matchingRule = true;
              }
            }
          }
        }

        //block rule
        for(let a=0; a<Markdown.rules["block"].length && !matchingRule; a++){
          rule = Markdown.rules["block"][a];
          if(!rule.isDisabled){
            if(!isInBlock){
              match = line.match(rule.pattern);
              if(match != null && match.index == 0){
                isInBlock = true;
                matchingRule = true;
                blockName = rule.name;
              }
            }
            else if(isInBlock && blockName == rule.name){
              let match = line.match(rule.pattern);
              if(match != null && match.index == 0){
                isInBlock = false;
                matchingRule = true;
                blockLines.push(line);
                let nodes = rule.output(rule.pattern, blockLines);
                vdoms = vdoms.concat(nodes);
                blockLines = [];
              }
            }
          }
        }

        //add line to block lines
        if(isInBlock){
          blockLines.push(line);
        }

        //no rule matched this line and not in a block rule
        if(!matchingRule && !isInBlock){
          paragraph += line;
        }
      }
    }

    console.log("markdown result:", vdoms);
    return vdoms;
  },

  //parses inline rules
  parseInlineRules : (text) => {
    let vdoms = [];
    for(let a=0; a<Markdown.rules["inline"].length; a++){
      let rule = Markdown.rules["inline"][a];
      if(!rule.isDisabled){
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
    }

    if(text.length > 0){
     vdoms.push(text);
    }

    return vdoms;
  },

  //find a rule by name with a given type
  findRule(name, type){
    if(!type){
      for(let a in Markdown.rules){
        for(let i=0; i<Markdown.rules[a].length; i++){
          if(Markdown.rules[a][i].name == name){
            return Markdown.rules[a][i];
          }
        }
      }
    }
    else{
      for(let i=0; i<Markdown.rules[type].length; i++){
        if(Markdown.rules[type][i].name == name){
          return Markdown.rules[type][i];
        }
      }
    }
  },

  //adding a rule
  addRule(type, obj){
    obj.isDisabled = false;
    if(!Markdown.rules[type]){
      Markdown.rules[type] = [obj];
    }
    else{
      Markdown.rules[type].push(obj);
    }
  },

  //remove a rule
  removeRule(name, type){
    let rules = Markdown.rules[type];
    for(let i=0; i<rules.length; i++){
      if(rules[i].name == name){
        rules.splice(i,1);
        return true;
      }
    }
    return false;
  },

  //enable or disable a rule
  setRuleIsDisabled(isDisabled, name, type){
    let rule = Markdown.findRule(name, type);
    if(rule !== undefined){
      rule.isDisabled = isDisabled;
      return true;
    }
    return false;
  }
});
