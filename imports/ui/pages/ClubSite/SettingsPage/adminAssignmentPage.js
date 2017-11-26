import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Members } from '../../../../database/members.js';
import { Events } from '../../../../database/events.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';
import { AnnouncementNotifications } from '../../../../database/announcementNotifications.js';
import { EventNotifications } from '../../../../database/eventNotifications.js';

import './adminAssignmentPage.html';

var ClubSiteId;
Template.adminAssignmentPage.helpers({
});

Template.adminAssignmentTable.helpers({
	members: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.find({clubId: ClubSiteId}, {sort: {lastName: 1, firstName: 1}});
	}
});

Template.adminAssignment.helpers({
	isAdminChecked: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		if (Members.findOne({_id: this._id}).admin) return true;
		else return false;
	}
});

Template.adminAssignment.events({
	'click .adminCheckbox'(event) {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		var firstName = this.firstName;
		var lastName = this.lastName;
		var memberId = this._id;
		if (event.target.checked) {
			Meteor.call('members.makeAdmin', memberId);
			Bert.alert(firstName + ' ' + lastName + ' is now a club administrator.', 'success');
		}
		else {
			//console.log(Members.find({clubId: ClubSiteId, admin:true}).count());
			if (Members.find({clubId: ClubSiteId, admin: true}).count() <= 1) {
				event.target.checked = true;
				swal('There must be at least one admin in the club!','Please make another member an admin and try again.', 'error');
			}
			else {
				Meteor.call('members.removeAdmin', memberId);
				Bert.alert(firstName + ' ' + lastName + ' is no longer a club administrator.');
			}
		}
	}
});

// Template.settingsNavbar.helpers({
// 	isAdmin: function() {
// 		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
// 		if (Members.findOne({clubId: ClubSiteId, _id: this._id}).admin) return true;
// 		else return false;
// 	}
// });

