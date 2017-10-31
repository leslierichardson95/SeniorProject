import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Members = new Mongo.Collection('members');

Meteor.methods({
	'members.insert'(userId, firstName, lastName, email, phoneNumber, status, position) {
		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		Members.insert({
			userId,
			firstName,
			lastName,
			email,
			phoneNumber, // optional
			status, // i.e. active/inactive/ADMIN/etc
			position, // i.e. president, general member, etc.
			dateJoined: new Date(),
			club // key linking member with particular club
		});
	},

	'members.update'(memberId, newFirstName, newLastName, newEmail, newPhone, newStatus, newPosition) {
		Members.update(memberId, { $set: {"firstName": newFirstName } });
		Members.update(memberId, { $set: {"lastName": newLastName } });
		Members.update(memberId, { $set: {"email": newEmail } });
		Members.update(memberId, { $set: {"phoneNumber": newPhone } });
		Members.update(memberId, { $set: {"newStatus": newStatus } });
		Members.update(memberId, { $set: {"newPosition": newPosition } });
	},

	'members.addRequirement'(requirementName) {
		Members.update({}, 
			{ $addToSet: 
				{
					[requirementName]: 0
				}
			}, {multi: true});
	},

	'members.updateRequirement'(oldName, newName) {
		Members.update({},
			{ $rename:
				{
					[oldName]: newName
				}
			}, {multi: true});
	},

	'members.removeRequirement'(requirementName) {
		Members.update({},
			{ $unset:
				{
					[requirementName]:1
				}

			}, {multi: true});
	},

	'members.remove'(memberId) {
		check(memberId, String);
		Members.remove(memberId); 
	}
});