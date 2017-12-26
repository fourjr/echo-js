use users;

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

refreshAccount() 