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
      Quas.rerender(nav);
      DocsNav.loadPath();
      window.scrollTo(0,0); //scroll to top
    }
    else{ //same page
      window.scrollTo(0,0); //scroll to top
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
    let page = DocsNav.getPageID(item);
    let currentURLPage = location.pathname.replace("/docs/", "");
    let isActive = (page == currentURLPage);
    <quas>
      <div class="docs-nav-item" onclick=DocsNav.setPath data-page="{page}" active="{isActive}">{item}</div>
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

DocsNav.set = function(pageID){
  window.history.pushState('','',"/docs/"+pageID);
  Quas.rerender(nav);
  DocsNav.loadPath();
  window.scrollTo(0,0); //scroll to top
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
