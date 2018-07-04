import "/comps/card.css";

Quas.export(
  class LandingBody extends Component{
    constructor(){
      super();
      this.addTemplate("card", (props) => {
        return (
            #<div class="card">
              <img src="/img/{props.img}">
              <h3>{props.title}</h3>
              <span>{props.text}</span>
            </div>
        );
      });
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

    static clicked(){
      console.log("clicked");
    }

    render(){
      return (
          #<div>
            //landing top
            <div class="landing-top">
              <img class="landing-logo" q-async-imgsrc="/img/logo_landing.png">
              <div class="landing-desc">
                <h1 on-click="{LandingBody.clicked}">Quas.js</h1>
                <h2>A progressive JavaScript UI library</h2>
              </div>
            </div>
            <h2 class="section-heading">Features</h2>
            <div class="card-con"
              q-template-for="['card', this.props.cards]">
            </div>
          </div>
      );
    }
  }
);
