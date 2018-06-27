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
            info[i] = data[i];
          }
        }
        //APIBody.overview = info,
        APIBody.docs = data.docs;
        this.setProps({
          isLoaded : true
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
        //console.log(urlparms);
        let pageID = urlparms.id;
        //console.log("pageID:" + pageID);
      //  let overview = this.props.overview;
    //    let docs = this.props.docs;
        if(pageID == "overview"){
        return (
          <quas>
            <div class="api-con">
              <h1>Overview</h1>
              <p>Version: </p>
              {this.nav.render()}
            </div>
          </quas>
        );
        }
        else{
          let cls = APIBody.findDocByName(pageID);
          let clsProps = APIBody.getListFromKey(cls, "props");
          let clsFuncs = APIBody.getListFromKey(cls, "funcs");
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
                {this.nav.render()}
              </div>
            </quas>
          )
        }
      }
    }

    static getListFromKey(cls, key){
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
