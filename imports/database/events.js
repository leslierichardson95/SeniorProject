import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Events = new Mongo.Collection('events');

Meteor.methods({
	'events.insert'(eventName, date, sTime, eTime, eventType, eventValue, description) {
		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		Events.insert({
			eventName,
			date, // date of the event (ie month, date, year)
			sTime, // start time of the event
			eTime, // end time of the event
			eventType, // the type of event (optional) (i.e. what requirement does it meet, if any?)
			eventValue, // how many points is this event worth toward the requirement type, if any?
			description, // optional event description
			attendees: [] // who is attending this event?
		});
	},

	'events.update'(eventId, newEventName, newDate, newSTime, newETime, newEventType, newEventValue, newDescription) {
		Events.update({ _id: eventId }, { $set: {"eventName": newEventName } });
		Events.update({ _id: eventId }, { $set: {"date": newDate } });
		Events.update({ _id: eventId }, { $set: {"Stime": newSTime } });
		Events.update({ _id: eventId }, { $set: {"Etime": newETime } });
		Events.update({ _id: eventId }, { $set: {"eventType": newEventType } });
		Events.update({ _id: eventId }, { $set: {"eventValue": newEventValue } });
		Events.update({ _id: eventId }, { $set: {"description": newDescription } });	
	},

	'events.addAttendee'(eventId, memberId, name, eventType) {
		Events.update({_id: eventId }, { $addToSet: {'attendees': memberId,} }, {upsert: true});
	},

	'events.remove'(eventId) {
		check(eventId, String);
		Events.remove(eventId);
	}
});