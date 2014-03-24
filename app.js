var pin = require('pin');
var nodemailer = require('nodemailer');

email_service="Gmail";
email_sender="change_this_sender@gmail.com";
email_pwd="change_this_password";
email_recipient="change_this_recipient@gmail.com";

function smtp_config(email_service,email_sender,email_pwd){
  var smtpdetails=nodemailer.createTransport("SMTP",{
    service: email_service,
    auth: {
      user: email_sender,
      pass: email_pwd,
    }
  });
  return smtpdetails;
}

function email_routing(to_e,from_e,sub,body) {
  var maildetails = {
    from: from_e,
    to: to_e,
    subject: sub,
    text: body,
  }
  return maildetails;
}

function pingsite(site,seconds){
  pin(site)
    .interval(seconds*1000) // in ms
    .up(function(response) {
      site_status=site+" is responding to pings";
      console.log(site_status);
     })
    .down(function(error, response) {
      site_status=site+" is not responding to pings!";
      console.log(error, response);
      var mailOptions = email_routing(email_recipient,email_sender,site_status,error);
      smtpTransport=smtp_config(email_service,email_sender,email_pwd);
      smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log("Message sent");
        }
      });
  });
}

pingsite('http://www.slate.com',9);
pingsite('http://s3.amazonaws.com/heroku_pages/error.html/',10);

