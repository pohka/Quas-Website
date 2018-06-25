import Markdown from "/quas/modules/markdown.js"

Quas.export(
  class DocsBody extends Component{
    constructor(){
      super();
      this.fetchData();
      this.props.loaded = false;
      this.props.content = [];
    }

    onPush(route){
      if(this.props.loaded){
        this.props.loaded = false;
      }
      this.fetchData();
    }

    fetchData(){
      let page = Router.currentRoute.params.page;
      Quas.fetch("/docs/"+page+".md").then((res) => {
        let vdoms = Markdown.parseToVDOM(res);
        console.log(vdoms);
        this.setProps({
          loaded : true,
          content : vdoms
        });
      })
      .catch(error => console.error(error));
    }

    static addVDOM(vdom){
      return vdom;
    }

    render(){
      console.log("rendering docs body - loaded: " + this.props.loaded);
      if(!this.props.loaded){
        return (
          <quas>
            <h1>not loaded yet</h1>
          </quas>
        );
      }
      else{
        return (
          <quas>
            <div class="docs-content" q-bind-for=[DocsBody.addVDOM,this.props.content]></div>
          </quas>
        );
      }
    }
  }
);
