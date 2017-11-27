import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Members } from './members.js';
import { Requirements } from './requirements.js';

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
	'events.addSignUp'(eventId, memberId) {
		Events.update({_id: eventId }, { $addToSet: {'signedUpMembers': memberId} }, {upsert: true});
	},

	'events.addAllSignUp'(eventId, memberIds) {
		for (var i = 0; i < memberIds.length; i++) {
			Meteor.call('events.addSignUp', eventId, memberIds[i]._id);
		}
	},

	'events.removeSignUp'(eventId, memberId) {
		Events.update({_id: eventId }, { $pull: {'signedUpMembers': memberId} }, {upsert: true});
	},

	'events.addAttendee'(eventId, memberId, name, eventType, clubId) {
		Events.update({ _id: eventId }, { $addToSet: {'attendees': memberId } }, {upsert: true});

		if (eventType !== "None") {
			var status = Members.findOne({_id: memberId})[eventType];
			if (status !== "COMPLETE") {
				var points = parseInt(status);
				points += parseInt(Events.findOne({_id: eventId}).eventValue);

				// get the number of points needed for the specific requirement corresponding to the event
				var pointsNeeded = parseInt(Requirements.findOne({clubId: clubId, requirementName: eventType}).totalNeeded);

				// check if points have been met, if not, update the numerical value accordingly
				if (points >= pointsNeeded) {
					Members.update({_id:memberId}, { $set: {[eventType]: "COMPLETE"} });
				}
				else {
					Members.update({_id: memberId}, { $set: {[eventType]: points} });
				}
			}
		}
		
		// remove attendee from sign up list
		Meteor.call('events.removeSignUp', eventId, memberId);
	},

	'events.removeAttendees'(eventId, clubId) {
		Events.update({_id: eventId}, { $unset: {attendees: 1} });
	},

	'events.removeAllAttendees'(clubId) {
		Events.update({clubId: clubId}, { $unset: {attendees: 1} }, {multi: true});
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

// let EventsSchema = new SimpleSchema({
//   'title': {
//     type: String,
//     label: 'The title of this event.'
//   },
//   'start': {
//     type: String,
//     label: 'When this event will start.'
//   },
//   'sTime': {
//     type: String,
//     label: 'What time this event will start.',
//   },
//   'eTime': {
//     type: String,
//     label: 'What time this event will end.',
//   },
//   'location': {
//     type: String,
//     label: 'Where the event will take place.',
//   },
//   'eventType': {
//     type: String,
//     label: 'What type of event is this?',
//   },
//   'eventValue': {
//     type: String,
//     label: 'How many points is this event worth?',
//   },
//   'description': {
//     type: String,
//     label: 'Optional description of the event',
//   },
//   'signedUpMembers': {
//   	type: [String],
//   	label: 'Which members plan on attending this event?'
//   },
//   'attendees': {
//     type: [String],
//     label: 'Which members attended this event?',
//   },
//   'clubId': {
//     type: String,
//     label: 'What club is this event attached to?',
//   },
// });

// Events.attachSchema( EventsSchema );