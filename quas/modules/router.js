Quas.export(
  //handling of the mapping and changing the page
  class Router{
    //map a path
    static map(id, path, title, func){
      Router.paths[id] = {
          "path": path,
          "title":title
      };
    }

    static add(data){
      this.routes.push(data);
    }

    static load(){
      let path = window.location.pathname;
      let route = this.findRouteByPath(path, this.routes);
      if(route){
        console.log("found route");
        for(let i=0; i<route.comps.length; i++){
          Quas.render(route.comps[i], "#app");
        }
      }
    }

    static findRouteByPath(path, routes){
      for(let i=0; i<routes.length; i++){
        if(routes[i].path == path){
          return routes[i];
        }
        //if has children and path has a matching directory
        else if(routes[i].children && path.indexOf(routes[i].path) == 0){
          let r = this.findRouteByPath(path, routes[i].children);
          if(r){
            return r;
          }
        }
      }
    }

    //returns the path id of the current page using the URl
     static getCurrentPathID(){
       let url = location.pathname;
       for(let id in Router.paths){
         if(Router.paths[id].path == url){
           return id;
         }
       }
     }

     static currentPathStartsWith(str){
       return (location.pathname.indexOf(str) > -1);
     }

     //returns a id of a matching path to a href
     static getIDByPath(href){
       //remove origin form href
       let path = href.replace(window.origin,"");
       for(let id in Router.paths){
         if(Router.paths[id].path == path){
            return id;
          }
       }
     }

     //push a new page by the id in Router.paths
     static push(id){
       let newUrl = window.origin + Router.paths[id].path;
       window.history.pushState('','',newUrl);
       document.body.scrollTop = document.documentElement.scrollTop = 0;

      //notify event listeners
      for(let i in Router.pushListeners){
        Router.pushListeners[i].onPush(Router.paths[id].path);
      }
     }

     static pushByPath(path){
        let newUrl = window.origin + path;
        window.history.pushState('','',newUrl);
        for(let i in Router.pushListeners){
          Router.pushListeners[i].onPush(path);
        }
     }

     //add a component to listen to an Router event
     static addPushListener(comp){
       Router.pushListeners.push(comp);
     }

    static init(){
      this.paths = {};
      this.routes = [];
      this.pushListeners = [];
      window.addEventListener("popstate", function(e) {
        for(let i in Router.pushListeners){
          Router.pushListeners[i].onPush(e.target.location.href);
        }
      });
    }
  }
);

//all the paths mapped to the Router
//Router.paths = {};
//listeners to events
//Router.pushListeners = [];

//listen to back and forward button in browser
// window.addEventListener("popstate", function(e) {
//   for(let i in Router.pushListeners){
//     Router.pushListeners[i].onPush(e.target.location.href);
//   }
// });
