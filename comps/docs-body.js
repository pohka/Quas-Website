//import Markdown from "/quas/modules/markdown.js"

Quas.export(
  class DocsBody extends Component{
    constructor(){
      super();
      this.fetchData();
      this.props.loaded = false;
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
        this.setProps({"loaded" : true});
      })
      .catch(error => console.error(error));
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
            <h1>loaded</h1>
          </quas>
        );
      }
    }
  }
);
