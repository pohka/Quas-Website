import Router from "/quas/modules/router.js"
import Scroll from "/quas/modules/scroll.js"
import Store from "/quas/modules/store.js"


import "/comps/api/api.css"


Quas.export(
  class APIBody extends Component{
    constructor(props){
      super(props);
      this.createTemplates();
      this.props.isLoaded = false;

      this.hashOffset = -80;

      if(!Store.getState("isAPILoaded")){
        Store.setData("api", []);
        Store.setData("version", -1);
        this.fetchData(this.props.path);
      }

      this.observe("isAPILoaded");
    }

    createTemplates(){
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
        setTimeout(() => {
          Store.setData("apiOverview", overview);
          Store.setData("api", data.docs);

          Store.setState("isAPILoaded", true);
          Scroll.toHash(this.hashOffset);
        }, 1000);
      }).catch((err) => console.error(err));
    }

    onPush(){
      let docs = Store.getData("api");
      for(let i=0; i<docs.length; i++){
        for(let a=0; a<docs[i].funcs.length; a++){
          docs[i].funcs[a].showCode = false;
        }
      }
    }

    onAfterPush(){
      Scroll.toHash(this.hashOffset);
    }

    render(){
      if(!Store.getState("isAPILoaded")){
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
              <p>{"Version: ", Store.getData("apiOverview").version}</p>
            </div>
          );
        }
        else{
          let cls = APIBody.findDocByName(pageID);
          let funcs = APIBody.genFuncItems(cls);

          return (
            #<div class="api-con">
              //class heading and description
              <div q-template="['class-heading', cls]"></div>
              <p>{cls.desc}</p>

              //class methods and props navigation (overview)
              <div class="api-cls-overview">
                <div class="col">
                  <h4>Methods</h4>
                  <ul q-template-for="['overview-item', cls.funcs, 'method']"></ul>
                </div>
                <div class="col">
                  <h4>Properties</h4>
                  <ul q-template-for="['overview-item', cls.props, 'properties']"></ul>
                </div>
              </div>

              <div q-if="cls.props.length > 0">
                <h2 id="properties">Properties</h2>
                <table q-template-for="['props-table-row', cls.props]">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </table>
              </div>
              <div q-append="funcs"></div>
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

    static genFuncItems(cls){
      let vdoms = [];
      if(cls.funcs.length > 0){
        vdoms.push(#<h2>Methods</h2>);
        for(let i=0; i<cls.funcs.length; i++){
           let vdom = APIBody.genItem(cls.funcs[i]);

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

    static genItem(func){
      let returnTypes = func.return.join(" | ");

      let paramNames = [];

      let tableVDOM;
      if(func.params.length > 0){

        let hasOptional = false;
        for(let a=0; a<func.params.length && !hasOptional; a++){
          if(func.params[a].optional){
            hasOptional= true;
          }
        }

        let headings = ["Parameter", "Type", "Description"];
        if(hasOptional){
          headings.push("Optional");
        }

        let tableRows = [];
        for(let a=0; a<func.params.length; a++){
          paramNames.push(func.params[a].name);

            let rowItems = [
              func.params[a].name,
              func.params[a].types.join(' | '),
              func.params[a].desc
            ];

            if(hasOptional){
              let optionStr = "No";
              if(func.params[a].optional){
                optionStr = "Yes";
              }
              rowItems.push(optionStr);
            }
            tableRows.push(rowItems);
        }

        tableVDOM = (
          #<table q-for-tr-td="tableRows">
            <tr q-for-th="headings"></tr>
          </table>
        );
      }

      return (
        #<div class="api-content-item">
          //title
          <h3 id="{func.name}">
            //prefix if static function
            <span q-if="func.isStatic" class="static">static</span>
            //function(param, param, ...)
            { func.name + "( " + paramNames.join(", ") +" )" }
          </h3>
          <div class="api-content-item-info">
            //function description
            <pre>
              <p>{func.desc}</p>
            </pre>
            //parameter table
            <div q-if="tableVDOM !== undefined">{tableVDOM}</div>

            //return value
            <div q-if="returnTypes.length > 0" class="api-content-item-return">
              <span class="api-returns">Returns: </span> {returnTypes}
            </div>

            //code block
            <pre q-if="func.showCode && func.code.length > 0" class="api-code">
              <code q-code-js="func.code"></code>
            </pre>
            //show code block button
            <div q-else-if="!func.showCode && func.code.length > 0"
              class="show-code" on-click="{APIBody.showCode}" data-func="{func.name}">
              Code {"</>"}
            </div>
          </div>
        </div>
      );
    }

    //find the documentation data by class name
    static findDocByName(name){
      let docs = Store.getData("api");
      for(let i=0; i<docs.length; i++){
        if(docs[i].name.toLowerCase() == name){
          return docs[i];
        }
      }
    }

    //click event for code preview
    static showCode(e, comp){
      let funcName = e.target.attributes["data-func"].value;
      let clsName = Router.currentRoute.params.id;
      let docs = Store.getData("api");
      //find the matching function in the documentation
      for(let i=0; i<docs.length; i++){
        if( (docs[i].type != "function") &&
            docs[i].name.toLowerCase() == clsName){
            for(let a=0; a<docs[i].funcs.length; a++){
                if(docs[i].funcs[a].name == funcName){
                  //set show to true and update the render
                  docs[i].funcs[a].showCode= true;
                  Quas.render(comp);
                }
            }
        }
      }
    }
  }
);
