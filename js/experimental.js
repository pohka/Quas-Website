/*
  Helper function to prevent default events
  @param {Event}
*/
static preventDefault(e) {
 e = e || window.event;
 if (e.preventDefault)
     e.preventDefault();
 e.returnValue = false;
}

/*
  Helper function to prevent default events for keys
  @param {Event}
*/
static preventDefaultForScrollKeys(e) {
   if (Quas.scrollKeys[e.keyCode]) {
       Quas.preventDefault(e);
       return false;
   }
}

/*
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

/*
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
        let elTop = e.comp.dom.offsetTop;
        let elBot = elTop + e.comp.dom.offsetHeight;
        let currentlyVisible = viewport.bottom - Quas.scrollSafeZone.top > elTop && viewport.top + Quas.scrollSafeZone.bottom < elBot;
        if(e.comp !== undefined){
          if(type === "enter" && !e.visible && currentlyVisible){
            e.func(e.comp.dom);
          }
          else if(type === "exit" && e.visible && !currentlyVisible){
            e.func(e.comp.dom);
          }
        }
        e.visible = currentlyVisible;
      }
    }
  });
}

/*
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

Quas.trackingEls = {"enter" : [], "exit": []}; //all the scroll tracking events
Quas.scrollKeys = {37: 1, 38: 1, 39: 1, 40: 1}; //Keys codes that can scroll
Quas.scrollSafeZone = {"top": 0, "bottom" : 0}; //safezone padding for scroll listeners
Quas.isScrollable = true; //true if scrolling is enabled
