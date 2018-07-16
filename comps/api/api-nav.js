import Quas.Store

---

export(
  class APINav extends Component{
    constructor(){
        super();
        this.createTemplates();
        this.observe("isAPILoaded");
        this.anims = {
          enter : {
            type : "slideLeft",
            duration : 0.3,
            timing : "ease-out",
          },
          exit : {
            type : "slideLeft",
            duration : 0.15,
            timing : "ease-out",
            fade : true
          }
        }
    }

    createTemplates(){
      this.addTemplate("nav-item", (item, type) =>{
        let path = "/api/" + item.name.toLowerCase();
        let isActive = (window.location.pathname == path);
        return(
          #<div q-if="item.type == type">
            <a href="{path}" target="push" active="{isActive}">{item.name}</a>
          </div>
        );
      });
    }

    render(){
      let isLoaded = Store.state.isAPILoaded;
      let docs = Store.data.api;
      if(!isLoaded){
        return (
          #<div class="api-nav">
            <div class="placeholder placeholder-heading"></div>
            <div class="placeholder placeholder-line"></div>
            <div class="placeholder placeholder-line"></div>
            <div class="placeholder placeholder-line"></div>
          </div>
        );
      }
      else{
        return (
          #<div class="api-nav">
            <h3>Classes</h3>
            <div q-if="typeof docs != 'undefined'"
              q-template-for="['nav-item', docs, 'class']"></div>
            <h3>Modules</h3>
            <div q-if="typeof docs != 'undefined'"
              q-template-for="['nav-item', docs, 'module']"></div>
          </div>
        );
      }
    }
  }
)
