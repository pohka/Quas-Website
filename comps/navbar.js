import Router from "/quas/modules/router.js";
import "/comps/navbar.css";

Quas.export(
  class Navbar extends Component{
    constructor(props){
      super(props);
    }

    static createOption(routeID){
      let route = Router.findRouteByID(routeID);
      let cls = "";
      if(route.path == window.location.pathname){
        cls = "active";
      }


      return (
        <quas>
          <div><a class="nav-item {cls}" href="{route.path}" target="push">{route.title}</a></div>
        </quas>
      );
    }

    onPush(route){
    //  console.log(route);
      console.log("pushing");
      //Quas.render(this);
    }

    render(){
      console.log("rendering navbar");
      return (
        <quas>
          <nav>
            <a class="nav-logo" href="/" target="push">
              <img src="/img/logo_sm.png">
              <span>Quas.js</span>
            </a>
            <div q-bind-for=[Navbar.createOption,this.props.items] class="nav-con">
            </div>
            <div class="search-bar-con">
              <input type="text" class="search-bar" autocomplete="off" spellcheck="false" placeholder="Search API">
            </div>
            <div id="hex1" class="hexagon-wrapper">
              <span id="color1" class="hexagon"></span>
            </div>
            <div class="nav-right">
              <a href="https://github.com/pohka/Quas" target="_blank">
                <img src="/img/github-logo.png">
              </a>
            </div>
          </nav>
        </quas>
      );
    }
  }
);
