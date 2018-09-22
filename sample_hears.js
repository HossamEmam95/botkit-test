/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

var wordfilter = require('wordfilter');

module.exports = function(controller) {

    /* Collect some very simple runtime stats for use in the uptime/debug command */
    var stats = {
        triggers: 0,
        convos: 0,
    }

    controller.on('heard_trigger', function() {
        stats.triggers++;
    });

    controller.on('conversationStarted', function() {
        stats.convos++;
    });


    controller.hears(['^uptime','^debug'], 'message_received', function(bot, message) {

        bot.createConversation(message, function(err, convo) {
            if (!err) {
                convo.setVar('uptime', formatUptime(process.uptime()));
                convo.setVar('convos', stats.convos);
                convo.setVar('triggers', stats.triggers);

                convo.say('My main process has been online for {{vars.uptime}}. Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.');
                convo.activate();
            }
        });

    });
      var express = require('express'),
      bodyParser = require('body-parser'),
      pg = require('pg'),
      app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
   app.use(bodyParser.json());  const EventEmitter = require('events');
   class MyEmitter extends EventEmitter { }
   const myEmitter = new MyEmitter();
  app.use('/lhc', function (req, res, next) {
   console.log("yes");
   myEmitter.emit('event', req.body.msg, 'Club');
   res.send({ 'test': 'test' });
 });

  app.use('/test', function (req, res, next) {

   res.send({ 'test': 'test' });
 });


    var AWS = require("aws-sdk");
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        // Provide your Pool Id here
        IdentityPoolId: 'us-east-1:fdaf0f00-9937-4be9-bf1e-aad8609fd91c',
    });
    var counter = 0;
    var userTemp = {};
    var lexruntime = new AWS.LexRuntime();
    var sessionAttributes = {};

    controller.hears(['.*'], 'message_received', function(bot, message) {
      if(message){
        // console.log(message)

        var lexUserId = 'chatbot-facebook' +  message.sender.id;
        if (lexUserId in userTemp) {
          console.log("FOUND");
          if (userTemp[lexUserId]) {
            sessionAttributes.leadEmail = userTemp[lexUserId]["Email"];
            console.log("inside found", sessionAttributes);
          }
        }
        else {
          console.log("NOT FOUND");
          console.log("Inside Not Found", sessionAttributes);
          sessionAttributes.leadEmail = null;
          userTemp[lexUserId] = {};
          userTemp[lexUserId]["Email"] = null;
          userTemp[lexUserId]["Channel"] = "Enzo";
        }
        console.log(userTemp);
        if (userTemp[lexUserId]["Channel"] == "Enzo")
        {
        var params = {
            botAlias: '$LATEST',
            botName: 'Enzo',
            inputText: message.text,
            userId: lexUserId,
            sessionAttributes: sessionAttributes
        };
        lexruntime.postText(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            }
            if (data) {
                // capture the sessionAttributes for the next cycle
                sessionAttributes = data.sessionAttributes;
                if (sessionAttributes.leadEmail) {
                    userTemp[lexUserId]["Email"] = sessionAttributes.leadEmail;
                }
              if(data.message.includes("can you please repeat that")){
                userTemp[lexUserId]["Channel"] = "LHC";
              }
                // show response and/or error/dialog status
                bot.reply(message, data.message);
              if ("responseCard" in data){
                var x = card_format(data);
                console.log(x);
              console.log("cards test: ", cards_to_text(data));
                console.log("------------------------");
              bot.reply(message, x.message);}
              console.log(JSON.stringify(data));
            }

            });

      }
         else
      {
        myEmitter.on('event', function (a, b) {
       // console.log(a, b, this);

       bot.reply(message, '' + a);
     });
      }
      }

    });


    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* Utility function to format uptime */
    function formatUptime(uptime) {
        var unit = 'second';
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'minute';
        }
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'hour';
        }
        if (uptime != 1) {
            unit = unit + 's';
        }

        uptime = parseInt(uptime) + ' ' + unit;
        return uptime;
    }

};

// function for facebook formating

function card_format(message) {
  var cards = {"message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[]
      }
    }
  }
}
  var card = 0;
  for (card in message.responseCard.genericAttachments){
    // console.log("card: ", message.responseCard.genericAttachments[card]);
    var c = {
      'title': message.responseCard.genericAttachments[card].title,
      'subtitle': message.responseCard.genericAttachments[card].subTitle,
      'image_url': message.responseCard.genericAttachments[card].imageUrl,
      "default_action": {
        "type": "web_url",
        "url": message.responseCard.genericAttachments[card].attachmentLinkUrl,
        "webview_height_ratio": "tall"
      },
    };
    if (JSON.stringify(c.image_url) == "null" || JSON.stringify(c.image_url) == "None")
    {
      c.image_url = "https://1.bp.blogspot.com/-dfEJBx-NRmc/Tg61NU7ABkI/AAAAAAAAAbg/b7e7FDAJtUE/s400/maybach_landaulet.jpg";
    }
    if (JSON.stringify(c.default_action.url) == "null" || JSON.stringify(c.default_action.url) == "None")
    {
      c.default_action.url = "https://1.bp.blogspot.com/-dfEJBx-NRmc/Tg61NU7ABkI/AAAAAAAAAbg/b7e7FDAJtUE/s400/maybach_landaulet.jpg";
    }
    // console.log("C", c);
    cards.message.attachment.payload.elements.push(c);
  }
  return cards;
};


function cards_to_text(message){
  var cards_string  = "";

  var card = 0;
  for (card in message.responseCard.genericAttachments){
    // console.log("card: ", message.responseCard.genericAttachments[card]);
    var c = {
      'title': message.responseCard.genericAttachments[card].title,
      'subtitle': message.responseCard.genericAttachments[card].subTitle,
      'image_url': message.responseCard.genericAttachments[card].imageUrl,
      "default_action": {
        "type": "web_url",
        "url": message.responseCard.genericAttachments[card].attachmentLinkUrl,
        "webview_height_ratio": "tall"
      },
    };
    if (JSON.stringify(c.image_url) == "null" || JSON.stringify(c.image_url) == "None")
    {
      c.image_url = "https://1.bp.blogspot.com/-dfEJBx-NRmc/Tg61NU7ABkI/AAAAAAAAAbg/b7e7FDAJtUE/s400/maybach_landaulet.jpg";
    }
    if (JSON.stringify(c.default_action.url) == "null" || JSON.stringify(c.default_action.url) == "None")
    {
      c.default_action.url = "https://1.bp.blogspot.com/-dfEJBx-NRmc/Tg61NU7ABkI/AAAAAAAAAbg/b7e7FDAJtUE/s400/maybach_landaulet.jpg";
    }
    // console.log("C", c);
    cards_string += JSON.stringify(c);
  }
  console.log(cards_string);
  return cards_string;
}
