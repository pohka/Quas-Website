/**
  Super class for all components
*/
class Component{
  /**
    Sets a property and rerenders the component

    @param {String} key
    @param {?} value
  */
  setProp(k, v){
    this[k] = v;
    Quas.rerender(this);
  }

  /**
    removes this component from the DOM tree
  */
  remove(){
    this.el.parentNode.removeChild(this.el);
    this.el = undefined;
  }
}

class Quas{
  /**
    Renders a component
    Appends a component to as a child to a HTML DOM element
    alternatively you can specify the parent with a query selector (#id, .class, etc)

    @param {Component} component
    @param {String|HTMLDOMElement} parent
  */
  static render(comp, parent){
    if(parent.constructor === String){
      parent = document.querySelector(parent);
    }
    if(parent !== null){
      let info = comp.render();
      let el = Quas.createEl(info, comp);
      parent.appendChild(el);
      comp.el = el;
    }
  }

  /**
    Renders a component with a rule

    rule options:
      prepend     - insert as the first child to the parent
      #id         - insert after a child with this id. You can also use any value query selector
      #id before  - insert before a child with this id

    @param {Component} component
    @param {String|HTMLDOMElement} parent
    @param {String} rule
  */
  static renderRule(comp, parent, target){
    if(parent.constructor === String){
      parent = document.querySelector(parent);
    }
    if(parent !== null){
      let info = comp.render();
      let el = Quas.createEl(info, comp);
      if(target === undefined){
        parent.appendChild(el);
      }
      else if(target === "prepend"){
        parent.insertBefore(el, parent.childNodes[0]);
      }
      else{
        let arr = target.split(" ");
        let sel = arr[0];
        let before = (arr[1]!==undefined && arr[1]==="before");
        let t = parent.querySelector(sel);

        //after
        if(!before){
          t = t.nextSibling;
        }

        if(t !== null){
          parent.insertBefore(el, t);
        }
        else{
          parent.appendChild(el);
        }
      }

      comp.el = el;
    }
  }

  /**
    Rerenders a component
    This will update changes made to props

    @param {Component} component
  */
  static rerender(comp){
    let info = comp.render();
    let newEl = Quas.createEl(info, comp);
    let parent = comp.el.parentNode;

    parent.replaceChild(newEl, comp.el);
    comp.el = newEl;
  }

  /**
    Creates a HTML DOM Element in the DOM tree from a component and
    returns the newly created element

    renderInfo format:
    [tag,{attrKey:attrVal},[...]]
    or
    [textContent]

    Note: [...] == child element

    @param {Array} renderInfo - description of the element
    @param {Object} component
    @param {String|HTMLDOMElement} parent

    @return {HTMLDOMElement}
  */
  static createEl(info, comp, parent){
    //appending the text context
    if(info.constructor === String){
      parent.appendChild(document.createTextNode(info));
      return;
    }

    let tag = info[0];
    let attrs = info[1];
    let children = info[2];
    let el = document.createElement(tag);

    //children
    if(children !== undefined){
      for(let i in children){
        let child = Quas.createEl(children[i], comp, el);
        if(child !== undefined){
          el.appendChild(child);
        }
      }
    }

    //attributes
    for(let a in attrs){
      let prefix = a.substr(0,2);
      //custom attribute
      if(prefix === "q-"){
        let useAttr = Quas.evalCustomAttr(comp, el, a, attrs[a]);
        if(useAttr){
          el.setAttribute(a, attrs[a]);
        }
      }
      //event
      else if(prefix === "on"){
        let eventNames = a.substr(2).split("-on");
        for(let i in eventNames){
          el.addEventListener(eventNames[i],
            function(e){
              attrs[a](e, comp);
          });
        }
      }
      //attr
      else{
        el.setAttribute(a, attrs[a]);
      }
    }

    return el;
  }

