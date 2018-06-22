import Card from "/comps/card.js"

Quas.export(
  class LandingBody extends Component{
    constructor(){
      super();
      this.props.cards = [
        new Card({
          img : "small-rocket-ship-silhouette.png",
          title : "Super Fast",
          text : "Some text"
        }),
        new Card({
          img : "lightning-bolt-shadow.png",
          title : "Lightweight",
          text : "Less than 3KB with gzip"
        }),
        new Card({
          img : "couple-of-arrows-changing-places.png",
          title : "Modular Components",
          text : "Definately not the poor mans versin of react"
        }),
        new Card({
          img : "code.png",
          title : "Custom HTML Attributes",
          text : "what to put here"
        }),
        new Card({
          img : "desktop-monitor.png",
          title : "Breakpoints",
          text : "what to put here"
        }),
        new Card({
          img : "refresh-page-option.png",
          title : "Cookies",
          text : "what to put here"
        })
      ];
    }

    render(){
      return (
        <quas>
          <div>
            //landing top
            <div class="landing-top">
              <img class="landing-logo" q-async-imgsrc="/img/logo_landing.png">
              <div class="landing-desc">
                <h1>Quas.js</h1>
                <h2>A progressive JavaScript UI library</h2>
              </div>
            </div>
            <h2 class="section-heading">Features</h2>
            <div class="card-con" id="card-row-1">
              {this.props.cards[0].render(), this.props.cards[1].render(), this.props.cards[2].render()} //must put them in array for multiple components
            </div>
            <div class="card-con" id="card-row-2">
              {this.props.cards[3].render(), this.props.cards[4].render(), this.props.cards[5].render()} //must put them in array for multiple components
            </div>
          </div>
        </quas>
      );
    }
  }
);
