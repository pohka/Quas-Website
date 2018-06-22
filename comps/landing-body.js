import Card from "/comps/card.js"

Quas.export(
  class LandingBody extends Component{
    constructor(){
      super();
      this.cards = [
        new Card("small-rocket-ship-silhouette.png", "Super Fast", "Some text"),
        new Card("lightning-bolt-shadow.png", "Lightweight", "Less than 3KB with gzip"),
        new Card("couple-of-arrows-changing-places.png", "Modular Components", "Definately not the poor mans versin of react"),
        new Card("code.png", "Custom HTML Attributes", "what to put here"),
        new Card("desktop-monitor.png", "Breakpoints", "what to put here"),
        new Card("refresh-page-option.png", "Cookies", "what to put here"),
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
              {this.cards[0].render(), this.cards[1].render(), this.cards[2].render()} //must put them in array for multiple components
            </div>
            <div class="card-con" id="card-row-2">
              {this.cards[3].render(), this.cards[4].render(), this.cards[5].render()} //must put them in array for multiple components
            </div>
          </div>
        </quas>
      );
    }
  }
);