  /**
    Ajax request

    @param {JSON} request - request data
    Layout of request:
    {
      url : "login.php",
      type : "GET|POST",
      data : {
        key : "value"
      },
      return : "json|xml",
      success : function(result){},
      error : function(errorMsg, errorCode){}
    }
  */
  static ajax(req){
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
            req.error(this.statusText, this.status);
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
    if(req.type === "POST"){
      xhr.open(req.type, req.url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(kvs);
    }
    //get requests
    else{
      xhr.open(req.type, req.url + "?" + kvs, true);

      //file uploading
      if(req.data !== undefined && req.data.constructor === FormData){
        xhr.send(req.data);
      }
      else{
        xhr.send();
      }
    }
  }

  /**
    Evaluates a custom attribute

    returns true if the custom attribute should be
    added to the HTML DOM Element

    @param {Component} component
    @param {HTMLDOMElement} parent
    @param {String} key
    @param {?} data  - this is often a string

    @return {Boolean}
  */
  static evalCustomAttr(comp, parent, key, data){
    let params = key.split("-");

    let command = params[1];
    params.splice(0,2);
    let children = [];

    if(command === "foreach"){
      for(let i in data){
        let el = document.createElement(params[0]);
        if(params.length == 1){
          el.textContent = data[i];
        }
        else{
          for(let j in data[i]){
            let ch = document.createElement(params[1]);
            ch.textContent = data[i][j];
            el.appendChild(ch);
          }
        }
        parent.appendChild(el);
      }
    }
    else if(command === "bind"){
        for(let o in data[1]){
          let domInfo = data[0](data[1][o]);
          let newEl = Quas.createEl(domInfo, comp);
          parent.appendChild(newEl);
        }
    }
    else{
      return Quas.customAttrs[command](comp, parent, params, data);
    }
  }

  /**
    Removes a component from the DOM tree

    @param {Component} component
  */
  static remove(comp){
    comp.el.parentNode.removeChild(comp.el);
  }

  /**
    Find an element with a matching selector, within this components element in thr DOM tree

    @param {Component} component
    @param {String} selector

    @return {HTMLDOMElement}
  */
  static findChild(comp, s){
    return comp.el.querySelector(s);
  }

  /**
    Call a function for each child specified for the selector

    @param {Component} component
    @param {String} selector
    @param {Function} callback
  */
  static eachChild(comp, s, func){
    [].forEach.call(comp.el.querySelectorAll(s), func);
  }

  /**
    Returns a json object with the browser info
    name - browser name,
    version - browser version,
    isMobile - true if a mobile browser

    @return {JSON}
  */
  static browserInfo(){
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
  }

  /**
    Returns the data from the url in as a JSON object
    Example:
      www.mysite.com/home?key=val&foo=bar => {key : "val", foo : "bar"}

    @return {JSON}
  */
  static getUrlValues(){
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
  }

  /**
    Reloads the page and set or change variables in the url
    If the value === "" then the value is removed form the url
    Values will be encoded so they are allowed to have spaces

    @param {JSON} values
  */
  static setUrlValues(newVals){
    let data = Quas.getUrlValues();
    for(let key in newVals){
      data[key] = encodeURI(newVals[key]);
    }
    let str = "?";
    for(let key in data){
      if(data[key] !== "")
        str += key + "=" + data[key] + "&";
    }
    str = str.slice(0,-1);
    window.location = window.origin + window.location.pathname + str;
  }

  /**
    Helper function to prevent default events
    @param {Event}
  */
  static preventDefault(e) {
   e = e || window.event;
   if (e.preventDefault)
       e.preventDefault();
   e.returnValue = false;
  }

  /**
    Helper function to prevent default events for keys
    @param {Event}
  */
  static preventDefaultForScrollKeys(e) {
     if (Quas.scrollKeys[e.keyCode]) {
         Quas.preventDefault(e);
         return false;
     }
  }

  /**
    Toggle or set users ability to scroll
    If enabled is undefined then the scroll ability will be toggled
    @param {Boolean} enabled - (optional)
  */
  static scrollable(enabled){
    if(enabled === undefined){
      enabled = !Quas.isScrollable;
    }
    if(enabled){
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }
    else{
      window.onwheel = Quas.preventDefault; // modern standard
      window.ontouchmove  = Quas.preventDefault; // mobile
      document.onkeydown  = Quas.preventDefaultForScrollKeys; //arrow keys
    }
    Quas.isScrollable = enabled;
  }

  /**
    enables scroll tracking for using scroll listeners

    The callback function allows you to make custom functionality from an onscroll event
    it will have 1 parameter for the viewport which has values from the offset of the top of the page
    viewport = {
      top : {Number} - minY of the raw viewport
      bottom : {Number} - maxY of the raw viewport
    }

    @param {Function} callback - (optional)
  */
  static enableScrollTracker(callback){
    window.addEventListener("scroll", function(){
      let viewport = {
        top : window.scrollY,
        bottom : window.scrollY + window.innerHeight
      };
      if(callback !== undefined){
        callback(viewport);
      }
      for(let type in Quas.trackingEls){
        for(let i in Quas.trackingEls[type]){
          let e = Quas.trackingEls[type][i];
          let elTop = e.comp.el.offsetTop;
          let elBot = elTop + e.comp.el.offsetHeight;
          let currentlyVisible = viewport.bottom - Quas.scrollSafeZone.top > elTop && viewport.top + Quas.scrollSafeZone.bottom < elBot;
          if(e.comp !== undefined){
            if(type === "enter" && !e.visible && currentlyVisible){
              e.func(e.comp.el);
            }
            else if(type === "exit" && e.visible && !currentlyVisible){
              e.func(e.comp.el);
            }
          }
          e.visible = currentlyVisible;
        }
      }
    });
  }

  /**
    Makes a component listen to a scroll event
    such as entering or exiting the visiblity of the viewport

    @param {String} eventName - enter|exit
    @param {Component} component
    @param {Function} callback
  */
  static onScroll(type, comp, callback){
    Quas.trackingEls[type].push({
      comp : comp,
      func : callback,
      visible: false
    });
  }

  /**
    Returns a cookie value by key
    @param {String} key

    @return {String}
  */
  static getCookie(key){
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
  }

  /**
  Sets a cookie

  @param {String} key
  @param {String} value
  @param {Date} date - (optional) default is 12hrs from now
  @param {String} path - (optional) default is "/"
  */
  static setCookie(k, v, date, path){
    if(path === undefined){
      path = "/";
    }
    //12hrs if not defined
    if(date === undefined){
      date = new Date();
      var expireTime = date.getTime() + 43200000;
      date.setTime(expireTime);
    }
     document.cookie = k + "=" + v + ";expires="+ date.toGMTString() +";path="+ path;
  }

  /**
    Removes a cookie by key

    @param {String} key
  */
  static clearCookie(k){
    document.cookie = k + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
  }

  /**
    Returns true if the component is rendered to the DOM tree

    @param {Component} component

    @return {Boolean}
  */
  static isRendered(comp){
    return comp.el !== undefined;
  }
}

Quas.trackingEls = {"enter" : [], "exit": []}; //all the scroll tracking events
Quas.scrollKeys = {37: 1, 38: 1, 39: 1, 40: 1}; //Keys codes that can scroll
Quas.scrollSafeZone = {"top": 0, "bottom" : 0}; //safezone padding for scroll listeners
Quas.isScrollable = true; //true if scrolling is enabled
Quas.customAttrs = {}; //custom attributes
Quas.isDevBuild = false; //true if using development mode
//Quas.path;  //current pathname
window.onload = function(){
  //Quas.path = location.pathname.replace("/", " ");

  if(typeof startQuas === "function" && !Quas.isDevBuild){
    startQuas();
  }
}
