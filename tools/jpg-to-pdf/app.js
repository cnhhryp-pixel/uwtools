// JPG/PNG to PDF browser converter using jsPDF.
(function(){
  function readImage(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onerror=()=>reject(new Error('Could not read '+file.name));
      reader.onload=e=>{
        const img=new Image();
        img.onerror=()=>reject(new Error('Could not decode '+file.name));
        img.onload=()=>resolve({img,data:e.target.result,file});
        img.src=e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  window.convertImagesToPDF=async function(files,opts={}){
    if(!window.jspdf||!files||!files.length)throw new Error('jsPDF or image files are unavailable.');
    const {jsPDF}=window.jspdf;
    const list=[];
    for(const f of files)list.push(await readImage(f));
    const margin=Number(opts.margin)||0;
    let pdf=null;
    for(let i=0;i<list.length;i++){
      const {img,data,file}=list[i];
      if(opts.onProgress)opts.onProgress(i+1,list.length);
      let orient=opts.orientation||'auto';
      if(orient==='auto')orient=img.width>=img.height?'landscape':'portrait';
      let pageW,pageH;
      if(opts.pageMode==='fit'){
        const pxToMm=0.2645833333;
        pageW=Math.max(20,img.width*pxToMm+margin*2);
        pageH=Math.max(20,img.height*pxToMm+margin*2);
      }else [pageW,pageH]=orient==='landscape'?[297,210]:[210,297];
      if(!pdf)pdf=new jsPDF({orientation:pageW>=pageH?'landscape':'portrait',unit:'mm',format:[pageW,pageH]});
      else pdf.addPage([pageW,pageH],pageW>=pageH?'landscape':'portrait');
      const maxW=pageW-margin*2,maxH=pageH-margin*2,ratio=Math.min(maxW/img.width,maxH/img.height),w=img.width*ratio,h=img.height*ratio,x=(pageW-w)/2,y=(pageH-h)/2,type=file.type==='image/png'?'PNG':'JPEG';
      pdf.addImage(data,type,x,y,w,h,undefined,'FAST');
    }
    pdf.save('images-to-pdf.pdf');
  };
})();
