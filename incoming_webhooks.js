var debug = require('debug')('botkit:incoming_webhooks');

var webserver = express();
webserver.use(bodyParser.json());
webserver.use(bodyParser.urlencoded({ extended: true }));


webserver.listen(3000, null, function() {

    console.log('Express webserver configured and listening at http://localhost:' +  3000);

});

    webserver.post('/facebook/receive', function(req, res) {

        // NOTE: we should enforce the token check here

        // respond to Slack that the webhook has been received.
        res.status(200);
        res.send('ok');

        console.log(req.body);

        // Now, pass the webhook into be processed


    });

    webserver.get('/facebook/receive', function(req, res) {
      console.log("get request");
        if (req.query['hub.mode'] == 'subscribe') {
            if (req.query['hub.verify_token'] == "Cairo2018") {
                res.send(req.query['hub.challenge']);
            } else {
                res.send('OK');
            }
        }
    });
