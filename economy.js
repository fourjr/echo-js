use economy;
use channels;

green = "00FF00";
red = "FF4500";
orange= "FFC800";
blue = "5AADFF";

reserved = ['<@249891250117804032>', Prefix];

work = ["You found $__ on the floor!",
  "Your boss decided to give you a bonus of $__ as you were working hard!",
  "You worked as a chef and earned $__!",
  "You had a successful business proposal and earned $__ from it!"
];

robpos = ["You broke into someone**+**'s house and stole his $__",
  "You rob a random passerby**+** and manage to steal $__!",
  "You saw a bank and seized the opportunity. You earned $__ from the heist!",
  "You hacked Echo and gave yourself $__",
  "You bribed a staff member to add $__ to your account and it worked!"
];

robneg = ["You try to rob a shop but got caught and fined $__",
  "You were caught vandalizing and got fined $__",
  "You hacked into the white house database but got caught. You lose $__",
  "You were caught stealing cookies and got fined $__",
  "You lost a bet against someone**+** and lost $__"
];

function getAccount(mention) {
  if (mention == undefined) {
    return JSON.parse(economy[RawUserID]);
  } else {
    return JSON.parse(economy[UserID]);
  }
}

function getChannel() {
  try {
    channel = JSON.parse(channels[Channel.ID]);
  } catch (e) {
    channel = {
      crime: true,
      work: true,
      bal: true,
      prefix: "?"
    };
    channels[Channel.ID] = JSON.stringify(channel);
  }
  return channel;
}

function getRandomReply(invoked, money, check) {
  if (check == undefined) {
    check = "positive";
  }
  if (check == "negative") {
    arr = robneg;
  } else {
    if (invoked == "crime") {
      arr = robpos;
    } else {
      if (invoked == "work") {
        arr = work;
      }
    }
  }
  return arr[Math.floor(Math.random() * arr.length)].replace("__", money);
}

function refreshAccount(mention) {
  if(mention == undefined){
    ID = RawUserID;
    name = RawUsername;
  } else {
    ID = UserID;
    name = Username;
  } 

  try {
    bank = JSON.parse(economy[ID]);
    bank.name = name
  } catch (e) {
    def = {
      name: name,
      money: 0,
      cooldown: 0
    };
    economy[ID] = JSON.stringify(def);
  }
  return;
}

function checkCooldown() {
  bank = JSON.parse(economy[RawUserID])
  unix = Math.round((new Date()).getTime() / 1000);
  if (bank.cooldown < unix) {
    return false;
  } else {
    d = bank.cooldown - unix;
    h = Math.floor(d / 3600);
    m = Math.floor(d % 3600 / 60);
    s = Math.floor(d % 3600 % 60);
    hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }
}

function startCooldown(time) {
  bank = JSON.parse(economy[RawUserID]);
  unix = Math.round((new Date()).getTime() / 1000);
  bank.cooldown = unix + 60 * 60 * time;
  economy[RawUserID] = JSON.stringify(bank);
  return;
}

function editMoney(tare, value) {
  bank = JSON.parse(economy[RawUserID])
  if (tare === 'positive') {
    bank.money += value;
  } else if (tare === 'negative') {
    bank.money -= value;
  }
  economy[RawUserID] = JSON.stringify(bank);
  return;
}

function checkEnabled(check) {
  channel = getChannel();
  return channel[check];
}

function editEnabled(change) {
  channel = getChannel();
  channel[change] = !channel[change];
  channels[Channel.ID] = JSON.stringify(channel);
  return;
}

function checkPrefix(invoked, pref) {
  if pref == undefined {
    return Content.startsWith(getChannel().prefix + invoked);
  }
  else {
    return Content.startsWith(pref + invoked);
  }
}

function formatEmbed(title, body, color) {
  emb = {};
  emb.title = title;
  emb.description = body;
  emb.color = HTML2Int("#" + color);
  emb.author = {
    name: RawUsername,
    icon_url: "https://cdn.discordapp.com/avatars/" + RawUserID + "/" + JSON.stringify(RawUserImage).replace(/"/g, "") + ".webp?size=1024"
  };
  return emb;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

refreshAccount();