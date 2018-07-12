import Quas.Markdown

export(
  class DocsBody extends Component{
    constructor(){
      super();
      this.initStates({
        loaded : false,
        page : ""
      });
      this.props.content;
      this.fetchData();
      this.anims = {
        enter : {
          type : "slide",
          duration : 0.3,
          timing : "ease-in-out",
        },
        exit : {
          type : "slide",
          duration : 0.2,
          timing : "ease-in-out",
          direction : "reverse"
        }
      }
    }

    onPush(route){
      if(this.state.page != Router.currentRoute.params.page){
        this.state.loaded = false;
        this.fetchData();
      }
    }

    fetchData(){
      let page = Router.currentRoute.params.page;
      let comp = this;
      Quas.fetch("/docs/"+page+".md").then((res) => {
          this.props.content = res;
          comp.setStates({
            loaded : true,
            page : page
          });
      })
      .catch(error => console.error(error));
    }

    render(){
      if(!this.state.loaded){
        return (
          #<div class="docs-content">
            <div class="placeholder placeholder-heading"></div>
            <div class="placeholder placeholder-line"></div>
            <div class="placeholder placeholder-line"></div>
            <div class="placeholder placeholder-line"></div>
          </div>
        );
      }
      else{
        let vdoms = Markdown.parseToVDOM(this.props.content);
        return (
          #<div class="docs-content" q-append="vdoms"></div>
        );
      }
    }
  }
);
