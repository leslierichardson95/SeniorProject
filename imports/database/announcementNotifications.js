import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const AnnouncementNotifications = new Mongo.Collection('announcementNotifications');

Meteor.methods({
	'announcementNotifications.insert'(memberId, clubId, email) {

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }
		
		AnnouncementNotifications.insert({
			memberId,
			clubId,
			email,
			userId: Meteor.userId()
		});
	},

	'announcementNotifications.remove'(clubId, email) {
		AnnouncementNotifications.remove({clubId: clubId, email: email});
	}
});