import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const InviteCodes = new Mongo.Collection('inviteCodes');

Meteor.methods({
	'inviteCodes.insert'(inviteCode, clubId, name, email) {

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }
		
		InviteCodes.insert({
			name,
			email,
			inviteCode,
			clubId
		});
	},

	'inviteCodes.remove'(inviteCode) {
		InviteCodes.remove({inviteCode: inviteCode});
	}
});