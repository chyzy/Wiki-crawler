function start(){
    let article=$('#article').val();
    let removeDuplicates=$('#duplicateCheck').prop('checked');
    let max=$('#max').val();
    
    $('#result').html("");
    startCrawling(article,removeDuplicates,max);   
}

