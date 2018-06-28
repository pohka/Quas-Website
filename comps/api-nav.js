
Quas.export(
  class APINav extends Component{

    static gen(item){
      let path = "/api/" + item.name.toLowerCase();
      return(
        <quas>
          <div>
            <a href="{path}" target="push">{item.name}</a>
          </div>
        </quas>
      );
    }

    render(){
      return(
        <quas>
          <div class="api-nav">
            <h3>Classes</h3>
            <div q-bind-for=[APINav.gen,APIBody.docs]></div>
          </div>
        </quas>
      );
    }
  }
);
