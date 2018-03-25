/// <reference path="../typings/globals/jquery/index.d.ts" />

let urlTemplate='https://en.wikipedia.org/w/api.php?action=parse';
let limit;
let counter;
let removeDuplicates;
let set=new Set();


let getSeeAlsoSectionId=(sections) => sections.filter((x)=>x.line=='See also')[0].index;


function getJSON(url){
  return $.getJSON(url,{format:"json"},
    function(data) {        
       return data;
    })
  }


async function scanForSeeAlso(sectionName){
  if(limit!=-1 && counter>=limit)
      return;

  sectionName=sectionName.replace(' ','_');

  let url=urlTemplate+'&prop=sections&page='+sectionName;
  let json=await getJSON(url);
  let sectionId=getSeeAlsoSectionId(json.parse.sections);

  let seeAlsoSectionUrl=urlTemplate+'&prop=links&page='+sectionName+'&section='+sectionId;
  let seeAlsoSectionJSON= await getJSON(seeAlsoSectionUrl);
  let sectionNames=seeAlsoSectionJSON.parse.links
      .map(x=>x['*'])
      .filter(x=>!x.includes(':'));

  sectionNames.forEach(nextSection => {
    if((limit!=-1 && counter>=limit))
        return;

    if(removeDuplicates && set.has(nextSection))
        return;
    
    set.add(nextSection);
    $('#result').append('<li>'+nextSection+'</li>'); 
    counter++;

    scanForSeeAlso(nextSection); 
  });
}

function startCrawling(article,remove,max){
  limit=max==""?-1:parseInt(max);
  counter=0;
  removeDuplicates=remove;
  scanForSeeAlso(article);    
}