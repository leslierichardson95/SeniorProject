import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Events = new Mongo.Collection('events');

Meteor.methods({
	'events.insert'(event) {
		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		try {
			return Events.insert(event);
		}
		catch (exception) {
			throw new Meteor.error('500', `${exception}`);
		}
		// Events.insert({
		// 	eventName,
		// 	date, // date of the event (ie month, date, year)
		// 	sTime, // start time of the event
		// 	eTime, // end time of the event
		// 	eventType, // the type of event (optional) (i.e. what requirement does it meet, if any?)
		// 	eventValue, // how many points is this event worth toward the requirement type, if any?
		// 	description, // optional event description
		// 	attendees: [], // who is attending this event?
		// 	clubId
		// });
	},

	'events.update'(event) {
		try {
			return Events.update(event._id, {
				$set: event
			});
		}
		catch (exception) {
			throw new Meteor.Error('500', `${ exception }` );
		}
		// Events.update({ _id: eventId }, { $set: {"eventName": newEventName } });
		// Events.update({ _id: eventId }, { $set: {"date": newDate } });
		// Events.update({ _id: eventId }, { $set: {"Stime": newSTime } });
		// Events.update({ _id: eventId }, { $set: {"Etime": newETime } });
		// Events.update({ _id: eventId }, { $set: {"eventType": newEventType } });
		// Events.update({ _id: eventId }, { $set: {"eventValue": newEventValue } });
		// Events.update({ _id: eventId }, { $set: {"description": newDescription } });	
	},

	'events.addAttendee'(eventId, memberId, name, eventType) {
		Events.update({_id: eventId }, { $addToSet: {'attendees': memberId,} }, {upsert: true});
	},

	'events.remove'(event) {
		//check(eventId, String);
		//Events.remove(eventId);
		try {
			return Events.remove(event);
		}
		catch (exception) {
			throw new Meteor.Error('500', `${exception}`);
		}
	}
});

let EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of this event.'
  },
  'start': {
    type: String,
    label: 'When this event will start.'
  },
  'sTime': {
    type: String,
    label: 'What time this event will start.',
  },
  'eTime': {
    type: String,
    label: 'What time this event will end.',
  },
  'eventType': {
    type: String,
    label: 'What type of event is this?',
  },
  'eventValue': {
    type: String,
    label: 'How many points is this event worth?',
  },
  'description': {
    type: String,
    label: 'Optional description of the event',
  },
  'attendees': {
    type: [String],
    label: 'Which members are attending this event?',
  },
  'clubId': {
    type: String,
    label: 'What club is this event attached to?',
  },
});

Events.attachSchema( EventsSchema );