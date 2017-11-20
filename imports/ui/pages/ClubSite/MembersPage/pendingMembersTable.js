import { Template } from 'meteor/templating';
import { InviteCodes } from '../../../../database/inviteCodes.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';
import { Members } from '../../../../database/members.js';
import { Clubs } from '../../../../database/clubs.js';

import './pendingMembersTable.html';

var ClubSiteId; 
Template.pendingMembersTable.helpers({
	pendingMembers() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return InviteCodes.find({clubId: ClubSiteId});
	},
});

Template.pendingMembers.helpers({
	isAdmin: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.findOne({userId: Meteor.userId(), clubId: ClubSiteId}).admin;
	},
});

Template.pendingMember.helpers({
	isAdmin: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.findOne({userId: Meteor.userId(), clubId: ClubSiteId}).admin;
	},
});

Template.pendingMembers.events({
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

Template.pendingMember.events({
	'click .deleteBtn'() {
		Meteor.call('inviteCodes.remove', this.inviteCode);
	},
});
