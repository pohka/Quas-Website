class Navbar extends Component{
  constructor(items){
    super();
    this.navItems = items;
  }

  static genItems(items){
    let cls = "";
    if(items.text === "Docs" && Quas.path !== undefined){
      let path = Quas.path.split("/")[0];

      if(path === "docs"){
        cls = "active";
      }
    }
    <quas>
      <a class="nav-item {cls}" href="{items.action}">{items.text}</div>
    </quas>
  }

  render(){
    <quas>
      <nav>
        <a class="nav-logo" href="/">
          <img src="/img/logo_sm.png">
          <span>Quas.js</span>
        </div>
        <div q-bind=[Navbar.genItems,this.navItems] class="nav-con">
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
