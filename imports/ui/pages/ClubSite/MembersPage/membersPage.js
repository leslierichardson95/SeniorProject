import { Template } from 'meteor/templating';
import { Members } from '../../../../database/members.js';
import { Clubs } from '../../../../database/clubs.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';
import { InviteCodes } from '../../../../database/inviteCodes.js';
import { JoinRequests } from '../../../../database/joinRequests.js';

import './membersPage.html';

var ClubSiteId;

Template.membersPage.helpers({
	isAdmin: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.findOne({userId: Meteor.userId(), clubId: ClubSiteId}).admin;
	},
});

Template.membersPage.events({
	'click .inviteBtn': function(event) {
		event.preventDefault();

		var firstName = document.getElementById('firstName').value;
		var lastName = document.getElementById('lastName').value;
		var email = document.getElementById('email').value;

		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		var clubName = Clubs.findOne({_id: ClubSiteId}).clubName;

		// create member invite code
		var inviteCode = Random.id();

		Meteor.call('emailInvite', firstName+' '+lastName, email, clubName, ClubSiteId, inviteCode);

		// hide the modal
		$('#inviteMemberModal').modal('hide');	

		Bert.alert('Invite Sent!', 'success');
	}
});

Template.membersNavbar.helpers({
	memberCount: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.find({clubId: ClubSiteId}).count();
	},

	pendingCount: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		//console.log(InviteCodes.find({clubId: ClubSiteId}).count());
		return InviteCodes.find({clubId: ClubSiteId}).count();
	},

	joinCount: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return JoinRequests.find({clubId: ClubSiteId}).count();
	}
});
