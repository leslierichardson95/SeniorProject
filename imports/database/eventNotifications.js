import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const EventNotifications = new Mongo.Collection('eventNotifications');

Meteor.methods({
	'eventNotifications.insert'(memberId, clubId, email) {

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }
		
		EventNotifications.insert({
			memberId,
			clubId,
			email,
			userId: Meteor.userId()
		});
	},

	'eventNotifications.remove'(clubId, email) {
		EventNotifications.remove({clubId: clubId, email: email});
	}
});