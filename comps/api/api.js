import Quas.Router
import Quas.Scroll
import Quas.Store
import Quas.Table

//templates
const APIItem = import "/comps/api/api-item.js"

import "/comps/api/api.css"


export(
  class APIBody extends Component{
    constructor(props){
      super(props);
      this.props.hashOffset = -80;

      if(Store.state.isAPILoaded === undefined){
        Store.state.isAPILoaded = false;
      }

      if(!Store.state.isAPILoaded){
        Store.data.api = [];
        Store.data.apiOverview = {};
        this.fetchData(this.props.path);
      }

      this.observe("isAPILoaded");
      this.anims = {
        enter : {
          type : "smallPop",
          duration : 0.3,
          timing : "ease-in",
          fade : true
        },
        exit : {
          type : "zoomIn",
          duration : 0.2,
          timing : "ease-in-out",
          fade: true
        }
      }

      this.props.propTable = new Table({
        name : "Name",
        types : "Type",
        desc : "Description"
      });
      this.props.propTable.addRowOperation("types", (data)=>{
        return data.join(" | ");
      });
    //  this.props.propTable.setColumnDisabled("desc", true);

    }

    initTemplates(){
      this.addTemplate("api-item", APIItem);
      this.addTemplate("class-heading", (cls) => {
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
      });

      this.addTemplate('heading', (text) => {
        return #<h2 id="{text}">{text}</h2>;
      });

      this.addTemplate("overview-item", (prop, type) => {
        if(type == "method"){
          return #<li><a href="#{prop.name}" target="push">{prop.name}</a></li>;
        }
        else if(type == "properties"){
          return #<li><a href="#properties" target="push">{prop.name}</a></li>;
        }
      });

      this.addTemplate("props-table-row", (prop) => {
        return(
          #<tr>
            <td>{prop.name}</td>
            <td>{prop.types.join(" | ")}</td>
            <td>{prop.desc}</td>
          </tr>
        );
      });
    }

    fetchData(path){
      Quas.fetch(path, "json").then((data) =>{
        let overview = {};
        for(let i in data){
          if(i != "docs"){
            overview[i] = data[i];
          }
        }

        APIBody.sortDocs(data.docs);
        Store.data.apiOverview = overview;
        Store.data.api = data.docs;
        Store.state.isAPILoaded = true;
        Scroll.toHash(this.props.hashOffset);
      }).catch((err) => console.error(err));
    }

    onPush(){
      let docs = Store.data.api;
      for(let i=0; i<docs.length; i++){
        for(let a=0; a<docs[i].funcs.length; a++){
          docs[i].funcs[a].showCode = false;
        }
      }
    }

    onAfterPush(){
      Scroll.toHash(this.props.hashOffset);
    }

    render(){


      if(!Store.state.isAPILoaded){
        return (
          #<div class="docs-content">
            <div class="placeholder placeholder-heading"></div>
            <div class="placeholder placeholder-line"></div>
            <div class="placeholder placeholder-line"></div>
            <div class="placeholder placeholder-line"></div>
          </div>
        );
      }
      else{
        let urlparms = Router.currentRoute.params;
        let pageID = urlparms.id;

        if(pageID == "overview"){
          return (
            #<div class="api-con">
              <h1>Overview</h1>
              <p>{"Version: ", Store.data.apiOverview.version}</p>
            </div>
          );
        }
        else{
          let cls = APIBody.findDocByName(pageID);
          this.props.propTable.setRows(cls.props);

          return (
            #<div class="api-con">
              //class heading and description
              <div q-template="['class-heading', cls]"></div>
              <p>{cls.desc}</p>

              //class methods and props navigation (overview)
              <div class="api-cls-overview">
                <div q-if="cls.funcs.length > 0" class="col">
                  <h4>Methods</h4>
                  <ul q-template-for="['overview-item', cls.funcs, 'method']"></ul>
                </div>
                <div q-if="cls.props.length > 0" class="col">
                  <h4>Properties</h4>
                  <ul q-template-for="['overview-item', cls.props, 'properties']"></ul>
                </div>
              </div>

              <div q-if="cls.props.length > 0">
                <h2 id="properties">Properties</h2>
                <table q-append="this.props.propTable.gen()"></table>
              </div>
              <h2 q-if="cls.funcs.length > 0">Methods</h2>
              <div q-template-for="['api-item', cls.funcs]"></div>
            </div>
          );
        }
      }
    }

    //orders all the data alphabetically
    static sortDocs(docs){
      docs = docs.sort((a, b) => {
        return a.name.localeCompare(b.name)
      });
      for(let i=0; i<docs.length; i++){
        docs[i].funcs = docs[i].funcs.sort();
        docs[i].funcs = APIBody.sortKey(docs[i].funcs, "name");
        docs[i].props = APIBody.sortKey(docs[i].props, "name");
      }
    }

    static sortKey(arr, key){
      return arr.sort((a, b) => {
        return a[key].localeCompare(b[key]);
      });
    }

    //find the documentation data by class name
    static findDocByName(name){
      let docs = Store.data.api;
      for(let i=0; i<docs.length; i++){
        if(docs[i].name.toLowerCase() == name){
          return docs[i];
        }
      }
    }

    //click event for code preview
    showCode(e){
      let funcName = e.target.attributes["data-func"].value;
      let clsName = Router.currentRoute.params.id;
      let docs = Store.data.api;
      //find the matching function in the documentation
      for(let i=0; i<docs.length; i++){
        if( (docs[i].type != "function") &&
            docs[i].name.toLowerCase() == clsName){
            for(let a=0; a<docs[i].funcs.length; a++){
                if(docs[i].funcs[a].name == funcName){
                  //set show to true and update the render
                  docs[i].funcs[a].showCode= true;
                  Quas.render(this);
                }
            }
        }
      }
    }
  }
);
