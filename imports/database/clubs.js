import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Members } from './members.js';

export const Clubs = new Mongo.Collection('clubs');

Meteor.methods({
	'clubs.insert'(clubName, clubDescription, memberId) {
		check(clubName, String);
		check(clubDescription, String);

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		var clubID = Clubs.insert({
			clubName,
			clubDescription,
			creationDate: new Date(),
			members: [],
			requirements: [],
			events: []
		});

		var firstName = Meteor.user().profile.firstName;
		var lastName = Meteor.user().profile.lastName;
		var email = Meteor.user().emails[0].address;

		Meteor.call('members.insert', 
			this.userId,
			firstName,
			lastName,
			email,
			'',
			'Admin/Active',
			'General Member',
			clubID
		);

		Meteor.call('clubs.addMember', clubID, this.userId);
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