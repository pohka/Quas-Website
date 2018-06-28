import Router from "/quas/modules/router.js"
import APINav from "/comps/api-nav.js"
import "/comps/api.css"


Quas.export(
  class APIBody extends Component{
    constructor(props){
      super(props);
      this.nav = new APINav();
      this.props.isLoaded = false;
      this.fetchData(this.props.path);
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
        this.setProps({
          isLoaded : true,
        });
      }).catch((err) => console.error(err));
    }

    render(){
      if(!this.props.isLoaded){
        return (
          <quas>
            <h1>Loading</h1>
          </quas>
        );
      }
      else{
        let urlparms = Router.currentRoute.params;
        let pageID = urlparms.id;
        if(pageID == "overview"){
        return (
          <quas>
            <div class="api-con">
              <h1>Overview</h1>
              <p>Version: {this.props.version}</p>
              {this.nav.render()}
            </div>
          </quas>
        );
        }
        else{
          let cls = APIBody.findDocByName(pageID);
          let clsProps = APIBody.getNamesFromKey(cls, "props");
          let clsFuncs = APIBody.getNamesFromKey(cls, "funcs");
          console.log(clsProps);
          //console.log(cls);
          return (
            <quas>
              <div class="api-con">
                {APIBody.genClassHeading(cls)}
                <p>{cls.desc}</p>
                <div class="api-cls-overview">
                  <div class="col">
                    <h4>Properties</h4>
                    <ul q-for-li=clsProps></ul>
                  </div>
                  <div class="col">
                    <h4>Methods</h4>
                    <ul q-for-li=clsFuncs></ul>
                  </div>
                </div>
                <div class="api-content" q-append="{this.genContent(cls)}">
                </div>
                {this.nav.render()}
              </div>
            </quas>
          )
        }
      }
    }

    genContent(cls){
      let doms = [];

      if(cls.props.length > 0){
        doms.push(
          <quas>
            <h2>Properties</h2>
          </quas>
        );

        let tableRows = [(
          <quas>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </quas>
        )];

        for(let i=0; i<cls.props.length; i++){

          tableRows.push(
            <quas>
              <tr>
                <td>{cls.props[i].name}</td>
                <td>{cls.props[i].types.join(" | ")}</td>
                <td>{cls.props[i].desc}</td>
              </tr>
            </quas>
          )
        }

        doms.push(
          <quas>
            <div class="api-props-table-con">
              <table q-append=tableRows></table>
            </div>
          </quas>
        );
      }


      if(cls.funcs.length > 0){
        doms.push(
          <quas>
            <h2>Methods</h2>
          </quas>
        );
      }

      for(let i=0; i<cls.funcs.length; i++){
        let returnTypes = cls.funcs[i].return.join(" | ");

        let returnVDOM;
        if(returnTypes.length > 0){
          returnVDOM = (
            <quas>
              <div class="api-content-item-return">
                <span class="api-returns">Returns: </span> {returnTypes}
              </div>
            </quas>
          );
        }
        else{
          returnVDOM = "";
        }

        let paramNames = [];

        let tableVDOM = [];
        if(cls.funcs[i].params.length > 0){
          let paramVDOMs = [];
          paramVDOMs.push(
            <quas>
              <tr>
                <th>Parameter</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </quas>
          );
          for(let a=0; a<cls.funcs[i].params.length; a++){
            paramNames.push(cls.funcs[i].params[a].name);
            paramVDOMs.push(
              <quas>
                <tr>
                  <td>{cls.funcs[i].params[a].name}</td>
                  <td>{cls.funcs[i].params[a].types.join(" | ")}</td>
                  <td>{cls.funcs[i].params[a].desc}</td>
                </tr>
              </quas>
            );
          }

          tableVDOM = (
            <quas>
              <table q-append=paramVDOMs></table>
            </quas>
          );
        }



        let dom = (
          <quas>
            <div class="api-content-item">
              <h3>{cls.funcs[i].name, "( " + paramNames.join(", ") +" )"}</h3>
              <div class="api-content-item-info">
                <pre>
                <p>{cls.funcs[i].desc}</p>
                </pre>
                <div q-append=[tableVDOM]></div>
                <div q-append=[returnVDOM]></div>
              </div>
            </div>
          </quas>
        );

        //constructor should always be first
        if(cls.funcs[i].name.toLowerCase() == "constructor"){
          doms.splice(0, 0, dom);
        }
        else{
          doms.push(dom);
        }
      }

      return doms;
    }

    static getNamesFromKey(cls, key){
      let arr = [];
      for(let i=0; i<cls[key].length; i++){
        arr.push(cls[key][i].name);
      }
      return arr;
    }

    static genClassHeading(cls){
      if(cls.super && cls.super != ""){
        let c = cls.super.toLowerCase();
        return (
          <quas>
            <h1>
              {cls.name} <span class="api-extend">extends
                <a href="/api/{c}" target="push">{cls.super}</a>
              </span>
            </h1>
          </quas>
        );
      }
      else{
        return(
          <quas>
            <h1>{cls.name}</h1>
          </quas>
        )
      }
    }

    static findDocByName(name){
      for(let i=0; i<this.docs.length; i++){
        if(this.docs[i].name.toLowerCase() == name){
          return APIBody.docs[i];
        }
      }
    }
  }
);
