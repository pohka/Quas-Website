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
      Router.setFullPathToChildRoutes(data.children, data.path);
      data.fullpath = data.path;
      this.routes.push(data);
    }

    static setFullPathToChildRoutes(children, parentPath){
      if(!children){
        return;
      }

      for(let i=0; i<children.length; i++){
        children[i].fullpath = parentPath + children[i].path;
        Router.setFullPathToChildRoutes(children[i].children, children[i].fullpath);
      }
    }


    static load(){
      let path = window.location.pathname;
      let route = this.findRouteByPath(path);
      if(route){
        console.log("found route");
        document.title = route.title;
        this.currentRouteID = route.id;
        if(route.comps){
          for(let i=0; i<route.comps.length; i++){
            let props = {};
            if(route.comps[i].props){
              for(let p in route.comps[i].props){
                props[p] = route.comps[i].props[p];
              }
            }
          //  console.log(props);
            let comp = new route.comps[i].comp(props);
            this.comps.push(comp);

            Quas.render(comp, "#app");
          }
        }
      }
    }

    static findRouteByPath(path, routes){
      if(!routes){
        routes = this.routes;
      }
      for(let i=0; i<routes.length; i++){
        if(routes[i].fullpath == path){
          return routes[i];
        }
        //if has children and path has a matching directory
        else if(routes[i].children && path.indexOf(routes[i].fullpath) == 0){
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
       document.title = route.title;
       let newUrl = window.origin + route.fullpath;
       window.history.pushState('','',newUrl);

       //todo: move this into its own optional functionality
       document.body.scrollTop = document.documentElement.scrollTop = 0;


       this.currentRouteID = route.id;


       let newComps = [];
       let reuseComps = [];

       //update the components
       for(let r=0; r<route.comps.length; r++){
         let instance;
         let props;
         for(let i=0; i<this.comps.length && !instance; i++){
           if(this.comps[i] instanceof route.comps[r].comp){
             instance = this.comps[i];
             props = route.comps[r].props;
             this.comps.splice(i,1);
             i -= 1;
           }
         }

         //reusing an existing component
         if(instance){
           reuseComps.push(instance);
           if(typeof instance.onPush === "function"){
             instance.onPush(route);
           }
           instance.setProps(props);
         }
         //new component
         else{
           let comp = new route.comps[r].comp(route.comps[r].props);
           newComps.push(comp);
         }
       }

       //unmount the old components
       for(let i=0; i<this.comps.length; i++){
         this.comps[i].unmount();
       }

       //render the new components
       for(let i=0; i<newComps.length; i++){
         Quas.render(newComps[i], "#app");
       }

       //set the current components
       this.comps = newComps;
       for(let i=0; i<reuseComps.length; i++){
         this.comps.push(reuseComps[i]);
       }
     }

     //add a component to listen to an Router event
     static addPushListener(comp){
       Router.pushListeners.push(comp);
     }

    static init(){
      this.paths = {};
      this.routes = [];
      this.currentRouteID;
      this.pushListeners = [];
      this.comps = []; //all the current instances of components
      window.addEventListener("popstate", function(e) {
        let route = Router.findRouteByPath(e.target.location.pathname);
        Router.push(route);
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
