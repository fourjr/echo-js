use users;
use channels;
use choices;

function refreshAccount(){
try {
  u = JSON.parse(users[RawUserID]);
  u.name = RawUsername;
  users[RawUserID] = JSON.stringify(u);
} catch (e) {
  def = {name: RawUsername, lives: [], ongoingGame: false};
  users[RawUserID] = JSON.stringify(def);
}
return;
}

function getAccount(){
  return JSON.parse(users[RawUserID]);
}


function choiceConfirm(mode, selection){
cc = {gender:
  {default: "You have picked the __ gender.", 1: "male", 2: "female"}
}
//try {
  return "x" + mode + "x";
//} catch (e) {
  //throw new ReferenceError("Invalid mode in choiceConfirm");
//} 
} 

refreshAccount() 