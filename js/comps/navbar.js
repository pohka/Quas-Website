class Navbar extends Component{
  constructor(items){
    super();
    this.pathIDs = items;
  }

  static createOption(pathID){
    /*
    let cls = "";
    let path = location.pathname.substr(1);
    if(items.text === "Docs"){
      if(path.indexOf("docs") == 0){
        cls = "active";
      }
    }
    */
    let cls="";
    console.log(Quas.getCurrentPathID());
    if(pathID == Quas.getCurrentPathID()){
      cls = "active";
    }
    let pathInfo = Quas.paths[pathID];
    <quas>
      <div><a class="nav-item {cls}" href="{pathInfo.path}" target="within">{pathInfo.title}</a></div>
    </quas>
  }

  render(){
    <quas>
      <nav>
        <a class="nav-logo" href="/" target="within">
          <img src="/img/logo_sm.png">
          <span>Quas.js</span>
        </a>
        <div q-bind-for=[Navbar.createOption,this.pathIDs] class="nav-con">
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
  }
}
