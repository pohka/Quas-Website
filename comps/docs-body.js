import Markdown from "/quas/modules/markdown.js"

Quas.export(
  class DocsBody extends Component{
    constructor(){
      super();
      this.props.loaded = false;
      this.props.content = [];
      this.fetchData();
    }

    onPush(route){
      this.setProps({
        loaded : false
      });
      this.fetchData();
    }

    fetchData(){
      let page = Router.currentRoute.params.page;
      let comp = this;
      Quas.fetch("/docs/"+page+".md").then((res) => {
        let vdoms = Markdown.parseToVDOM(res);
        comp.setProps({
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
      if(!this.props.loaded){
        return (
          <quas>
            <div class="docs-content">
              <div class="placeholder placeholder-heading"></div>
              <div class="placeholder placeholder-line"></div>
              <div class="placeholder placeholder-line"></div>
              <div class="placeholder placeholder-line"></div>
            </div>
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
