import { Template } from 'meteor/templating';
import { Members } from '../../../database/members.js';

import './myProfilePage.html';

if (Meteor.isClient) {
Template.myProfilePage.helpers({
	userInfo: function() {
		return Meteor.user();
	},
	userEmail: function() {
		return Meteor.user().emails[0].address;
	}
});

Template.myProfilePage.events({
	'click .updateBtn' (event) {
		event.preventDefault();

		var newFirstName = document.getElementById('editFirstName').value;
		var newLastName = document.getElementById('editLastName').value;
		var newEmail = document.getElementById('editEmail').value;
		var newPhoneNumber = document.getElementById('editPhoneNumber').value;

		Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.firstName': newFirstName}});
		Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.lastName': newLastName}});
		Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.phoneNumber': newPhoneNumber}});
		Meteor.users.update({_id: Meteor.userId()}, {$set: {'emails.0.address': newEmail}});

		var memberIds = Members.find({userId: Meteor.userId()}).fetch();
		for (var i = 0; i < memberIds.length; i++) {
			Meteor.call('members.updateUserInfo', memberIds[i]._id, newFirstName, newLastName, newEmail, newPhoneNumber);
		}

		// hide the modal
		$('#editProfileModal').modal('hide');
	},
});
}