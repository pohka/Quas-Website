/**
  # overview
  version : 1.0
*/


/**
  # class
  ---
  Super class for all components
  ---

  @prop {Object} props - All the properties for this component
  @prop {Boolean} isPure - If true the component won't update once mounted
  @prop {Element} dom - Root Element
  @prop {AST} vdom - Virtual dom for this component
  @prop {Object} events - all of the event listener functions
*/

class Component{
  /**
    # func
    @param {Object} props - All the properties for this component
  */
  constructor(props){
    if(props){
      this.props = props;
    }
    else{
      this.props = {}
    }
    this.isPure = false;
  }

  addTemplate(key, callback){
    if(!this.templates){
      this.templates = {};
    }
    this.templates[key] = callback;
  }

  genTemplate(key, props, val){
    return this.templates[key](props, val);
  }


  /**
    # function
    ---
    Sets the properties and updates the component
    ---

    @param {Object} props - The properties to change or add

    ```
    myComp.setProps({
      name : "john",
      id : 123
    });
    ```
  */
  setProps(obj){
    for(let k in obj){
      this.props[k] = obj[k];
    }
    Quas.render(this);
  }


  /**
    ---
    Returns true if this component has been mounted to the DOM tree
    ---

    @return {Boolean}

    ```
    console.log(comp.isMounted()); //false;
    Quas.render(comp, "#app");
    console.log(comp.isMounted()); //true
    ```
  */
  isMounted(){
    return this.dom !== undefined;
  }

  /**
    # func
    Removes the component from the DOM tree
  */
  unmount(){
    if(this.dom){
      this.dom.remove();
      this.dom = undefined;
    }
    this.vdom = undefined;
  }
}


