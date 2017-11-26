import { Meteor } from 'meteor/meteor';
import { Events } from '../imports/database/events.js';
import { EventNotifications } from '../imports/database/eventNotifications.js';

if (Meteor.isServer) {
	Meteor.startup( function() {
		process.env.MAIL_URL = "smtp://postmaster@sandbox66c393fbdd0e4f7dabb9581c7adfcaed.mailgun.org:959525e02afe26a4f2556a854f075a76@smtp.mailgun.org:587";
		Meteor.setInterval(sendEventNotificationEmails, 86400); //send email notifications every 24 hours
	});
}

var sendEventNotificationEmails = function() {
	// convert current date to a moment object in YYYY-MM-DD format--fullcalendar.io uses moment.js for dates
	var currentDate = moment().startOf('day');
	currentDate = currentDate.format("YYYY-MM-DD");

	var events = Events.find({start: {$eq: currentDate}}).fetch();
	for (var i = 0; i < events.length; i++) {
		var emails = EventNotifications.find({clubId: events[i].clubId}).fetch();
		for (var j = 0; j < emails.length; j++) {
			Meteor.call('emailEvent', emails[j].email, events[i].title, events[i].start, events[i].sTime, events[i].eTime, events[i].location, events[i].eventType, events[i].description);
		}
	}
}

