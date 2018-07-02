import Router from "/quas/modules/router.js"
import Scroll from "/quas/modules/scroll.js"

import APINav from "/comps/api-nav.js"
import APIItem from "/comps/api-item.js"
import "/comps/api.css"


Quas.export(
  class APIBody extends Component{
    constructor(props){
      super(props);
      this.nav = new APINav();
      this.props.isLoaded = false;
      this.fetchData(this.props.path);
      this.hashOffset = -80;
    }

    fetchData(path){
      console.log(path);
      Quas.fetch(path, "json").then((data) =>{
        let info = {};
        for(let i in data){
          if(i != "docs"){
            this.props[i] = data[i];
          }
        }
        //APIBody.overview = info,
        APIBody.docs = data.docs;
        APIBody.sortDocs();
        this.setProps({
          isLoaded : true,
        });
        Scroll.toHash(this.hashOffset);
      }).catch((err) => console.error(err));
    }

    onPush(){
      for(let i=0; i<APIBody.docs.length; i++){
        for(let a=0; a<APIBody.docs[i].funcs.length; a++){
          APIBody.docs[i].funcs[a].showCode = false;
        }
      }
    }

    onAfterPush(){
      Scroll.toHash(this.hashOffset);
    }

    render(){
      if(!this.props.isLoaded){
        return #<h1>Loading</h1>;
      }
      else{
        let urlparms = Router.currentRoute.params;
        console.log("params:" , urlparms);
        let pageID = urlparms.id;
        let navVDOM = [this.nav.render()];

        if(pageID == "overview"){
          return (
            #<div class="api-con">
              <h1>Overview</h1>
              <div q-append="{navVDOM}"></div>
              <p>{"Version: ", this.props.version}</p>
            </div>
          );
        }
        else{
          let cls = APIBody.findDocByName(pageID);
          let clsContent = APIBody.genContent(cls);

          return (
            #<div class="api-con">
              <div>{APIBody.genClassHeading(cls)}</div>
              <div q-append="{navVDOM}"></div>
              <p>{cls.desc}</p>
              <div class="api-cls-overview">
                <div class="col">
                  <h4>Methods</h4>
                  <ul q-bind-for="{[APIBody.genOverviewFuncListItem,cls.funcs]}"></ul>
                </div>
                <div class="col">
                  <h4>Properties</h4>
                  <ul q-bind-for="{[APIBody.genOverviewPropListItem,cls.props]}"></ul>
                </div>
              </div>
              <div class="api-content" q-append="{clsContent}"></div>

            </div>
          )
        }
      }
    }

    //orders all the data alphabetically
    static sortDocs(){
      APIBody.docs = APIBody.docs.sort((a, b) => {
        return a.name.localeCompare(b.name)
      });
      for(let i=0; i<APIBody.docs.length; i++){
        APIBody.docs[i].funcs = APIBody.docs[i].funcs.sort();
        APIBody.docs[i].funcs = APIBody.sortKey(APIBody.docs[i].funcs, "name");
        APIBody.docs[i].props = APIBody.sortKey(APIBody.docs[i].props, "name");
      }
    }

    static sortKey(arr, key){
      return arr.sort((a, b) => {
        return a[key].localeCompare(b[key]);
      });
    }

    static genOverviewFuncListItem(func){
      return #<li><a href="#{func.name}" target="push">{func.name}</a></li>;
    }

    static genOverviewPropListItem(prop){
      return #<li><a href="#properties" target="push">{prop.name}</a></li>;
    }

    static genContent(cls){
      let vdoms = [];
      //props
      if(cls.props.length > 0){
        vdoms.push(APIItem.genHeading("Properties"));
        vdoms.push(APIItem.genPropsTable(cls.props));
      }

      //functions
      if(cls.funcs.length > 0){
        vdoms.push(APIItem.genHeading("Methods"));
        for(let i=0; i<cls.funcs.length; i++){
          let vdom = APIItem.genItem(cls.funcs[i]);

          //constructor should always be first
          if(cls.funcs[i].name.toLowerCase() == "constructor"){
            vdoms.splice(0, 0, vdom);
          }
          else{
            vdoms.push(vdom);
          }
        }
      }

      return vdoms;
    }

    //generates the heading of a class
    static genClassHeading(cls){
      if(cls.super && cls.super != ""){
        let c = cls.super.toLowerCase();
        return (
          #<h1>
            {cls.name} <span class="api-extend">extends
              <a href="/api/{c}" target="push">{cls.super}</a>
            </span>
          </h1>
        );
      }
      else{
        return #<h1>{cls.name}</h1>;
      }
    }

    //find the documentation data by class name
    static findDocByName(name){
      for(let i=0; i<this.docs.length; i++){
        if(this.docs[i].name.toLowerCase() == name){
          return APIBody.docs[i];
        }
      }
    }
  }
);
