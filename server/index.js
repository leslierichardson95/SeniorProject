import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	Meteor.startup( function() {
		process.env.MAIL_URL = "smtp://postmaster@sandbox66c393fbdd0e4f7dabb9581c7adfcaed.mailgun.org:959525e02afe26a4f2556a854f075a76@smtp.mailgun.org:587";
	});
}

