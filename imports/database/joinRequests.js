import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const JoinRequests = new Mongo.Collection('joinRequests');

Meteor.methods({
	'joinRequests.insert'(clubId, firstName, lastName, email, userId) {

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }
		
		JoinRequests.insert({
			firstName,
			lastName,
			email,
			clubId,
			userId
		});
	},

	'joinRequests.remove'(requestId) {
		JoinRequests.remove({_id: requestId});
	}
});