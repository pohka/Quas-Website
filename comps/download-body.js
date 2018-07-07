
Quas.export(
  class DownloadBody extends Component{
    render(){
      if(DownloadBody.renderedOnce === undefined){
          DownloadBody.renderedOnce = 0;
      }
      else{
        DownloadBody.renderedOnce++;
      }
      if(DownloadBody.renderedOnce%2 == 0){

        return #<div>download</div>
      }
      else{
        return "";
      }
    }
  }
);
