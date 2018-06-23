import Router from "/quas/modules/router.js"

Quas.export(
  class DocsNav extends Component{
    constructor(props){
      super();
      this.props.pages = [];
      for(let i=0; i<props.pages.length; i++){
        this.props.pages.push({
          id : props.pages[i].id,
          path : props.pages[i].fullpath,
          title : props.pages[i].title,
        });
      }
    }

    static genItem(page){
      let isActive = (Router.currentPathID == page.id);
      return (
        <quas>
          <a href="{page.path}" target="push" class="docs-nav-item" active="{isActive}">{page.title}</a>
        </quas>
      );
    }

    render(){
      return (
        <quas>
          <div class="docs-nav-con">
            <div class="docs-nav-list" q-bind-for=[DocsNav.genItem,this.props.pages]></div>
          </div>
        </quas>
      );

    }
  }
);
