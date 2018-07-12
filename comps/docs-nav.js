import Quas.Router

export(
  class DocsNav extends Component{
    constructor(props){
      super(props);
      let route = Router.getRouteInfoByID("docs");
      DocsNav.path = route.fullpath;
      this.anim = {
        enter : {
          type : "slidein",
          duration : 0.3,
          effect : "ease-in-out"
        },
        exit : {
          type : "slideout",
          duration : 0.15,
          effect : "ease-in-out"
        }
      }
    }


    static genItem(page){
      let path = Router.convertToDynamicPath(DocsNav.path, { page : page.path });
      let isActive = (Router.currentRoute.fullpath == path);
      if(isActive){
        document.title = page.title;
      }

      return (
          #<a href="{path}" target="push" class="docs-nav-item" active="{isActive}">{page.title}</a>
      );
    }

    render(){
    //  console.log("rendering docs nav");
      return (
        #<div class="docs-nav-con">
          <div class="docs-nav-list" q-bind-for="[DocsNav.genItem,this.props.pages]"></div>
        </div>
      );

    }
  }
);
