import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ClubSiteIds = new Mongo.Collection('clubSiteIds');

Meteor.methods({
	'clubSiteIds.insert'(clubId) {

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }
		
		ClubSiteIds.insert({
			clubId,
			clubIdUser: this.userId
		});
	},

	'clubSiteIds.update'(clubId) {
		ClubSiteIds.update({clubIdUser: this.userId}, { $set: {"clubId": clubId } });
	},

	'clubSiteIds.remove'() {
		ClubSiteIds.remove({clubIdUser: this.userId});
	}
});