import "/comps/card.css";

export(
  class LandingBody extends Component{
    constructor(){
      super();

      this.anims = {
        enter : {
          type : "smallZoomIn",
          duration : 0.2,
          timing : "ease-in-out",
        }
      }

      this.props.cards = [
        {
          img : "code.png",
          title : "Components",
          text : "Create reusable UI elements"
        },
        {
          img : "lightning-bolt-shadow.png",
          title : "Modules",
          text : "Form Handling, markdown, cookies and much more"
        },
        {
          img : "lightning-bolt-shadow.png",
          title : "Lightweight",
          text : "Core library is only 10KB with gzip"
        },
        {
          img : "couple-of-arrows-changing-places.png",
          title : "Animation",
          text : "Add a greater level of fidelity"
        },

        {
          img : "desktop-monitor.png",
          title : "Routing",
          text : "Build single page web apps easily"
        },
        {
          img : "small-rocket-ship-silhouette.png",
          title : "Virtual DOM Diffing",
          text : "Update the DOM tree with only the changes"
        },
        {
          img : "small-rocket-ship-silhouette.png",
          title : "Bundling",
          text : "No config file, mport your modules and components directly within your code"
        },
      ];
    }

    initTemplates(){
      this.addTemplate("card", (props) => {
        return (
            #<div class="card">
              <img src="/img/{props.img}">
              <h3>{props.title}</h3>
              <span>{props.text}</span>
            </div>
        );
      });
    }

    onClick(e, arg){
      console.log(e.type, arg);
    }

    render(){
      return (
          #<div>
            //landing top
            <div .landing-top .test>
              <img .landing-logo q-async-imgsrc="'/img/logo_landing.png'">
              <div .landing-desc>
                <h1 on-click="onClick:2" on-mouseover="onClick:1">Quas.js</h1>
                <h2>A modular JavaScript UI library</h2>
              </div>
            </div>
            <h2 .section-heading>Features</h2>
            <div .card-con
              q-template-for="['card', this.props.cards]">
            </div>
          </div>
      );
    }
  }
);
