import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Members = new Mongo.Collection('members');

Meteor.methods({
	'members.insert'(userId, firstName, lastName, email, phoneNumber, status, position, clubId, admin) {
		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		Members.insert({
			userId,
			firstName,
			lastName,
			email,
			phoneNumber, // optional
			status, // i.e. active/inactive/ADMIN/etc
			position, // i.e. president, general member, etc.
			clubId, // key linking member with particular club
			dateJoined: new Date(),
			admin
		});
	},

	'members.update'(memberId, newFirstName, newLastName, newEmail, newPhone, newStatus, newPosition, newAdmin) {
		Members.update(memberId, { $set: {"firstName": newFirstName } });
		Members.update(memberId, { $set: {"lastName": newLastName } });
		Members.update(memberId, { $set: {"email": newEmail } });
		Members.update(memberId, { $set: {"phoneNumber": newPhone } });
		Members.update(memberId, { $set: {"status": newStatus } });
		Members.update(memberId, { $set: {"position": newPosition } });
		Members.update(memberId, { $set: {"admin": newAdmin } });
	},

	'members.updateStatus'(memberId, newStatus) {
		Members.update(memberId, { $set: {"status":newStatus } });
	},

	'members.updatePosition'(memberId, newPosition) {
		Members.update(memberId, { $set: {"position":newPosition } });
	},

	'members.updateUserInfo'(memberId, newFirstName, newLastName, newEmail, newPhoneNumber) {
		Members.update(memberId, {$set: {'firstName': newFirstName}});
		Members.update(memberId, {$set: {'lastName': newLastName}});
		Members.update(memberId, {$set: {'email': newEmail}});
		Members.update(memberId, {$set: {'phoneNumber': newPhoneNumber}});
	},

	'members.addRequirement'(requirementName, clubSiteId) {
		Members.update({clubId: clubSiteId}, 
			{ $addToSet: 
				{
					[requirementName]: 0
				}
			}, {multi: true});
	},

	'members.updateRequirement'(oldName, newName, clubSiteId) {
		Members.update({clubId: clubSiteId},
			{ $rename:
				{
					[oldName]: newName
				}
			}, {multi: true});
	},

	'members.removeRequirement'(requirementName, clubSiteId) {
		Members.update({clubId: clubSiteId},
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