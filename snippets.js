//Description: Get a variable value from a variable name. This would mean the variable name can be a variable itself 
//Usage: getVar(variable name) 

function getVar (obj) { 
  for(var key in this) { 
    if(obj === key){
     return this[key]; 
   } 
 } 
  return undefined;
} 