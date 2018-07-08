
export((props)=>{
  let returnTypes = props.return.join(" | ");

  let paramNames = [];

  let tableVDOM;
  if(props.params.length > 0){

    let hasOptional = false;
    for(let a=0; a<props.params.length && !hasOptional; a++){
      if(props.params[a].optional){
        hasOptional= true;
      }
    }

    let headings = ["Parameter", "Type", "Description"];
    if(hasOptional){
      headings.push("Optional");
    }

    let tableRows = [];
    for(let a=0; a<props.params.length; a++){
      paramNames.push(props.params[a].name);

        let rowItems = [
          props.params[a].name,
          props.params[a].types.join(' | '),
          props.params[a].desc
        ];

        if(hasOptional){
          let optionStr = "No";
          if(props.params[a].optional){
            optionStr = "Yes";
          }
          rowItems.push(optionStr);
        }
        tableRows.push(rowItems);
    }

    tableVDOM = (
      #<table q-for-tr-td="tableRows">
        <tr q-for-th="headings"></tr>
      </table>
    );
  }

  return (
    #<div class="api-content-item">
      //title
      <h3 id="{props.name}">
        //prefix if static function
        <span q-if="props.isStatic" class="static">static</span>
        //function(param, param, ...)
        { props.name + "( " + paramNames.join(", ") +" )" }
      </h3>
      <div class="api-content-item-info">
        //function description
        <pre>
          <p>{props.desc}</p>
        </pre>
        //parameter table
        <div q-if="tableVDOM !== undefined">{tableVDOM}</div>

        //return value
        <div q-if="returnTypes.length > 0" class="api-content-item-return">
          <span class="api-returns">Returns: </span> {returnTypes}
        </div>

        //code block
        <pre q-if="props.showCode && props.code.length > 0" class="api-code">
          <code q-code-js="props.code"></code>
        </pre>
        //show code block button
        <div q-else-if="!props.showCode && props.code.length > 0"
          class="show-code" on-click="showCode" data-func="{props.name}">
          Code {"</>"}
        </div>
      </div>
    </div>
  );
})
