class DocsNav extends Component{
  constructor(){
    super();
    this.pages = [
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
      "URL Variables",
      "Cookies",
      "Query Elements",
      "Scrolling Breakpoints",
      "API"
    ]
  }

  genItem(name){
    <quas>
      <a href="">{name}</a>
    </quas>
  }


  render(){
    <quas>
        <div class="docs-nav-con">
          <div class="docs-nav-list" q-bind=[this.genItem,this.pages]></ul>
        </div>
    </quas>
  }
}
