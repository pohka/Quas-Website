class DocsNav extends Component{
  constructor(){
    super();
  }
  //set the url
  static setPath(e, comp){
    let page = this["data-page"];
    Atlas.pushByPath("/docs/" + page);
    window.scrollTo(0,0); //scroll to top
  }

  //converts a DocsNav.pages object into a valid url page name
  static getPageID(page){
    return page.toLowerCase().replace(/\s/g, "-");
  }

  //list items
  genItem(item){
    let page = DocsNav.getPageID(item.name);
    let currentURLPage = location.pathname.replace("/docs/", "");
    let isActive = (page == currentURLPage);
    <quas>
      <div class="docs-nav-item" onclick=DocsNav.setPath data-page="{page}" active="{isActive}">{item.name}</div>
    </quas>
  }


  render(){
    <quas>
        <div class="docs-nav-con">
          <div class="docs-nav-list" q-bind-for=[this.genItem,DocsContent.pages]></div>
        </div>
    </quas>
  }
}
