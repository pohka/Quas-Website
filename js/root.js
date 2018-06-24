//modules
import Router from "/quas/modules/router.js"
import CodeHighlighter from "/quas/modules/code-highlighter.js"
import Async from "/quas/modules/async.js"

//components
import Navbar from "/comps/navbar.js"
import DocsNav from "/comps/docs-nav.js"
import Body from "/comps/body.js"
import Error404 from "/comps/404.js"

import LandingBody from "/comps/landing-body.js"
import DownloadBody from "/comps/download-body.js"

//css
import "/css/quas-site.css"




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
        path : "/download",
        title : "Download",
        case : "/download"
      }
    ]
  };

  Router.add({
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
    children : []
  });

  Router.add({
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


  Router.add({
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

  Router.addAlias({
    from : "/other",
    to : "/download"
  });

  Router.load();
}
