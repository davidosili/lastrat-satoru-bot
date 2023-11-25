const {hidePrivateData} =require('./utils.js');
const { writeFile } = require("fs/promises");
//const sharp = require('sharp');
const { AnimeWallpaper, AnimeSource } = require('anime-wallpaper');
const wallpaper = new AnimeWallpaper();
const { Hercai } = require('hercai');
const herc = new Hercai();
const keep_alive = require('./keep_alive.js');

//tiktok api
const { TiktokDL } = require("@tobyg74/tiktok-api-dl");

//youtube api
const { facebook } = require("fy-downloader");
const { youtube } = require("fy-downloader");
const ytstream = require('yt-stream');
const fs = require('fs');

//sticker api
//const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
//const chatgpt = require('chatgpt-npm');
const { DisconnectReason, useMultiFileAuthState, downloadMediaMessage, updateProfilePicture } = require("@whiskeysockets/baileys");
//import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

const makeWASocket = require("@whiskeysockets/baileys").default;


async function connectionLogic(){
  try{

  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
    auth: state
});
const store = {};
const getText = (message) => {
  try{
    return (message.conversation) || (message.extendedTextMessage.text);
  }catch {
    return "";
  }
};

const sendMessage = async (jid,content, ...args) =>{
  try{
    const sent= await sock.sendMessage(jid, content, ...args);
    store[sent.key.id] = sent;
  } catch(err){
    console.log("Error sending msg:", err);
  }
};

const handleMirror = async (msg)=>{
const {key,message} = msg;
const text = getText(message);

const prefix = "!mirror";

if(!text.startsWith(prefix)) return;

  const reply = text.slice(prefix.length);

  sendMessage(key.remoteJid, {text: reply}, {quoted : msg});
};

function stringToNumberArray(inputString,suffix) {
  // Split the input string by comma to obtain an array of strings
  var numbersStringArray = inputString.split(',');
      return numbersStringArray.map(function(element) {
        return element + suffix;
      });

}


