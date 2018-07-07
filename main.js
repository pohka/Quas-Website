//modules
import Quas.Router
import Quas.CodeHighlighter
import Quas.Async

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
import "/quas-site.css"


function ready(){
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
