
Quas.export({
    //generate an api block item for a function
    genItem : (func) => {
      let returnTypes = func.return.join(" | ");

      let returnVDOM;
      if(returnTypes.length > 0){
        returnVDOM = (
          <quas>
            <div class="api-content-item-return">
              <span class="api-returns">Returns: </span> {returnTypes}
            </div>
          </quas>
        );
      }
      else{
        returnVDOM = "";
      }

      let paramNames = [];

      let tableVDOM = [];
      if(func.params.length > 0){
        let paramVDOMs = [];
        paramVDOMs.push(
          <quas>
            <tr>
              <th>Parameter</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </quas>
        );
        for(let a=0; a<func.params.length; a++){
          paramNames.push(func.params[a].name);
          paramVDOMs.push(
            <quas>
              <tr>
                <td>{func.params[a].name}</td>
                <td>{func.params[a].types.join(" | ")}</td>
                <td>{func.params[a].desc}</td>
              </tr>
            </quas>
          );
        }

        tableVDOM = (
          <quas>
            <table q-append=paramVDOMs></table>
          </quas>
        );
      }



      return (
        <quas>
          <div class="api-content-item">
            <h3 id="{func.name}">{func.name, "( " + paramNames.join(", ") +" )"}</h3>
            <div class="api-content-item-info">
              <pre>
              <p>{func.desc}</p>
              </pre>
              <div q-append=[tableVDOM]></div>
              <div q-append=[returnVDOM]></div>
            </div>
          </div>
        </quas>
      );
    },

    //generates a heading
    genHeading : (text) => {
      return (
        <quas>
          <h2 id="{text}">{text}</h2>
        </quas>
      );
    },

    //generate the props table
    genPropsTable : (props) => {
      let tableRows = [(
        <quas>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </quas>
      )];

      for(let i=0; i<props.length; i++){
        tableRows.push(
          <quas>
            <tr>
              <td>{props[i].name}</td>
              <td>{props[i].types.join(" | ")}</td>
              <td>{props[i].desc}</td>
            </tr>
          </quas>
        )
      }

      return (
        <quas>
          <div class="api-props-table-con">
            <table q-append=tableRows></table>
          </div>
        </quas>
      );
    }
  }
);
