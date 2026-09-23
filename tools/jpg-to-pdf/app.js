// JPG to PDF browser converter
// Uses jsPDF loaded on the page for local conversion.
(function(){
  window.convertImagesToPDF = function(files){
    if(!window.jspdf || !files || !files.length){
      return null;
    }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let pending = files.length;

    files.forEach((file,index)=>{
      const reader = new FileReader();
      reader.onload = function(e){
        const img = new Image();
        img.onload = function(){
          if(index > 0) pdf.addPage();
          const ratio = Math.min(190 / img.width, 270 / img.height);
          const w = img.width * ratio;
          const h = img.height * ratio;
          pdf.addImage(img, 'JPEG', 10, 10, w, h);
          pending--;
          if(pending === 0){
            pdf.save('images-to-pdf.pdf');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
})();
