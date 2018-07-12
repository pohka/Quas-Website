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
          img : "small-rocket-ship-silhouette.png",
          title : "Super Fast",
          text : "Some text"
        },
        {
          img : "lightning-bolt-shadow.png",
          title : "Lightweight",
          text : "Less than 3KB with gzip"
        },
        {
          img : "couple-of-arrows-changing-places.png",
          title : "Modular Components",
          text : "Definately not the poor mans versin of react"
        },
        {
          img : "code.png",
          title : "Custom HTML Attributes",
          text : "what to put here"
        },
        {
          img : "desktop-monitor.png",
          title : "Breakpoints",
          text : "what to put here"
        },
        {
          img : "refresh-page-option.png",
          title : "Cookies",
          text : "what to put here"
        }
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
                <h2>A progressive JavaScript UI library</h2>
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
