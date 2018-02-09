class Navbar{
  constructor(items){
    this.navItems = items;
  }

  static item(items){
    <quas>
      <div class="nav-item" href=items.action>{items.text}</div>
    </quas>
  }

  render(){
    <quas>
      <nav>
        <div q-bind=[Navbar.item,this.navItems] class="nav-con">
        </div>
      </nav>
    </quas>
  }
}