/**
  # class - Quas
  ---
  Main Library
  ---

  @prop {Object} modules - all of the imported modules
  @prop {Array<Object>} customAttrs - the registered custom attributes
*/
const Quas = {
  /**
    ---
    Mounts a component to the DOM tree, however if the Component is already mounted it will update the component
    ---

    @param {Component} component - component to mount
    @param {String|Element} parent - the parent node


    ```
    //mount using the query selector (#id, .class, tag)
    Quas.render(myComp, "#app");

    //alternatively mount using a DOM Element
    let el = document.querySelector("#app");
    Quas.render(myComp, el);

    //update the component
    Quas.render(myComp);
    ```
  */
  rootCond(vdom){
    Quas.removeConditionalVDOMs(vdom);
    return vdom;
  },
  removeConditionalVDOMs(vdom){
    //not a text node
    if(Array.isArray(vdom)){
      if(vdom[3]["q-if"] && vdom[3]["q-if"] == false){
        return false;
      }
      else{
        for(let i=0; i<vdom[2].length; i++){
          //if removed child node has false conditional statement
          if(!Quas.removeConditionalVDOMs(vdom[2][i])){
            vdom[2].splice(i,1);
            i -= 1;
          }
        }
      }
    }
    return true;
  },

  render : (comp, parent) => {
    //if parent passed is a query selector string
    if(parent && parent.constructor === String){
      parent = document.querySelector(parent);
    }


    //first time rendering
    if(!comp.isMounted() && parent !== null && parent){
      comp.vdom = comp.render();
      console.log("before filter:", comp.vdom);
      comp.vdom = Quas.rootCond(comp.vdom);
      console.log("after filter:", comp.vdom);
      comp.dom = Quas.createElement(comp.vdom, comp);
      if(comp.dom){
        parent.appendChild(comp.dom);
      }
    }

    //diff the vdom if mounted and not pure
    else if(comp.isMounted() && !comp.isPure){
      let newVDOM = comp.render();

      //root tag is different
      let hasDiff = Quas.diffRootVDOM(comp, comp.vdom, newVDOM);

      if(!hasDiff){
        Quas.diffVDOM(comp, comp.dom.parentNode, comp.dom, comp.vdom, newVDOM);
      }
      comp.vdom = newVDOM;
    }
  },

  /*
    ---
    diffs the root virtual dom
    returns true if a difference was found
    ---

     @param {Component} comp
     @param {AST} currentVDOM
     @param {AST} newVDOM

     @return {Boolean}
  */
  diffRootVDOM : (comp, vdom, newVDOM) => {
    let hasDiff = false;


    if(newVDOM[0] != comp.vdom[0] || //diff tags
      Object.keys(vdom[1]).length != Object.keys(newVDOM[1]).length){ //diff attr count
      hasDiff = true;
    }

    //diff attrs value
    if(!hasDiff){
      for(let key in vdom[1]){
        if(!(newVDOM[1].hasOwnProperty(key) && vdom[1][key] == newVDOM[1][key])){
          hasDiff = true;
          break;
        }
      }
    }

    //swap out the root dom
    if(hasDiff){
      let newDOM = Quas.createElement(newVDOM, comp);
      comp.dom.parentNode.replaceChild(newDOM, comp.dom);
      comp.dom = newDOM;
    }
    return hasDiff;
  },

  /*
    ---
    recursively diffs the virtual dom of a component
    returns based on the changes to the real DOM tree:
    0 - if not change to the node
    1 - if added a node to the parent
    -1 - if this node was removed
    ---

     @param {Component} component
     @param {Element} parentNode
     @param {AST} currentVDOM
     @param {AST} newVDOM

     @return {Number}
  */
  diffVDOM : (comp, parent, dom, vdom, newVDOM) => {
    let returnVal = 0;

    if(!newVDOM){
      if(parent && dom){
        parent.removeChild(dom);
      }
      return -1;
    }

    if(Array.isArray(newVDOM)){
      for(let a=0; a<newVDOM[3].length; a++){
        action = Quas.evalCustomAttr(newVDOM[3][a].key, newVDOM[3][a].val, newVDOM, comp);
        if(action == -1 && dom){
          dom.remove();
          return -1;
        }
      }
    }


    //text node
    if(!Array.isArray(newVDOM)){
      if(!vdom){
        let text = document.createTextNode(newVDOM);
        parent.append(text);
      }
      else if(vdom != newVDOM){
        parent.replaceChild(document.createTextNode(newVDOM), dom);
      }
      return returnVal;
    }

    //old vdom is text node and new vdom is not a text node
    else if(vdom && vdom.constructor == String && newVDOM.constructor != String){
      let newDOM = Quas.createElement(newVDOM, comp);
      parent.replaceChild(newDOM, dom);
      return returnVal;
    }

    //old vdom doesn't have this new dom element
    if(!vdom){
      let newDOM = Quas.createElement(newVDOM, comp);
      parent.appendChild(newDOM);
      returnVal = 1;
      return returnVal;
    }
    else{
      //diff tags
      if(vdom[0] != newVDOM[0]){
        let newDOM = Quas.createElement(newVDOM, comp);
        if(!dom){
          parent.appendChild(newDOM);
          returnVal = 1;
        }
        else{
          parent.replaceChild(newDOM, dom);
        }
        return returnVal;
      }
      //same tag
      else{
          //was working
          // for(let a=0; a<newVDOM[3].length; a++){
          //   action = Quas.evalCustomAttr(newVDOM[3][a].key, newVDOM[3][a].val, newVDOM, comp);
          //   if(action == -1 && dom){
          //     dom.remove();
          //     return -1;
          //   }
          // }

        //clone attrs to keep track of newly added attrs
        let newAttrs = {};
        for(let a in newVDOM[1]){
          newAttrs[a] = newVDOM[1][a];
        }

        for(let a in vdom[1]){
          let prefix = a.substr(0,2);
          let isEvent = (prefix == "on");

          //removed attribute a
          if(newVDOM[1][a] === undefined){
            if(isEvent){
              let eventNames = a.substr(3).split("-");
              for(let e in eventNames){
                dom.removeEventListener(eventNames[e], comp.events[eventNames[e]]);
                delete comp.events[eventNames[e]];
              }
            }
            else{
              dom.removeAttribute(a);
            }
          }
          else{
            //diff attribute value
            if(vdom[1][a] != newVDOM[1][a]){
              //event
              if(isEvent){
                let eventNames = a.substr(3).split("-");
                for(let e in eventNames){
                  if(vdom[1][a] != newVDOM[1][a]){
                    dom.removeEventListener(eventNames[e], comp.events[eventNames[e]]);
                    comp.events[eventNames[e]] = (mouseEvent)=>{
                      newVDOM[1][a](mouseEvent, comp);
                    }
                    dom.addEventListener(eventNames[e], comp.events[eventNames[e]]);
                  }
                }
              }
              //basic attribute
              else{
                dom.setAttribute(a, newVDOM[1][a]);
              }
            }
          }
          delete newAttrs[a];
        }
        //all the newly added attributes
        for(let a in newAttrs){
          if(a != 0){
            let prefix = a.substr(0,2);
            let isEvent = (prefix == "on");

            if(isEvent){
              let eventNames = a.substr(3).split("-");
              for(let e in eventNames){
                comp.events[eventNames[e]] = (mouseEvent)=>{
                  newAttrs[a](mouseEvent, comp);
                }
                dom.addEventListener(eventNames[e], comp.events[eventNames[e]]);
              }
            }
            else{
              dom.setAttribute(a, newAttrs[a]);
            }
          }
        }
      }
    }

    //children
    if(dom && returnVal > -1){
      let oldChildren;
      if(vdom){
        oldChildren = vdom[2];
      }
      let newChildren;
      if(newVDOM){
        newChildren = newVDOM[2];
      }
      let change = 0;
      for(let c=0; (newVDOM && newVDOM[2] && c<newVDOM[2].length) || (vdom && vdom[2] && c<vdom[2].length); c++){
        let nextOldChild;
        if(oldChildren){
          nextOldChild = oldChildren[c];
        }
        let nextNewChild;
        if(newChildren){
          nextNewChild = newChildren[c];
        }
        let nextDOM;

        if(dom.childNodes){
          nextDOM = dom.childNodes[c+change];
        }
        change += Quas.diffVDOM(comp, dom, nextDOM, nextOldChild, nextNewChild);
      }
    }
    return returnVal;
  },

  /**
    ---
    Creates a DOM Element using the vdom and adds it as a child to the parent.
    When called the parent parameter should be undefined
    ---

    ```
    Quas.createElement(vdom, comp);
    ```

    @param {AST} vdom - description of the element
    @param {Component} component - the component of the vdom
    @param {String|Element|undefined} parent - (exclude) parent vdom node

    @return {Element|String}
  */
  createElement : (vdom, comp, parent) => {
    //if a text node
    if(!Array.isArray(vdom)){
      if(!parent){
        return document.createTextNode(vdom);
      }
      else{
        parent.appendChild(document.createTextNode(vdom));
        return;
      }
    }

    let tag = vdom[0];
    let attrs = vdom[1];
    let children = vdom[2];
    let root, action;

    //evaluate all the custom attrs
    console.log(vdom);
    for(let a=0; a<vdom[3].length; a++){
      action = Quas.evalCustomAttr(vdom[3][a].key, vdom[3][a].val, vdom, comp);
      if(action == -1){
        return;
      }
    }

    let el = document.createElement(tag)

    //attributes
    for(let a in attrs){

      let prefix = a.substr(0,2);

      //event
      if(prefix == "on"){
        let eventNames = a.substr(3).split("-");
        if(!comp.events){
          comp.events = {};
        }
        for(let i in eventNames){
          comp.events[eventNames[i]] = (e)=>{
            attrs[a](e, comp);
          }

          el.addEventListener(eventNames[i], comp.events[eventNames[i]]);
        }
      }
      //basic attr
      else{
        el.setAttribute(a, attrs[a]);
      }
    }

    //link target = push
    if(Quas.hasModule("Router") && tag == "a" && attrs.target == "push"){
      //add on click eventlistener
      el.addEventListener("click", function(e){
        if(this.target && this.target == "push"){
          e.preventDefault();
          let path = this.href.replace(window.location.origin, "");
          let route = Router.findRouteByPath(path);
          if(!route && Router.route404){
            route = Router.route404;
            route.fullpath = path;
          }
          Router.push(route);
        }
      });
    }

    //children
    if(children !== undefined){
      for(let i=0; i<children.length; i++){
        let child = Quas.createElement(children[i], comp, el);
        if(child !== undefined){
          el.appendChild(child);
        }
      }
    }

    return el;
  },

  /**
    # func
    ---
    An asynchronous HTTP request (AJAX)

    format of request object:
    {
      url : "myfile.php",
      type : "GET|POST",
      data : {
        key : "value"
      },
      return : "json|xml",
      success : (result)=>{},
      error : (Error) => {}
    }
    ---

    @param {Object} requestData - request data

    ```
    //most basic use to log the contents of a file
    Quas.ajax({
      url : "/myfile.txt",
      success : (result) => {
        console.log(result);
      }
    });

    //requesting and displaying a json file
    Quas.ajax({
      url : "/myfile.json",
      type : "GET", //GET is the default request type
      return : "json", //return type
      success : (data) => { //callback
        //data is a json object
        for(let i in data){
          console.log(data[i]);
        }
      },
      error : (err) => { //error callback
        console.error(err);
      }
    });

    //post request example for loading an article by id
    Quas.ajax({
      url : "/findArticle.php",
      type : "POST",
      data : {
        articleID : "1234"
      },
      return : "json", //return type
      success : (data) => { //callback
        console.log(data.author);
        console.log(data.text);
      },
      error : (err) => { //error callback
        console.error(err);
      }
    });
    ```
  */
  ajax : (req) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if(req.success!==undefined){
            let result;
            if(req.return === undefined){
              result = this.responseText;
            }
            else{
              let returnType = req.return.toLowerCase();
              switch(returnType){
                case "json" :
                  try {
                    result = JSON.parse(this.responseText);
                  } catch(e){
                    result = "Failed to parse return text to JSON:\n" + this.responseText;
                  }
                  break;
                case "xml" :
                  try{
                    result = new DOMParser().parseFromString(this.responseText,"text/xml");
                  } catch(e){
                    result = "Failed to parse return text to XML:\n" + this.responseText;
                  }
                  break;
              }
            }

            req.success(result);
          }
        }
        else if(this.readyState == 4){
          if(req.error !== undefined){
            req.error(this);
          }
        }
    };
    let str = req.url + "?";
    let kvs = "";
    if(req.data!==undefined){
      for(let key in req.data){
        kvs += key + "=" + encodeURIComponent(req.data[key]) + "&"
      }
      kvs = kvs.slice(0,-1);
    }

    //post requests
    if(req.type == "POST"){
      xhr.open(req.type, req.url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(kvs);
    }
    //get requests
    else{
      if(!req.type){
        req.type = "GET";
      }
      xhr.open(req.type, req.url + "?" + kvs, true);

      //file uploading
      if(req.data !== undefined && req.data.constructor === FormData){
        xhr.send(req.data);
      }
      else{
        xhr.send();
      }
    }
  },



  /**
    # function
    ---
    fetch a resouce asynchronously, similar to Quas.ajax but it uses the fetch api with a promise
    if the file fails to load, it will throw an error
    ---

    @param {String} url - url to the resource
    @param {String} type - (optional) text, json, blob, buffer
    @param {Object} requestData - (optional) data for the request


    ```
    // Request data format, Default options are marked with *
    {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    }

    //fetch and log a text file
    Quas.fetch("/myfile.txt")
      .then((result) = >{
        console.log("myfile.txt:" + result);
      })
      .catch((err) => console.error(err));

    //fetch a json file
    Quas.fetch("/myfile.json", "json")
      .then((data) =>{
        console.log("key count: " + Object.keys(data).length);
      })
      .catch((err) => console.error(err));
    ```
  */
  fetch : (url, type, req) => {
    return fetch(url, req)
      .then((response) => {
        if (!response.ok) return new Error(response);

        if(!type || type == "text"){
          return response.text();
        }
        else if(type == "json"){
          return response.json();
        }
        else if(type == "blob"){
          return response.blob();
        }
        else if(type == "buffer"){
          return response.arrayBuffer();
        }
    });
  },

  /*
    ---
    Evaluates a custom attribute and returns the action to take
    -1 : don't render the current vdom node
    0 : do nothing

    ---

    @param {String} key - the key name of the attr
    @param {String|?} data - the value of the attr
    @param {Array} parentVDOM - the vdom of this node
    @param {Component} component - the componet of this custom attribute
    @param {Element} dom - the com of the component

    @return {Number}


  */
  evalCustomAttr : (key, data, parentVDOM, comp) => {
    let params = key.split("-");
    let command = params[1];

    console.log("evaluating", data, parentVDOM);

    params.splice(0,2);
    let children = [];

    //creates multiple child nodes of the given type
    //q-for-li=["item 1","item 2"]
    if(command === "for"){
      for(let i in data){
        let vdom = [params[0], {}, [], []];
        if(params.length == 1){
          vdom[2].push(data[i]);
          parentVDOM[2].push(vdom);
        }
      }
    }
    else if(command == "template"){
      //console.log(data);
      if(params[0] && params[0] == "for"){
        for(let i=0; i<data[1].length; i++){
          let child;
          if(data[2]){
            child = comp.genTemplate(data[0], data[1][i], data[2]);
          }
          else{
            child = comp.genTemplate(data[0], data[1][i]);
          }

          if(child){

            let condition = Quas.getCustomAttrByKey(child, "q-if");
            if(condition === undefined || condition == true ){
              parentVDOM[2].push(child);
              console.log("added");
            }
          }
        }
      }
      else{
        let child = comp.genTemplate(data[0], data[1]);
        // console.log("child:", child);
        parentVDOM[2].push(child);
      }
      return 0;
    }
    else if(command == "if"){
      console.log("value:" + (data));
      if(data != true){
        return -1;
      }
    }
    //todo: remove
    //calls a function and passes the variable as a param
    else if(command === "bind"){
      if(params[0] === undefined){
        let vdom = data[0](data[1]);
        parentVDOM[2].push(vdom);
      }
      //bind-for, call the function for each variable in the array
      else if(params[0] === "for"){
        for(let o in data[1]){
          let vdom = data[0](data[1][o]);
          parentVDOM[2].push(vdom);
        }
      }
    }
    //todo: change so it accepts single vdoms and not just an array of vdoms
    //appends an array of vdoms to as a child of this node
    else if(command == "append"){
      console.log("appending:", data, parentVDOM);
       for(let i=0; i<data.length; i++){
         parentVDOM[2].push(data[i]);
       }
    }
    else{
      return Quas.customAttrs[command](params, data, parentVDOM, comp);
    }
    return 0;
  },

  getCustomAttrByKey(vdom, key){
    for(let i=0; i<vdom[3].length; i++){
      if(vdom[3][i].key == key){
        return vdom[3][i].val;
      }
    }
  },

  /**
    ---
    Returns an object with the browser info:
      - name : browser name,
      - version : browser version,
      - isMobile : true if a mobile browser

    Note: the isMobile variable might not be 100% accurate
    ---

    @return {Object}
  */
  getBrowserInfo : () => {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE ',version:(tem[1]||'')};
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1],
      isMobile : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
  },

  /**
    ---
    Returns the data from the url in as an object, it will also decode the URI
    ---
    @return {Object}

    ```
    // url: /home?key=val&foo=bar
    // => {key : "val", foo : "bar"}
    ```
  */
  getUrlValues : () => {
    let str = window.location.search;
    if(str.charAt(0)=="?"){
      str = str.substr(1, str.length-1);
    }
    let variables = str.split("&");
    let data = {};
    for(let i = 0; i<variables.length; i++){
      if(variables[i]!==""){
        let item = variables[i].split("=");
        data[item[0]] = decodeURI(item[1]);
      }
    }
    return data;
  },

  /**
    ---
    Set or change variables in the url
    If the value == "" then the value is removed form the url
    By default the page won't reload the page unless the reload parameter is set to true

    Note: values will be encoded so they are allowed to have spaces
    ---

    @param {Object} values - new url values
    @param {Boolean} reload - (optional)


    ```
    //url: /home
    Quas.setUrlValues({
      name:"john"
    });
    //updated: /home?name=john

    Quas.setUrlValues({
      name:""
    });
    //updated: /home

    Quas.setUrlValues({
      search :"the mouse"
    });
    //updated: /home?search=the%20mouse
    ```
  */
  setUrlValues : (newVals, reload) => {
    let data = Quas.getUrlValues();
    for(let key in newVals){
      data[key] = encodeURI(newVals[key]);
    }
    let str = "?";
    for(let key in data){
      if(data[key] != "")
        str += key + "=" + data[key] + "&";
    }
    str = str.slice(0,-1);

    if(reload){
      window.location = window.origin + window.location.pathname + str;
    }
    else if(history.pushState){
      let newurl = window.origin + window.location.pathname + str;
      if(newurl !== window.location.href){
        window.history.pushState(newVals,'',newurl);
      }
    }
  },


  /**
  # func
  ---
  Returns true if using the router module
  ---

  @return {Boolean}
  */
  hasModule : (name) => {
    return (typeof Quas.modules[name] !== "undefined");
  }
}

Quas.customAttrs = {}; //custom attributes
Quas.modules = {}; //container for all the modules


//calls the ready function once the document is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  if(typeof ready === "function" && typeof Dev == "undefined"){
    ready();
  }
});
