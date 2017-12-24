function refreshAccount(){
  try{
    bank = JSON.parse(economy[UserID]);
    bank.name = Username;
  } catch (e) {
    def = {name:Username, money:0, cooldown:0};
    economy[UserID] = JSON.stringify(def);
  }
  return;
}

function checkCooldown(){
  bank = JSON.parse(economy[UserID])
  unix = Math.round((new Date()).getTime() / 1000);
  if(bank.cooldown < unix){
    return false;
  }
  else {
    return true;
  }
}

function startCooldown(time){
  bank = JSON.parse(economy[UserID]);
  unix = Math.round((new Date()).getTime() / 1000);
  bank.cooldown = unix + 60*60*time;
  economy[UserID] = JSON.stringify(bank);
  return;
}

function editMoney(tare, value){
  bank = JSON.parse(economy[UserID]) 
  if(tare === 'positive'){
    bank.money += value;
  }
  else if(tare === 'negative'){
    bank.money -= value;
  }
  economy[UserID] = JSON.stringify(bank);
  return;
} 

function getAccount(){
  return JSON.parse(economy[UserID]);
}

function formatEmbed(title, body, color){
  emb = {};
  emb.title = title;
  emb.description = body;
  emb.color = HTML2Int("#" + color);
  emb.author = {name:Username, icon_url: "https://cdn.discordapp.com/avatars/" + UserID + "/" + JSON.stringify(UserImage).replace(/"/g, "") + ".webp?size=1024"};
  return emb;
}

function checkEnabled(check){
  try {
    guild = JSON.parse(guilds[Server.ID]);
  } 
  catch (e) {
    guild = {crime: true, work: true, bal: true};
    guilds[Server.ID] = JSON.stringify(guild);
  }
  return guild[check];
} 
function editEnabled(change){
  try {
    guild = JSON.parse(guilds[Server.ID]);
  }
  catch (e) {
    guild = {crime: true, work: true, bal:true};
  }
  guild[change] = !guild[change];
  guilds[Server.ID] = JSON.stringify(guild);
  return;
} 