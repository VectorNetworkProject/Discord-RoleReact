'use strict';
require('dotenv').config();

const { bot, roles, reactions } = require('./roles'),
    yourID = process.env.USERID,
    setupCMD = 'vnp!role';
let initialMessage = '**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**\n**役職を貰うためには当てはまるものにリアクションを付けて下さい。役職を外す場合はリアクションを外せば外れます。**';
bot.login(process.env.TOKEN);
require('http').createServer().listen(1919);

if (roles.length !== reactions.length) console.log('Roles list and reactions list are not the same length!');

function generateMessages(){

    let messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`React below to get the **"${role}"** role!\n**${role}**の役職を付ける場合は下のリアクションを追加して下さい。`);
    return messages;

}


bot.on('message', (message) => {

    if (message.author.id === yourID && message.content.toLowerCase() === setupCMD){

        let toSend = generateMessages(),
            mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){

            message.channel.send(mapObj[0]).then( (sent) => {

                if (mapObj[1]){

                    sent.react(mapObj[1]);

                }

            });

        }

    }

});


bot.on('raw', (event) => {

    if (event.t === 'MESSAGE_REACTION_ADD' || event.t === 'MESSAGE_REACTION_REMOVE'){

        let channel = bot.channels.get(event.d.channel_id),
            message = channel.fetchMessage(event.d.message_id).then((msg)=> {

                let user = msg.guild.members.get(event.d.user_id);
                if (msg.author.id === bot.user.id && msg.content !== initialMessage){

                    let re = '\\*\\*"(.+)?(?="\\*\\*)',
                        role = msg.content.match(re)[1];
                    if (user.id !== bot.user.id){

                        let roleObj = msg.guild.roles.find((r) => r.name === role),
                            memberObj = msg.guild.members.get(user.id);

                        if (event.t === 'MESSAGE_REACTION_ADD'){

                            memberObj.addRole(roleObj);

                        } else {

                            memberObj.removeRole(roleObj);

                        }

                    }

                }

            });

    }

});

bot.on('error', (error) => {});
bot.on('reconnecting', () => {});
bot.on('warn', (info) => {});
bot.on('debug', (info) => {});
