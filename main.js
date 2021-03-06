//modules
import Quas.Router
import Quas.Async
import Quas.Animation
import Quas.DateHelper
import "/modules/code-highlighter.js"


//components
const Navbar = import "/comps/navbar.js"
const DocsNav = import "/comps/docs-nav.js"
const Error404 = import "/comps/404.js"
const TestComp = import "/comps/testcomp.js"
const LandingBody = import "/comps/landing-body.js"
const DownloadBody = import "/comps/download-body.js"
const DocsBody = import "/comps/docs-body.js"
const APIBody = import "/comps/api/api.js"
const APINav = import "/comps/api/api-nav.js"

//css
import "/pre.css"
import "/quas-site.css"

//testing
import Quas.Structs
import Quas.UrlParams

---

function ready(){
  let AIState = Structs.Enum(["attack", "patrol", "flee"]);
  let curState = AIState.flee;
  console.log("curState", curState, AIState.flee == curState);

  let test = new Date();
  console.log("test date:", test);
  test.sub({ year : 0, day : 25, second: 5});
  console.log("test date:", test);
  console.log("from now: " + test.fromNowFull("second", true));
  console.log("10s in ms:", Date.toMilliseconds({month: 1, day: 3}));

  //replacing the default code markdown rule
  Markdown.removeRule("code", "block");
  Markdown.addRule("block", {
    name : "code",
    isInlineRulesEnabled : false,
    pattern : /```+/,
    output : function(lines){
      let codeLang  = lines[0].replace(this.pattern, "").trim();
      lines.shift(0);
      lines.pop();
      let code = lines.join("\n");

      return  (
        #<pre>
          <code q-code="code" data-type="{codeLang}"></code>
        </pre>
      );
    }
  });


  console.log("ready");

  let navbarProps = {
    items : [
      {
        path : "/docs/setup",
        title : "Docs",
        case : "/docs"
      },
      {
        path : "/api/overview",
        title : "API",
        case : "/api/"
      },
      {
        path : "/download",
        title : "Download",
        case : "/download"
      },
      {
        path : "/test",
        title : "Test",
        case : "/test"
      }
    ]
  };

  Router.map({
    path : "/test",
    comps : [
      {
        comp : Navbar,
        props : navbarProps
      },
      {
        comp : TestComp
      }
    ]
  });

  Router.map({
    id : "index",
    path : "/",
    title : "Quas",
    comps : [
      {
        comp : Navbar,
        props : navbarProps
      },
      {
        comp : LandingBody
      }
    ],
    children : [],
    meta : [
      {
        name : "title",
        content : "Quas"
      },
      {
        name : "description",
        content : "A great UI lib"
      },
      {
        prop : "og:title",
        content : "Quas"
      }
    ]
  });

  Router.map({
    id : "download",
    path : "/download",
    title : "Download",
    comps : [
      {
        comp : Navbar,
        props : navbarProps
      },
      {
        comp : DownloadBody
      }
    ]
  });

  Router.map({
    id : "api",
    path : "/api/:id",
    title : "API",
    comps : [
      {
        comp : Navbar,
        props : navbarProps
      },
      {
        comp : APIBody,
        props : {
          path : "/docs/api.json"
        }
      },
      {
        comp : APINav
      }
    ]
  });

  let docsPages = [
    {
      path : "setup",
      title : "Setup"
    },
    {
      path : "components",
      title : "Components"
    }
  ];


  Router.map({
    id : "docs",
    path : "/docs/:page",
    comps : [
      {
        comp : Navbar,
        props : navbarProps
      },
      {
        comp : DocsNav,
        props : { pages : docsPages }
      },
      {
        comp : DocsBody
      }
    ]
  });


  Router.setRoute404({
    title : "404",
    comps : [
      {
        comp : Navbar,
        props : navbarProps
      },
      {
        comp : Error404
      }
    ]
  });


  Router.addRedirect({
    from : "/other/:page",
    to : "/docs/:page"
  });

  Router.load();
}
