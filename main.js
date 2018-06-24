//modules
import Router from "/quas/modules/router.js"
import CodeHighlighter from "/modules/code-highlighter.js"
import Async from "/quas/modules/async.js"

//components
import Navbar from "/comps/navbar.js"
import DocsNav from "/comps/docs-nav.js"
import Body from "/comps/body.js"
import Error404 from "/comps/404.js"

import LandingBody from "/comps/landing-body.js"
import DownloadBody from "/comps/download-body.js"

//css
import "/quas-site.css"




function ready(){
  console.log("ready");

  let navbarProps = {
    items : [
      {
        path : "/docs/setup",
        title : "Docs",
        case : "/docs/setup"
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

  Router.addRedirect({
    from : "/other",
    to : "/docs/setup"
  });

  Router.load();
}
