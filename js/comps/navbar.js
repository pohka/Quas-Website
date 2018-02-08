class Navbar extends Comp{
  constructor(items){
    super();
    this.navItems = items;
  }

  static item(text, link){
    <quas>
      <div class="nav-item" href=link>{text}</div>
    </quas>
  }

  render(){
    <quas>
      <nav>
        <div q-for-arr=[this.navItems,Navbar.item] class="nav-con">
          {Navbar.item("test3", "abc")}
        </div>
      </nav>
    </quas>
  }
}
