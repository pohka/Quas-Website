
Quas.export(
  {
    showCode : (e, comp) =>{
      let funcName = e.target.attributes["data-func"].value;
      let clsName = Router.currentRoute.params.id;
      for(let i=0; i<APIBody.docs.length; i++){
        if( (APIBody.docs[i].type != "function") &&
            APIBody.docs[i].name.toLowerCase() == clsName){
              for(let a=0; a<APIBody.docs[i].funcs.length; a++){
                  if(APIBody.docs[i].funcs[a].name == funcName){
                    APIBody.docs[i].funcs[a].showCode= true;
                    Quas.render(comp);
                  }
              }
        }
      }
    },

    //generate an api block item for a function
    genItem : (func) => {
      let returnTypes = func.return.join(" | ");

      let code = "";
      if(func.showCode && func.code.length > 0){
        code = (
          #<pre class="api-code">
            <code q-code-js="{func.code}"></code>
          </pre>
        );
      }
      if(!func.showCode && func.code.length > 0){
        let text = "</>"
        code = (
          #<div class="show-code" onclick="{APIItem.showCode}" data-func="{func.name}">Code {text}</div>
        );
      }

      let returnVDOM;
      if(returnTypes.length > 0){
        returnVDOM = (
          #<div class="api-content-item-return">
            <span class="api-returns">Returns: </span> {returnTypes}
          </div>
        );
      }
      else{
        returnVDOM = "";
      }

      let paramNames = [];

      let tableVDOM = [];
      if(func.params.length > 0){

        let hasOptional = false;
        for(let a=0; a<func.params.length && !hasOptional; a++){
          if(func.params[a].optional){
            hasOptional= true;
          }
        }

        let headings = ["Parameter", "Type", "Description"];
        if(hasOptional){
          headings.push("Optional");
        }

        let paramVDOMs = [];
        paramVDOMs.push(
          #<tr q-for-th="{headings}"></tr>
        );
        for(let a=0; a<func.params.length; a++){
          paramNames.push(func.params[a].name);
          if(!hasOptional){
            paramVDOMs.push(
              #<tr>
                <td>{func.params[a].name}</td>
                <td>{func.params[a].types.join(" | ")}</td>
                <td>{func.params[a].desc}</td>
              </tr>
            );
          }
          else{
            let optionStr = "No";
            if(func.params[a].optional){
              optionStr = "Yes";
            }
            paramVDOMs.push(
              #<tr>
                <td>{func.params[a].name}</td>
                <td>{func.params[a].types.join(" | ")}</td>
                <td>{func.params[a].desc}</td>
                <td>{optionStr}</td>
              </tr>
            );
          }
        }

        tableVDOM = #<table q-append="{paramVDOMs}"></table>;
      }



      return (
        #<div class="api-content-item">
          <h3 id="{func.name}" isStatic="{func.isStatic}">
            {func.name, "( " + paramNames.join(", ") +" )"}
          </h3>
          <div class="api-content-item-info">
            <pre>
            <p>{func.desc}</p>
            </pre>
            <div q-append="{[tableVDOM]}"></div>
            <div q-append="{[returnVDOM]}"></div>
            <div q-append="{[code]}"></div>
          </div>
        </div>
      );
    },

    //generates a heading
    genHeading : (text) => {
      return #<h2 id="{text}">{text}</h2>;
    },

    //generate the props table
    genPropsTable : (props) => {
      let tableRows = [(
          #<tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
      )];

      for(let i=0; i<props.length; i++){
        tableRows.push(
          #<tr>
            <td>{props[i].name}</td>
            <td>{props[i].types.join(" | ")}</td>
            <td>{props[i].desc}</td>
          </tr>
        )
      }

      return (
        #<div class="api-props-table-con">
          <table q-append="{tableRows}"></table>
        </div>
      );
    }
  }
);
