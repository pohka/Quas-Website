class Navbar{
  constructor(items){
    this.navItems = items;
  }

  static genItems(items){
    <quas>
      <div class="nav-item" href=items.action>{items.text}</div>
    </quas>
  }

  render(){
    <quas>
      <nav>
        <div class="nav-logo" href="/">
          <img src="/img/logo_sm.png">
          <span>Quas.js</span>
        </div>
        <div q-bind=[Navbar.genItems,this.navItems] class="nav-con">
        </div>
        <input id="checkBox" type="checkbox" checked>
      </nav>
    </quas>
  }
}
