import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Members } from './members.js';

export const Clubs = new Mongo.Collection('clubs');

Meteor.methods({
	'clubs.insert'(clubName, clubDescription, memberId) {
		console.log('hi');
		check(clubName, String);
		check(clubDescription, String);

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		Clubs.insert({
			clubName,
			clubDescription,
			creationDate: new Date(),
			members: [],
			requirements: [],
			events: []
		});

		Meteor.call('members.insert', 
			memberId,
			Meteor.user.profile.firstName,
			Meteor.user.profile.lastName,
			Meteor.user.emails[0].address,
			'',
			'Admin/Active',
			'General Member',
			clubName
		);

		Meteor.call('clubs.addMember', this._id, memberId);
	},

	'clubs.update'(clubId, newClubName, newClubDescription) {
		Clubs.update(clubId, { $set: {"clubName": newClubName } });
		Clubs.update(clubId, { $set: {"clubDescription": newClubDescription } });
	},

	'clubs.addMember'(clubId, memberId) {
		Clubs.update({_id: clubId }, { $addToSet: {'members': memberId } }, {upsert: true});
	},

	'clubs.remove'(clubId) {
		check(clubId, String);
		Clubs.remove(clubIs);
	}
});