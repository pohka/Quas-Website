Quas.export(
  class Body extends Component{
    constructor(){
      super();
    }

    onPush(path){
      Quas.render(this);
    }

    render(){
      let currentPathID = Router.getCurrentPathID();
      if(currentPathID == "index"){
        return Body.renderIndex();
      }
      else if(Router.currentPathStartsWith("/docs")){
        return Body.renderDocs();
      }
      else if(currentPathID == "download"){
        return (
          <quas>
            <div>download</div>
          </quas>
        );
      }
      else{
        return (
          <quas>
            <div>404</div>
          </quas>
        );
      }
    }

    static renderIndex(){
      let card1 = new Card("small-rocket-ship-silhouette.png", "Super Fast", "Some text");
      let card2 = new Card("lightning-bolt-shadow.png", "Lightweight", "Less than 3KB with gzip");
      let card3 = new Card("couple-of-arrows-changing-places.png", "Modular Components", "Definately not the poor mans versin of react");
      let card4 = new Card("code.png", "Custom HTML Attributes", "what to put here");
      let card5 = new Card("desktop-monitor.png", "Breakpoints", "what to put here");
      let card6 = new Card("refresh-page-option.png", "Cookies", "what to put here");

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
              {card1.render(), card2.render(), card3.render()} //must put them in array for multiple components
            </div>
            <div class="card-con" id="card-row-2">
              {card4.render(), card5.render(), card6.render()} //must put them in array for multiple components
            </div>
          </div>
        </quas>
      );
    }

    static renderDocs(){
      if(Body.docsNav === undefined){
        Body.docsNav = new DocsNav();
      }
      if(Body.docsContent === undefined){
        Body.docsContent = new DocsContent();
      }

      let pr = "hello";
      //return (
      let a = (
        <quas>
          <div>
            {Body.docsNav.render()}
            <span>REEEEEEEEEEEEEEEEEEEEE</span>
            <div class="docs-content">
              {Body.docsContent.render()}
            </div>
          </div>
        </quas>
      );
      console.log(a);
      return a;
    }
  }
);
