import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Members } from '../../../../database/members.js';
import { Events } from '../../../../database/events.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';

import './eventSignUpTable.html';

// Template.eventSignUps.onRendered = function() {
// 		$('#notificationToggle').bootstrapToggle();
// 		$('#signUpToggle').bootstrapToggle();
// });

var ClubSiteId;
Template.eventSignUpTable.helpers({
	events() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Events.find({clubId: ClubSiteId});
	}
});

Template.eventSignUp.events({
	'click .signUpToggle' (event) {
		// console.log(event.target.checked);
		if (event.target.checked) {
			ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
			var memberId = Members.findOne({clubId: ClubSiteId, userId: Meteor.userId()})._id;
			Meteor.call('events.addSignUp', this._id, memberId);
			Bert.alert('You are signed up!', 'success');
		}
		else {
			ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
			var memberId = Members.findOne({clubId: ClubSiteId, userId: Meteor.userId()})._id;
			Meteor.call('events.removeSignUp', this._id, memberId);
			Bert.alert('You are no longer signed up');
		}
	}
});
