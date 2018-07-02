//modules

import Router from "/quas/modules/router.js"
// import CodeHighlighter from "/modules/code-highlighter.js"
import Async from "/quas/modules/async.js"
//
// //components
import Navbar from "/comps/navbar.js"
// import DocsNav from "/comps/docs-nav.js"
// import Body from "/comps/body.js"
// import Error404 from "/comps/404.js"
//
import LandingBody from "/comps/landing-body.js"
// import DownloadBody from "/comps/download-body.js"
// import DocsBody from "/comps/docs-body.js"
// import APIBody from "/comps/api.js"
//
// //css
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
      }
    ]
  };

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
  /*
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
  */

  Router.load();
}
