Quas.export(
  //handling of the mapping and changing the page
  class Router{

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
            let comp = new route.comps[i].comp(props);
            this.comps.push(comp);

            Quas.render(comp, "#app");
          }
        }
      }
    }

    static findRouteByPath(path, routes, parentComps){
      if(!routes){
        routes = this.routes;
      }
      if(!parentComps){
        parentComps = [];
      }

      for(let i=0; i<routes.length; i++){
        //found match
        if(routes[i].fullpath == path){
          //clone the route so we can append the parentComps
          let clone = {};
          for(let a in routes[i]){
            if(a != "comps"){
              clone[a] = routes[i][a];
            }
          }

          //adding comps to clone
          clone.comps = parentComps;
          if(routes[i].comps){
            for(let c=0; c<routes[i].comps.length; c++){
              clone.comps.push(routes[i].comps[c]);
            }
          }

          return clone;
        }
        //if has children and path has a matching directory
        else if(routes[i].children && path.indexOf(routes[i].fullpath) == 0){

          let nextParentComps = [];

          for(let p=0; p<parentComps.length; p++){
            nextParentComps.push(parentComps[p]);
          }

          if(routes[i].comps){
            for(let p=0; p<routes[i].comps.length; p++){
              nextParentComps.push(routes[i].comps[p]);
            }
          }


          let r = this.findRouteByPath(path, routes[i].children, nextParentComps);
          if(r){
            return r;
          }
        }
      }
    }

    static getRouteInfoByID(id, routes){
      if(!routes){
        routes = this.routes;
      }
      for(let i=0; i<routes.length; i++){
        if(routes[i].id == id){
          return {
            id : routes[i].id,
            title : routes[i].title,
            fullpath : routes[i].fullpath
          };
        }
        //if has children and path has a matching directory
        else if(routes[i].children){
          let r = this.getRouteInfoByID(id, routes[i].children);
          if(r){
            return r;
          }
        }
      }
    }

    static getRouteInfoByPath(path, routes){
      if(!routes){
        routes = this.routes;
      }
      for(let i=0; i<routes.length; i++){
        if(routes[i].fullpath == path){
          return {
            id : routes[i].id,
            title : routes[i].title,
            fullpath : routes[i].fullpath
          };
        }
        //if has children and path has a matching directory
        else if(routes[i].children && path.indexOf(routes[i].fullpath) == 0){
          let r = this.getRouteInfoByPath(path, routes[i].children);
          if(r){
            return r;
          }
        }
      }
    }

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
