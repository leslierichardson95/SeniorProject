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
		return Events.find({clubId: ClubSiteId}, {sort: {start: 1, sTime: 1}});
	}
});

function isEventCreator(eventId) {
	var creatorId = Events.findOne({_id: eventId}, {eventCreator: 1, _id: 0});
	if (Meteor.userId() === creatorId.eventCreator) return true;
		else return false;
}
Template.eventSignUp.helpers({
	isAdmin: function() {
		return Members.findOne({userId: Meteor.userId(), clubId: ClubSiteId}).admin || isEventCreator(this._id);
	},

	isSignUpChecked: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		var member = Members.findOne({clubId: ClubSiteId, userId: Meteor.userId()});
		//console.log(Events.find( {_id: this._id, signedUpMembers: {$in: [member._id]} } ).fetch());
		if ( Events.find( {_id: this._id, signedUpMembers: {$in: [member._id]} } ).count() === 1 ) {
			return true;
		}
		else return false;
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
	},

	'click .signInAllBtn'() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		var memberIds = Members.find({clubId: ClubSiteId}, {_id:1}).fetch();
		Meteor.call('events.addAllSignUp', this._id, memberIds);
	}
});
