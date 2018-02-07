use economy;
use channels;

green = "00FF00";
red = "FF4500";
orange = "FFC800";
blue = "5AADFF";

reserved = ["<@249891250117804032>", "."];

work = ["You found $__ on the floor!", "Your boss decided to give you a bonus of $__ as you were working hard!", "You worked as a chef and earned $__!", "You had a successful business proposal and earned $__ from it!"];

robpos = ["You broke into someone's house and stole his $__", "You rob a random passerby and manage to steal $__!", "You saw a account and seized the opportunity. You earned $__ from the heist!", "You hacked Echo and gave yourself $__", "You bribed a staff member to add $__ to your account and it worked!"];

robneg = ["You try to rob a shop but got caught and fined $__", "You were caught vandalizing and got fined $__", "You hacked into the white house database but got caught. You lose $__", "You were caught stealing cookies and got fined $__", "You lost a bet against someone and lost $__"];

helpMessage = "```md\n\
Important Notes:\n\
-----------------------------------\n\
The prefix can be changed, and is default set to ?, you may refer to on instructions about how to change it.\n\
\n\
Accounts for users are automatically created once they do any command in the system.\n\
\n\
There is a 4 hour global cooldown after a user does any command in the next category.\n\
\n\
Ways to Earn Money:\n\
-----------------------------------\n\
//Replace [p] with your set prefix (default to ?)\
\n\
[p]crime\n\
There's an extremely high chance your heist would succeed, yet the police still pose a threat!\
\n\
[p]work\n\
Working hard never goes wrong! Instant money in the pocket!\n\
\n\
Other money related commands\n\
-----------------------------------\n\
//These don't have a set cooldown!\n\
\n\
[p]bal\n\
Shows the whole world how rich or poor you are\n\
\n\
[p]leaderboard\n\
Are you the biggest millionaire in the whole of discord? Find out here.\n\
\n\
Miscellaneous Commands\n\
-----------------------------------\n\
//All settings are channel based, this means that you can have different prefixes per channels you lock this intralink to, or even different commands enabled per channel.\n\
\n\
[p]prefix \n\
• Requires Manage Server permission\n\
Hate the default prefix as the question mark? Change it using this command.\n\
Note: Some prefixes are protected, for example, the prefix you set Echo to, and some others. It will return an error message.\n\
\n\
[p]toggle \n\
• Requires Manage Server permission\n\
If you want your whole server to work hard to earn money, disable crime!\n\
Note: Some commands are protected, and will return an error message if you try to toggle them.\n\
\n\
[p]help\n\
Shows this rather long message that contains a ton of information you most likely won't read but will need\n\
\n\
Help! I broke something! I found a bug! I forgot my prefix! I have suggestions!\n\
-----------------------------------\n\
Drop me a DM, 4JR#2713, if you need a mutual server, join Echo's official server.\n\
\n\
https://discord.gg/7JMJjGk\n\
```"

