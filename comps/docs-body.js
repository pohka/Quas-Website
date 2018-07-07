import Quas.Markdown

Quas.export(
  class DocsBody extends Component{
    constructor(){
      super();
      this.initStates({
        loaded : false,
        page : ""
      });
      this.props.content = [];
      this.fetchData();
    }

    onPush(route){
      this.fetchData();
    }

    fetchData(){
      let page = Router.currentRoute.params.page;
      let comp = this;
      Quas.fetch("/docs/"+page+".md").then((res) => {
          let vdoms = Markdown.parseToVDOM(res);
          comp.props.content = vdoms
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
        return (
          #<div class="docs-content" q-append="this.props.content"></div>
        );
      }
    }
  }
);
