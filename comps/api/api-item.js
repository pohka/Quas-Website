
export((props)=>{
  let returnTypes = props.return.join(" | ");

  let paramNames = [];
  let paramTable;
  if(props.params.length > 0){

    let hasOptional = false;
    for(let a=0; a<props.params.length && !hasOptional; a++){
      if(props.params[a].optional){
        hasOptional= true;
      }
    }

    let table = new Table({
      name : "Parameter",
      types : "Type",
      desc : "Description",
      optional : "Optional"
    });

    if(!hasOptional){
      table.setColumnDisabled("optional", true);
    }
    table.addRows(props.params);
    table.addRowOperation("types", (data) => {
      return data.join(" | ");
    });
    table.addRowOperation("optional", (data) => {
      if(data){
        return "Yes";
      }
      return "No";
    });
    paramTable = table.gen();

      for(let a=0; a<props.params.length; a++){
        paramNames.push(props.params[a].name);
      }


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
        <table q-if="paramTable" q-append="paramTable"></table>

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
