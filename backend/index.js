var express = require('express'),
  app = express(),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  mandrillKey = process.env.MANDRILL_KEY,
  mandrill = require('node-mandrill')(mandrillKey);

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-reqed-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.send('Hello Minuta!')
});

app.post('/share', function(req, res) {

  var to = req.body.email,
      taskData = req.body.taskData;

  if (typeof to === 'undefined') {
    res.json({success: false, msg: 'No email defined'});
    return false;
  }
  if (typeof taskData === 'undefined') {
    res.json({success: false, msg: 'No taks data defined'});
    return false;
  }

  taskData = JSON.parse(taskData);
  taskList = taskData.tasks;


  // start HTML
  var html = '<h1>Your taks List for ' + taskData.name + '<br>';

  for (i = 0; i < taskList.length; i++) { 
    html += taskList[i].text + '<br>';
  }
  // end HTML

  mandrill('/messages/send', {
    message: {
        to: [{email: to}],
        from_email: 'minuta@aerolab.co',
        subject: 'Minuta: ' + taskData.name,
        html: html
    }
  }, function(error, mandrillres)
  { 
    if (error) {
      //uh oh, there was an error
      console.log(error);
      res.json({success: false, msg: 'Issues with email provider'});
    } else {
      //everything's good, lets see what mandrill said
      res.json({success: true});
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


