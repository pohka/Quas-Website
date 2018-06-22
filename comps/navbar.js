import "/comps/navbar.css";

Quas.export(
  class Navbar extends Component{
    constructor(props){
      super(props);
    }

    static createOption(pathID){
      let cls="";
      if(pathID == Router.getCurrentPathID() || (pathID == "docs" && Router.currentPathStartsWith("/docs"))){
        cls = "active";
      }
      let pathInfo = Router.paths[pathID];
      let title = pathID;
      let link = "";
      if(pathInfo){
        link = pathInfo.path;
        title = pathInfo.title
      }

      return (
        <quas>
          <div><a class="nav-item {cls}" href="{link}" target="push">{title}</a></div>
        </quas>
      );
    }

    onPush(path){
      console.log(path);
      Quas.render(this);
    }

    render(){
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
