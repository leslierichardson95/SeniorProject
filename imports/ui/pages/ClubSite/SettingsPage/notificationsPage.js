import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Members } from '../../../../database/members.js';
import { Events } from '../../../../database/events.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';
import { AnnouncementNotifications } from '../../../../database/announcementNotifications.js';
import { EventNotifications } from '../../../../database/eventNotifications.js';

import './notificationsPage.html';

// Template.eventSignUps.onRendered = function() {
// 		$('#notificationToggle').bootstrapToggle();
// 		$('#signUpToggle').bootstrapToggle();
// });

var ClubSiteId;
Template.notificationsPage.helpers({
	isAnnounceChecked() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		if ( AnnouncementNotifications.find({clubId: ClubSiteId, userId: Meteor.userId()}).count() >= 1 ) return true;
		else return false;
	},

	isEventsChecked() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		//console.log(EventNotifications.find({clubId: ClubSiteId, userId: Meteor.userId()}).count());
		if ( EventNotifications.find({clubId: ClubSiteId, userId: Meteor.userId()}).count() >= 1 ) return true;
		else return false;
	},
});

Template.notificationsPage.events({
	'click .announceEmailCheckbox' (event) {
		// console.log(event.target.checked);
		if (event.target.checked) {
			ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
			var memberId = Members.findOne({clubId: ClubSiteId, userId: Meteor.userId()})._id;
			Meteor.call('announcementNotifications.insert', memberId, ClubSiteId, Meteor.user().emails[0].address);
			Bert.alert('Email notifications for announcements are ON!', 'success');
		}
		else {
			ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
			//var memberId = Members.findOne({clubId: ClubSiteId, userId: Meteor.userId()})._id;
			Meteor.call('announcementNotifications.remove', ClubSiteId, Meteor.user().emails[0].address);
			Bert.alert('Email notifications for announcements are OFF!');
		}
	},

	'click .eventEmailCheckbox'(event) {
		if (event.target.checked) {
			ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
			var memberId = Members.findOne({clubId: ClubSiteId, userId: Meteor.userId()})._id;
			Meteor.call('eventNotifications.insert', memberId, ClubSiteId, Meteor.user().emails[0].address);
			Bert.alert('Email notifications for events are ON!', 'success');
		}
		else {
			ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
			//var memberId = Members.findOne({clubId: ClubSiteId, userId: Meteor.userId()})._id;
			Meteor.call('eventNotifications.remove', ClubSiteId, Meteor.user().emails[0].address);
			Bert.alert('Email notifications for events are OFF!');
		}
	}
});
