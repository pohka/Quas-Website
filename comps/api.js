import Router from "/quas/modules/router.js"
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
        let navVDOM = [this.nav.render()];

        if(pageID == "overview"){
          return (
            <quas>
              <div class="api-con">
                <h1>Overview</h1>
                <div q-append=navVDOM></div>
                <p>{"Version: ", this.props.version}</p>
              </div>
            </quas>
          );
        }
        else{
          let cls = APIBody.findDocByName(pageID);
          let clsProps = APIBody.getNamesFromKey(cls, "props");
          let clsFuncs = APIBody.getNamesFromKey(cls, "funcs");
          let clsContent = APIBody.genContent(cls);

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
                <div class="api-content" q-append=clsContent></div>
                <div q-append=navVDOM></div>
              </div>
            </quas>
          )
        }
      }
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
