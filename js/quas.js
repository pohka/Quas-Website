class Quas{
  //renders a component to a target HTML DOM element
  static render(comp, target){
    if(target.constructor === String){
      target  = document.querySelector(target);
    }
    if(target!==null){
      let info = comp.render();
      let el = Quas.createEl(info, comp);
      target.appendChild(el);
      comp.el = el;
    }
  }

  //rerenders and the component
  static rerender(comp){
    let info = comp.render();
    let newEl = Quas.createEl(info, comp);
    let parent = comp.el.parentNode;

    parent.replaceChild(newEl, comp.el);
    comp.el = newEl;
  }

  //creates and returns a HTML DOM Element
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
        Quas.evalCustomAttr(comp, el, a, attrs[a]);
        //don't set custom attribute in DOM if value is an array
      //  if(!Array.isArray(attrs[a])){
      //    el.setAttribute(a, attrs[a]);
      //  }
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
    @param {JSON} req - request data
    Layout of req:
    {
      url : "login.php",
      type : "POST",
      data : {
        key : "value"
      },
      return : "json",
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

  //evaluates a custom attribute
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
      Quas.customAttrs[command](comp, parent, params, data);
    }
  }


  static remove(comp){
    comp.el.parentNode.removeChild(comp.el);
  }

  //find an element with a matching selector, within this components DOM element
  static findChild(comp, s){
    return comp.el.querySelector(s);
  }

  //call this function for each child specified for the selector
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
    @param {JSON} newVals
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
    Helper function to prevent default events
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

  //enables scroll tracking for using scroll listeners
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

  //listens and event entering or exiting the visiblity of a component
  static onScroll(type, comp, callback){
    Quas.trackingEls[type].push({
      comp : comp,
      func : callback,
      visible: false
    });
  }

  //returns a cookie
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

  //sets a cookie
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

  //removes a cookie
  static clearCookie(k){
    document.cookie = k + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
  }
}

Quas.trackingEls = {"enter" : [], "exit": []};
Quas.scrollKeys = {37: 1, 38: 1, 39: 1, 40: 1}; //Keys codes that can scroll
Quas.scrollSafeZone = {"top": 0, "bottom" : 0}; //safezone padding for scroll listeners
Quas.isScrollable = true;
Quas.customAttrs = {};
Quas.isDevBuild = false;
Quas.path;
window.onload = function(){
  Quas.path = location.pathname.substr(1);
  if(typeof start === "function" && !Quas.isDevBuild){
    start();
  }
}
