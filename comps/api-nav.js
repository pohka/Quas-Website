
Quas.export(
  class APINav extends Component{

    static gen(item, type){
      let path = "/api/" + item.name.toLowerCase();
      let isActive = (window.location.pathname == path);
      if(item.type == type){
        return(
          #<div>
            <a href="{path}" target="push" active="{isActive}">{item.name}</a>
          </div>
        );
      }
      else{
        return [];
      }
    }

    static genCls(item){
      return APINav.gen(item, "class");
    }

    static genModule(item){
      return APINav.gen(item, "module");
    }

    render(){
      return(
        #<div class="api-nav">
          <h3>Classes</h3>
          <div q-bind-for="{[APINav.genCls,APIBody.docs]}"></div>
          <h3>Modules</h3>
          <div q-bind-for="{[APINav.genModule,APIBody.docs]}"></div>
        </div>
      );
    }
  }
);
