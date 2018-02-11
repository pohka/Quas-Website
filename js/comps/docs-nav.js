class DocsNav extends Component{
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
      if(page === DocsNav.getPageURL(this.pages[i])){
        this.pages[i].func();
      }
    }
  }

  //example function for loading a sub element
  static sample(){
    console.log("sample");
  }

  //converts a DocsNav.pages object into a valid url page name
  static getPageURL(page){
    return page.text.toLowerCase().replace(/\s/g, "-");
  }

  //list items
  genItem(item){
    let url = DocsNav.getPageURL(item);
    <quas>
      <div class="docs-nav-item" onclick=DocsNav.setPath data-page="{url}">{item.text}</div>
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
  {text : "Setup", func : DocsNav.sample},
  {text : "Props", func : DocsNav.sample},
  {text : "Updating Props", func : DocsNav.sample},
  {text : "Event Handling", func : DocsNav.sample},
  {text : "Sub Elements", func : DocsNav.sample},
  {text : "Conditional Rendering", func : DocsNav.sample},
  {text : "Production Builds", func : DocsNav.sample},
  {text : "Custom Attributes", func : DocsNav.sample},
  {text : "Custom Events", func : DocsNav.sample},
  {text : "AJAX Requests", func : DocsNav.sample},
  {text : "URL Parameters", func : DocsNav.sample},
  {text : "Cookies", func : DocsNav.sample},
  {text : "Query Elements", func : DocsNav.sample},
  {text : "Scrolling Breakpoints", func : DocsNav.sample},
  {text : "API", func : DocsNav.sample},
];