const handleAll = async (msg) => {
  try{
  var messageType=null;
  if(msg.message){
     messageType = Object.keys (msg.message)[0];// get what type of message it is -- text, image, video
  }
  const {key, message, pushName} = msg;
  const text = getText(message);
  


  //@ALL @All @all
  if(text.toLowerCase().startsWith('#add')){
    const prefix = "#add";
    const value = text.slice(prefix.length);
    const list = stringToNumberArray(value.trim(),"@s.whatsapp.net");
    try{
      const response = await sock.groupParticipantsUpdate(
        key.remoteJid, 
        list,
        "add" // replace this parameter with "remove", "demote" or "promote"
    );
    }catch {
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #add 237690124021,241690237310' }, {quoted: msg});
    }
  }
  //Menu button
  else if(text.toLowerCase()=="#menu"){
    sendMessage(key.remoteJid,{text:
      ' ( ͡❛ ͜ʖ ͡❛)\n\nOhayoo ' + pushName + ' senpai \n\nLa pignouf >>>> Fap Fap.\n\nJe suis *Lastrat Satoru*, un robot developer par lastrategie\n\nMon prefixes est le #.\nVoici la liste de mes commandes.\n' + 
      '|--------- ✤ GROUP ✤ --------\n'+
      '|▻ 🔰#add\n'+
      '|▻ 🔰#kick\n'+
      '|▻ 🔰#promote\n'+
      '|▻ 🔰#demote\n'+
      '|▻ 🔰#setdesc\n'+
      '|▻ 🔰#setppgc\n'+
      '|▻ 🔰#setsub\n'+
      '|▻ 🔰#gpmsg\n'+
      '|▻ 🔰#gpsetting\n'+
      '|▻ 🔰#outgp\n'+
      '|▻ 🔰#gplink\n'+
      '|▻ 🔰#gprevoke\n'+
      '|▻ 🔰#join\n'+
      '|▻ 🔰#gpinfo\n'+
      '|▻ 🔰#all\n'+
      '|▻ 🔰#Vos Q\n' +
      '|--------- ✤ OTHER ✤ --------\n'+
      '|▻ 🔰#meme\n'+
      '|▻ 🔰#sticker\n' +
      '|▻ 🔰#animewall\n'+
      '|▻ 🔰#ask\n'+
      '|--------- ✤ DOWNLOAD ✤ --------\n'+
      '|▻ 🔰#yt\n'+
      '|▻ 🔰#fb\n'+
      '|▻ 🔰#tk\n'+
      '|▻ 🔰#instagram\n'+
      '|▻ 🔰#ytsearch\n'},
        {quoted: msg});
  }
  /*else if(text.toLowerCase().startsWith('#kick')){
    const prefix = "#kick";
    const value = text.slice(prefix.length);
    const list = stringToNumberArray(value.trim(),"@s.whatsapp.net");
    try{
      const response = await sock.groupParticipantsUpdate(
        key.remoteJid, 
        list,
        "remove" // replace this parameter with "remove", "demote" or "promote"
    );
    }catch {
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #kick 237690124021,241690237310' }, {quoted: msg});
    }
  }*/
  else if(text.toLowerCase().startsWith('#promote')){
    const prefix = "#promote";
    const value = text.slice(prefix.length);
    const list = stringToNumberArray(value.trim(),"@s.whatsapp.net");
    try{
      const response = await sock.groupParticipantsUpdate(
        key.remoteJid, 
        list,
        "promote" // replace this parameter with "remove", "demote" or "promote"
    );
    }catch {
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #promote 237690124021,241690237310' }, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#demote')){
    const prefix = "#demote";
    const value = text.slice(prefix.length);
    const list = stringToNumberArray(value.trim(),"@s.whatsapp.net");
    try{
      const response = await sock.groupParticipantsUpdate(
        key.remoteJid, 
        list,
        "demote" // replace this parameter with "remove", "demote" or "promote"
    );
    }catch {
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #demote 237690124021,241690237310'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#setdesc')){
    const prefix = "#setdesc";
    const value = text.slice(prefix.length);
    try{await sock.groupUpdateDescription(key.remoteJid, value.trim());
    }catch{
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #setdesc <<group description here>>'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#setsub')){
    const prefix = "#setsub";
    const value = text.slice(prefix.length);
    try{await sock.groupUpdateSubject(key.remoteJid, value.trim());
    }catch{
      sendMessage(key.remoteJid,{text: '*Enter correctly the format*\n example: #setsub <<group subject here>>'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#gpmsg')){
    const prefix = "#gpmsg";
    const value = text.slice(prefix.length);
    if(value.includes('on')){
      // allow everyone to send messages
      await sock.groupSettingUpdate(key.remoteJid, 'not_announcement')
    }
    else if(value.includes('off')){
      await sock.groupSettingUpdate(key.remoteJid, 'announcement')
    }
    else if(value.includes('')){
      sendMessage(key.remoteJid,{text: '*on or off the group message*'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#gpsetting')){
    const prefix = "#gpsetting";
    const value = text.slice(prefix.length);
    if(value.includes('on')){
      // only allow admins to modify the group's settings
      await sock.groupSettingUpdate(key.remoteJid, 'locked')
    }
    else if(value.includes('off')){
      // allow everyone to modify the group's settings -- like display picture etc.
      await sock.groupSettingUpdate(key.remoteJid, 'unlocked')
    }
    else if(value.includes('')){
      sendMessage(key.remoteJid,{text: '*on or off the setting*'}, {quoted: msg});
    }
  }
  /*else if(text.toLowerCase()=='#outgp'){
    await sock.groupLeave(key.remoteJid) // (will throw error if it fails)
  }*/
  else if(text.toLowerCase()=="#gplink"){
    const code = await sock.groupInviteCode(key.remoteJid);
    sendMessage(key.remoteJid,{text: 'https://chat.whatsapp.com/'+code}, {quoted: msg});
  }
  else if(text.toLowerCase()=="#gprevoke"){
    const code = await sock.groupRevokeInvite(key.remoteJid);
  }
  else if(text.toLowerCase().startsWith('#join')){
    var prefix = "#join";
    const value = text.slice(prefix.length);
    prefix = 'https://chat.whatsapp.com/ ';
    const value2 = value.slice(prefix.length);
    try{
    const response = await sock.groupAcceptInvite(value2.trim());
    sendMessage(key.remoteJid,{text: 'Joined to ' + response}, {quoted: msg});
    }catch{
      sendMessage(key.remoteJid,{text:'*use #join <<group invitation link>>*'}, {quoted: msg});
    }
  }
  else if(text.toLowerCase().startsWith('#gpinfo')){
    var prefix = "#gpinfo";
    const value = text.slice(prefix.length);
    prefix = 'https://chat.whatsapp.com/ ';
    const value2 = value.slice(prefix.length);
    try{
      const response = await sock.groupGetInviteInfo(value2.trim());
      sendMessage(key.remoteJid,{text: 'Title: ' + response.subject + '\n' +
      'Creation: ' + response.creation + '\n' +
      'Owner: ' + response.owner + '\n' +
      'desc: ' + response.desc + '\n'}, {quoted: msg});
    }catch{
      sendMessage(key.remoteJid,{text:'*use #gpinfo <<group invitation link>>*'}, {quoted: msg});
    }
  }
  else if(messageType === 'imageMessage' && message.imageMessage.caption=='#setppgc'){
    try{
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        { },
        {
                // pass this so that baileys can request a reupload of media
                // that has been deleted
                reuploadRequest: sock.updateMediaMessage
        }
    );
    // save to file
    await writeFile('./media/profile.png', buffer);
    let originalImage = './media/profile.png';
    let outputImage= './media/finale.png'
    //sharp(originalImage).extract({ width: 250, height: 250, left: 0, top: 0 }).toFile(outputImage)
    /*.then(function(new_file_info) {
        console.log("Image cropped and saved");
    })*/
    await sock.updateProfilePicture(key.remoteJid, { url: './media/profile.png' });
    }catch(error){
      //sendMessage(key.remoteJid,{text:'*Send image with #setppgc as legend*'}, {quoted: msg});
      sendMessage(key.remoteJid,{text:'*Something when wrong:* ' + error}, {quoted: msg});
    }
  }
  //Meme Generation function
  else if(text.toLowerCase()=='#animewall'){
      const anime = await wallpaper.random();
      anime.forEach(async(manga)=>{
        try{
        const buttonMessage = {
          image: {url: manga.image},
          caption: manga.title
      }
      
      const sendMsg = await sock.sendMessage(key.remoteJid, buttonMessage);
        }catch(err){
          console.log(err);
        }
      });
  }
  else if(text.toLowerCase().startsWith('#animewall')){
    var prefix = "#animewall";
    const value = text.slice(prefix.length);
    var i=0;
    try{
      const anime = await wallpaper.search({ title: value }, AnimeSource.Wallpapers);
      for(i=0;i<5;i++){
    //anime.forEach(async(manga)=>{
      const buttonMessage = {
        image: {url: anime[i].image},
        caption: anime[i].title
    }
      await sock.sendMessage(key.remoteJid, buttonMessage);
  }
   // });
    } catch(error){
      await sock.sendMessage(key.remoteJid, {text: "*No result found*"});
    }
    
  }
  else if(text.toLowerCase().startsWith('#ytmp4')){
    prefix = '#ytmp4';
    const value = text.slice(prefix.length);
    (async () => {
      try{
      const stream = await ytstream.stream(value.trim(), {
          quality: 'high',
          type: 'audio',
          highWaterMark: 1048576 * 32
      });
      //stream.stream.pipe(fs.createWriteStream('some_song.mp3'));
      //console.log(stream.video_url);
      console.log(stream.url);
      await sock.sendMessage(
        key.remoteJid, 
        {
          audio: {url:stream.url},
          //caption: 'New Video!!!! \n *Generated by Lastrat Satoru*'
        },
        {quoted:msg}
    );
      }catch(err){
        console.log(err);
      }
  })();
  }
  else if(text.toLowerCase().startsWith('#ask')){
    prefix = '#ask';
    const value = text.slice(prefix.length);
    herc.question({model:"v2",content: value}).then( async (response) => {
      try{
     await sock.sendMessage(key.remoteJid, {text: response.reply}, {quoted: msg});
      }catch(error){
        await sock.sendMessage(key.remoteJid, {text: 'Send back your message without tagging Error:'+error});
      }
      });
  }
  else if(text.toLowerCase().startsWith('#fb')){
    prefix = '#fb';
    const value = text.slice(prefix.length);
    const link = value.trim();
    const big = facebook(link, async(err, data) => {
      try{
    if(err != null){
        console.log(err);
    } else {
      await sock.sendMessage(
        key.remoteJid, 
        {
          video: {url:data.download.mp4},
          caption: 'New Video!!!! : *' + data.title + '*\n Generated by Lastrat Satoru',
          jpegThumbnail: data.vid.jpegThumbnail
        },
        {quoted:msg}
    );
    }
      }catch(err){
        console.log(err);
      }
    });
  }
  else if(text.toLowerCase().startsWith('#tk')){
    prefix = '#tk';
    const value = text.slice(prefix.length);
    try{
      const tiktok_url = value.trim();

      TiktokDL(tiktok_url, {
        version: "v1" //  version: "v1" | "v2" | "v3"
      }).then(async(result) => {
        try{
        //console.log(result.result.coverThumb);

        const buttonMessage = {
          video: {url: result.result.video},
          caption: 'New Video!!!! :' + result.result.description + '\n Generated by Lastrat Satoru',
          jpegThumbnail: result.result.coverThumb
      }
        await sock.sendMessage(
          key.remoteJid, 
          buttonMessage
      )
        console.log(result.result.video);
          }catch(error){
            console.log(error);
          }
      });
    }catch(error){
      console.log(error);
    }
  }
  else if(messageType === 'imageMessage' && message.imageMessage.caption=='#sticker'){
    try{
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        { },
        {
                // pass this so that baileys can request a reupload of media
                // that has been deleted
                reuploadRequest: sock.updateMediaMessage
        }
    );
    await writeFile('./media/sticker.webp', buffer);
    let originalImage = './media/sticker.png';
    let outputImage= './media/finale.png'
    /*(originalImage).extract({ width: 250, height: 250, left: 0, top: 0 }).toFile(outputImage)
    .then(function(new_file_info) {
        console.log("Image cropped and saved");
    });*/
    const sticker = new Sticker(buffer, {
    pack: 'Ryouki tenkai', // The pack name
    author: 'Lastrat Satoru', // The author name
    type: StickerTypes.DEFAULT , // The sticker type
    categories: ['🤩', '🎉'], // The sticker category
    id: 'gkio0', // The sticker id
    quality: 50, // The quality of the output file
    background: '#000000' // The sticker background color (only for full stickers)
      });
    const buffer2 = await sticker.toBuffer();
    await sticker.toFile('./sticker.webp');
    await writeFile('./sticker.webp', buffer2);


    }catch(error){

    }
  }
  else if(!text.toLowerCase().includes('#all')) return;

  else if(text.toLowerCase().startsWith('#all')){
  // 1. get all group members
    const group = await sock.groupMetadata(key.remoteJid);
    const members = group.participants;

    const mentions = [];
    const items = [];

    members.forEach(({id,admin})=>{
      mentions.push(id);
      items.push(`@${id.slice(0, 12)}${admin ? ' 👑 GOAT': ''}`);
      //console.log('id',hidePrivateData(id));
    });

  //2.tag them and reply
  sendMessage(key.remoteJid,{text: '[Message: Regardez le message taguer!!!]' + '\n' + items.join("\n"),
  mentions }, {quoted: msg});
  }
}catch(err){
  console.log(err);
}

}

sock.ev.on("connection.update",async (update)=>{
  try{
  const {connection,lastDisconnect,qr}=update || {};

  if(qr){
    console.log(qr);
    //write custom logic over here
  }

  if(connection==='close'){
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

    if(shouldReconnect){
      connectionLogic();
    }
  }
}catch(error){
  console.log(error);
}
});

/*sock.ev.on("messages.update", async(messageInfo)=>{
 // console.log(messageInfo);
});*/

sock.ev.on("messages.upsert",async(messageInfoUpsert)=>{
  try{
  messageInfoUpsert.messages.forEach((msg)=>{
    //if(!message.message) return;
    //console.log(message.message.conversation) || console.log(message.message.extendedTextMessage.text);
    //if(message.message.imageMessage!=null){
    // console.log(msg);
    //}
   
    //handleMirror(message);
    handleAll(msg);
  });
    


 // const id = '237671624397@s.whatsapp.net' // the WhatsApp ID 
  //const test = '237659130549-1619032991@g.us' //the Group ID
  //const gg = '120363198766572654@g.us' //group 2

//handleMirror(messageInfoUpsert);
}catch(err){
  console.log(err);
}
});


sock.ev.on ('creds.update', saveCreds);
  }catch(err){
    console.log(err);
  }
}


connectionLogic();

