// PDF Merge browser module
// Next step: connect pdf-lib for client-side merging.
(function(){
  window.mergePDFs = function(files){
    if(!files || files.length < 2){
      return;
    }
    console.log('PDF merge request:', files.length, 'files');
  };
})();
