import Router from "/quas/modules/router.js"
import Scroll from "/quas/modules/scroll.js"


import "/comps/api/api.css"


Quas.export(
  class APIBody extends Component{
    constructor(props){
      super(props);
      this.createTemplates();
      this.props.isLoaded = false;
      this.fetchData(this.props.path);
      this.hashOffset = -80;

    }

    createTemplates(){
      this.addTemplate("nav-item", (item, type) =>{
        let path = "/api/" + item.name.toLowerCase();
        let isActive = (window.location.pathname == path);
      //  if(item.type == type)
        return(
          #<div q-if="item.type == type">
            <a href="{path}" target="push" active="{isActive}">{item.name}</a>
          </div>
        );
      });

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
        let pageID = urlparms.id;

        if(pageID == "overview"){
          return (
            #<div class="api-con">
              <h1>Overview</h1>
              <div class="api-nav">
                <h3>Classes</h3>
                <div q-template-for="['nav-item', APIBody.docs, 'class']"></div>
                <h3>Modules</h3>
                <div q-template-for="['nav-item', APIBody.docs, 'module']"></div>
              </div>
              <p>{"Version: ", this.props.version}</p>
            </div>
          );
        }
        else{
          let cls = APIBody.findDocByName(pageID);
          let funcs = APIBody.genFuncItems(cls);

          return (
            #<div class="api-con">


              <div q-template="['class-heading', cls]"></div>
              <div class="api-nav">
                <h3>Classes</h3>
                <div q-template-for="['nav-item', APIBody.docs, 'class']"></div>
                <h3>Modules</h3>
                <div q-template-for="['nav-item', APIBody.docs, 'module']"></div>
              </div>
              <p>{cls.desc}</p>
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


              //<div class="api-content" q-append="{clsContent}"></div>
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

      let code = "";
      if(func.showCode && func.code.length > 0){
        code = (
          #<pre class="api-code">
            <code q-code-js="func.code"></code>
          </pre>
        );
      }
      if(!func.showCode && func.code.length > 0){
        let text = "</>"
        code = (
          #<div class="show-code" on-click="{APIBody.showCode}" data-func="{func.name}">Code {text}</div>
        );
      }

      let returnVDOM;
      if(returnTypes.length > 0){
        returnVDOM = (
          #<div class="api-content-item-return">
            <span class="api-returns">Returns: </span> {returnTypes}
          </div>
        );
      }
      else{
        returnVDOM = "";
      }

      //
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

        let paramVDOMs = [];
        paramVDOMs.push(#<tr q-for-th="headings"></tr>);
        for(let a=0; a<func.params.length; a++){
          paramNames.push(func.params[a].name);
          if(!hasOptional){
            paramVDOMs.push(
              #<tr>
                <td>{func.params[a].name}</td>
                <td>{func.params[a].types.join(" | ")}</td>
                <td>{func.params[a].desc}</td>
              </tr>
            );
          }
          else{
            let optionStr = "No";
            if(func.params[a].optional){
              optionStr = "Yes";
            }
            paramVDOMs.push(
              #<tr>
                <td>{func.params[a].name}</td>
                <td>{func.params[a].types.join(" | ")}</td>
                <td>{func.params[a].desc}</td>
                <td>{optionStr}</td>
              </tr>
            );
          }
        }

        tableVDOM = #<table q-append="paramVDOMs"></table>;
      }

      return (
        #<div class="api-content-item">
          <h3 id="{func.name}" isStatic="{func.isStatic}">{
            func.name, "( " + paramNames.join(", ") +" )"
          }</h3>
          <div class="api-content-item-info">
            <pre>
            <p>{func.desc}</p>
            </pre>
            <div q-if="tableVDOM !== undefined">{
              tableVDOM
            }</div>
            <div>{returnVDOM}</div>
            <div>{code}</div>
          </div>
        </div>
      );
    }

    //find the documentation data by class name
    static findDocByName(name){
      for(let i=0; i<this.docs.length; i++){
        if(this.docs[i].name.toLowerCase() == name){
          return APIBody.docs[i];
        }
      }
    }


    static showCode(e, comp){
      let funcName = e.target.attributes["data-func"].value;
      let clsName = Router.currentRoute.params.id;
      for(let i=0; i<APIBody.docs.length; i++){
        if( (APIBody.docs[i].type != "function") &&
            APIBody.docs[i].name.toLowerCase() == clsName){
            for(let a=0; a<APIBody.docs[i].funcs.length; a++){
                if(APIBody.docs[i].funcs[a].name == funcName){
                  APIBody.docs[i].funcs[a].showCode= true;
                  Quas.render(comp);
                }
            }
        }
      }
    }
  }
);
