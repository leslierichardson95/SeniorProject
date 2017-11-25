import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Announcements = new Mongo.Collection('announcements');

Meteor.methods({
	'announcements.insert'(announcement, clubId) {

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		Announcements.insert({
			announcement,
			datePosted: new Date(),
			clubId
		});
	},

	'announcements.remove'(announcementId) {
		Announcements.remove(announcementId);
	}
});