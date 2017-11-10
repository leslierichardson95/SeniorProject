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
			members: [], // store user id of each member 
			requirements: [],
			events: [],
			admin: this.userId
		});

		var firstName = Meteor.user().profile.firstName;
		var lastName = Meteor.user().profile.lastName;
		var email = Meteor.user().emails[0].address;

		// insert default member (the user who created the club) 
		Meteor.call('members.insert', 
			this.userId,
			firstName,
			lastName,
			email,
			'',
			'Admin/Active',
			'General Member',
			clubID,
			true // first member/creator admin by default
		);
		// add default member to the club
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
		Members.remove({clubId: clubId}); // remove all members in the specified club
		Clubs.remove(clubId); // remove the club
	}
});

if ( Meteor.isServer ) {
  Clubs._ensureIndex( { clubName: 1, creationDate: 1} );
}

Clubs.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Clubs.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let ClubsSchema = new SimpleSchema({
  'clubName': {
    type: String,
    label: 'The name of this club.'
  },
  'creationDate': {
    type: String,
    label: 'The created date of this club.'
  },

});

Clubs.attachSchema( ClubsSchema );