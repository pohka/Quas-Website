class DocsNav extends Component{
  constructor(){
    super();
    DocsNav.content = new DocsContent();
    Quas.render(DocsNav.content, ".docs-content");
  }
  //set the url
  static setPath(e, comp){
    let page = this["data-page"];
    let newurl = window.origin + "/docs/" + page;
    if(newurl !== window.location.href){
      window.history.pushState('','',newurl);
      DocsNav.loadPath();
    }
  }

  //loads the path in the url
  static loadPath(){
    let page = location.pathname.replace("/docs/", "");
    for(let i in this.pages){
      let pageID = DocsNav.getPageID(this.pages[i]);
      if(page === pageID){
        DocsNav.content.set(pageID);
      }
    }
  }

  //converts a DocsNav.pages object into a valid url page name
  static getPageID(page){
    return page.toLowerCase().replace(/\s/g, "-");
  }

  //list items
  genItem(item){
    let url = DocsNav.getPageID(item);
    <quas>
      <div class="docs-nav-item" onclick=DocsNav.setPath data-page="{url}">{item}</div>
    </quas>
  }


  render(){
    <quas>
        <div class="docs-nav-con">
          <div class="docs-nav-list" q-bind-for=[this.genItem,DocsNav.pages]></div>
        </div>
    </quas>
  }
}

DocsNav.pages = [
  "Setup",
  "Props",
  "Updating Props",
  "Event Handling",
  "Sub Elements",
  "Conditional Rendering",
  "Production Builds",
  "Custom Attributes",
  "Custom Events",
  "AJAX Requests",
  "URL Parameters",
  "Cookies",
  "Query Elements",
  "Scrolling Breakpoints",
  "API"
];
