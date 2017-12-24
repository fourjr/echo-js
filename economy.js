green = "00FF00";
red = "FF4500";
orange = "5AADFF";

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
    d =  bank.cooldown - unix;
h = Math.floor(d / 3600); 
m = Math.floor(d % 3600 / 60); 
s = Math.floor(d % 3600 % 60); 
hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""; 
mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""; 
sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""; 
return hDisplay + mDisplay + sDisplay;
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

function random(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

work = ["You found $__ on the floor!",
"Your boss decided to give you a bonus of $__ as you were working hard!",
"You worked as a chef and earned $__!",
"You had a successful business proposal and earned $__ from it!"];

robpos = ["You broke into someone**+**'s house and stole his $__",
"You rob a random passerby**+** and manage to steal $__!",
"You saw a bank and seized the opportunity. You earned $__ from the heist!",
"You hacked Echo and gave yourself $__",
"You bribed a staff member to add $__ to your account and it worked!"];

robneg = ["You try to rob a shop but got caught and fined $__",
"You were caught vandalizing and got fined $__,
"You hacked into the white house database but got caught. You lose $__",
"You were caught stealing cookies and got fined $__", 
"You lost a bet against someone**+** and lost $__"];

function getRandomReply(invoked, money, check="positive"){
  if(check == "negative"){
    arr = robneg;
  }
  else {
    if(invoked == "crime"){
      arr = robpos;
    } 
    else {
      if(invoked == "work"){
        arr = work;
      }
   }
  return arr[Math.floor(Math.random() * array.length)].replace("__", money);
}