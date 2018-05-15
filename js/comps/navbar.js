class Navbar extends Component{
  constructor(items){
    super();
    this.pathIDs = items;
    Atlas.rerenderOnSet.push(this);
  }

  static createOption(pathID){
    let cls="";
    if(pathID == Atlas.getCurrentPathID()){
      cls = "active";
    }
    let pathInfo = Atlas.paths[pathID];
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
