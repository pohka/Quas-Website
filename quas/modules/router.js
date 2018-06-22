Quas.export(
  //handling of the mapping and changing the page
  class Router{
    //map a path
    /*
    static map(id, path, title, func){
      Router.paths[id] = {
          "path": path,
          "title":title
      };
    }
    */

    static add(data){
      this.routes.push(data);
    }

    static load(){
      let path = window.location.pathname;
      let route = this.findRouteByPath(path);
      if(route){
        console.log("found route");
        this.currentRouteID = route.id;
        for(let i=0; i<route.comps.length; i++){
          let comp = new route.comps[i].comp(route.comps[i].props);
          this.comps.push(comp);

          Quas.render(comp, "#app");
        }
      }
    }

    static findRouteByPath(path, routes){
      if(!routes){
        routes = this.routes;
      }
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

    static findRouteByID(id, routes){
      if(!routes){
        routes = this.routes;
      }
      for(let i=0; i<routes.length; i++){
        if(routes[i].id == id){
          return routes[i];
        }
        //if has children and path has a matching directory
        else if(routes[i].children){
          let r = this.findRouteByID(id, routes[i].children);
          if(r){
            return r;
          }
        }
      }
    }

    //returns the path id of the current page using the URl
    /*
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
     */

     //push a new page by the id in Router.paths
     static push(route){
       console.log(route);
       let newUrl = window.origin + route.path;
       window.history.pushState('','',newUrl);

       //todo: move this into its own optional functionality
       document.body.scrollTop = document.documentElement.scrollTop = 0;

       //let cur = this.findRouteByID(this.currentRouteID);
       //for(let i=0; i<cur.comps.length; i++){
      //
       //}
       let newComps = [];

       for(let r=0; r<route.comps.length; r++){
         let hasInstance = false;
         let instance;
         for(let i=0; i<this.comps.length && !hasInstance; i++){
          // console.log(route.comps[r].comp);
           if(this.comps[i] instanceof route.comps[r].comp){
             hasInstance = true;
            // console.log("found matching instance");
             instance = this.comps[i];
           }
         }

         if(hasInstance){
           newComps.push(instance);
           if(typeof instance.onPush === "function"){
             instance.onPush(route);
           }
         }
         else{
           //todo: unmount existing component
           let comp = new route.comps[r].comp(route.comps[r].props);
           newComps.push(comp);
         }
       }


       this.comps = newComps;
       this.currentRouteID = route.id;


      //notify event listeners
      //for(let i in Router.pushListeners){
    //    Router.pushListeners[i].onPush(route);
      //}
     }

     /*
     static pushByPath(path){
        let newUrl = window.origin + path;
        window.history.pushState('','',newUrl);
        for(let i in Router.pushListeners){
          Router.pushListeners[i].onPush(path);
        }
     }
     */

     //add a component to listen to an Router event
     static addPushListener(comp){
       Router.pushListeners.push(comp);
     }

    static init(){
      this.paths = {};
      this.routes = [];
      this.currentRouteID;
      this.pushListeners = [];
      this.comps = [];
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