//startsWith
if(!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

//Array.includes
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if(!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            if(this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if(len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while(k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if(sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

function getAccount(user) {
    if(user == undefined) {
        username = RawUsername
        user = RawUserID
    } else {
        username = undefined
        for(i in Server.Members) {
            if(Server.Members[i].User.ID == user) {
                username = Server.Members[i].User.Username
            }
        }
        if(username == undefined) {
            throw new ReferenceError("Invalid user passed into refreshAccount")
        }
    }

    if(!economy.hasOwnProperty(user)) {
        def = {
            name: username,
            money: 0,
            cooldown: 0
        }
        economy[user] = JSON.stringify(def)
        return def
    }
    return JSON.parse(economy[user])
}

function getChannel(id) {
    guildChanID = [];
    if(id == undefined) {
        for(i = 0; i < Server.Channels; i++) {
            guildChanID.push(Server.Channels[i].ID);
        }
        id = Channel.ID;
    }
    if(channels.hasOwnProperty(id)) {
        channel = JSON.parse(channels[id]);
        channel.name = Channel.Name;
    } else {
        if(guildChanID.includes(channels[id])) {
            return getChannel(channels[Channel.ID]);
        }
        channel = {
            crime: true,
            work: true,
            bal: true,
            prefix: "?",
            name: Channel.Name
        }
    }
    channels[Channel.ID] = JSON.stringify(channel);
    return channel;
}

function getRandomReply(invoked, money, check) {
    if(check == undefined) {
        check = "positive";
    }
    if(check == "negative") {
        arr = robneg;
    } else {
        if(invoked == "crime") {
            arr = robpos;
        } else {
            if(invoked == "work") {
                arr = work;
            }
        }
    }
    return arr[Math.floor(Math.random() * arr.length)].replace("__", String(money));
}

function getGuildMemID() {
    list = [];
    for(i in Server.Members) {
        list.push(Server.Members[i].User.ID);
    }
    return list;
}

function refreshAccount(user) {
    if(user == undefined) {
        ID = RawUserID;
        name = RawUsername;
    } else {
        username = undefined
        for(i in Server.Members) {
            if(Server.Members[i].User.ID == user) {
                username = Server.Members[i].User.Username
            }
        }
        if(username == undefined) {
            throw new ReferenceError("Invalid user passed into refreshAccount")
        }
        ID = user
        name = username
    }

    if(economy.hasOwnProperty(ID)) {
        account = JSON.parse(economy[ID]);
        account.name = name
    } else {
        account = {
            name: name,
            money: 0,
            cooldown: 0
        }
    }
    economy[ID] = JSON.stringify(account)
    return;
}

function checkCooldown() {
    account = JSON.parse(economy[RawUserID]);
    unix = Math.round((new Date()).getTime() / 1000);
    if(account.cooldown < unix) {
        return false;
    } else {
        d = account.cooldown - unix;
        h = Math.floor(d / 3600);
        m = Math.floor(d % 3600 / 60);
        s = Math.floor(d % 3600 % 60);
        hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        Display = hDisplay + mDisplay + sDisplay;
        return Display.replace(new RegExp(",([^\,]*)$"), " and$1");
    }
}

function startCooldown(time) {
    account = JSON.parse(economy[RawUserID]);
    unix = Math.round((new Date()).getTime() / 1000);
    account.cooldown = unix + 60 * 60 * time;
    economy[RawUserID] = JSON.stringify(account);
    return;
}

function editMoney(tare, value) {
    account = JSON.parse(economy[RawUserID])
    if(tare === 'positive') {
        account.money += value;
    } else
    if(tare === 'negative') {
        account.money -= value;
    }
    economy[RawUserID] = JSON.stringify(account);
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
    if(invoked == "?prefix"){
        return checkPrefix(invoked.replace("?", ""), "?")
    }
    if(pref == undefined) {
        pref = getChannel().prefix
    }
    Params = Params.replace(pref, "") 
    return HasPrefix(Content, pref + invoked);
}

function getIcon(id) {
    if(Channel.Type == 1) {
        return "https://cdn.discordapp.com/avatars/" + id + "/" + UserImage + ".png";
    }
    var text = [];
    for(i = 0; i < ServerMembers.length; i++) {
        if(ServerMembers[i].User.ID === id) {
            text.push(ServerMembers[i].User.Avatar);
        }
    }
    if(text.length !== 0) {
        var hash = text[0]
        return "https://cdn.discordapp.com/avatars/" + id + "/" + hash + ".png";
    } else {
        throw new ReferenceError(id + " not found in guild");
    }
}

function formatEmbed(title, body, color, footer_obj) {
    emb = {};
    emb.title = title;
    emb.description = body;
    emb.color = HTML2Int("#" + color);
    emb.author = {
        name: RawUsername,
        icon_url: getIcon(RawUserID)
    };
    emb.footer = footer_obj;
    return emb;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isStaff(UID) {
    if(UID == undefined) {
        UID = RawUserID;
    }
    addr = Address();
    if(addr.OwnerID == UID) {
        return true;
    }
    for(i = 0; i < addr.Staff.length; i++) {
        if(addr.Staff[i] == UID) {
            return true;
        }
    }
    return false;
}

String.prototype.isInteger = function() {
    return /^\d+$/.test(this);
}

function userToObject(obj) {
    //Given an ID or name, return a list of [ID, economy status]
    if(obj == "<@" + UserID + ">") {
        //There is a mention
        if(economy.hasOwnProperty(UserID)) {
            return [UserID, economy[UserID]];
        } else {
            return undefined
        }
    }
    options = []
    len = 0
    for(i in economy) {
        len += 1
        account = JSON.parse(economy[i]);
        if(i == obj) {
            options.push([i, account]) 
        }
        if(account.name.startsWith(obj)) {
            options.push([i, account]) 
        }
    }
    if(options.length == 1) {
        return options[0];
    }
    if(options.length == 0 || options.length == len) {
        return undefined;
    }
    return options;
}

refreshAccount();

trigger = Trigger.replace("&", "").replace(" {params}", "")
if(checkPrefix(trigger)){