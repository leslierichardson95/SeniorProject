import { Template } from 'meteor/templating';
import { JoinRequests } from '../../../../database/joinRequests.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';
import { Members } from '../../../../database/members.js';
import { Clubs } from '../../../../database/clubs.js';

import './joinRequestsTable.html';

var ClubSiteId; 
Template.joinRequestsTable.helpers({
	joinRequests() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return JoinRequests.find({clubId: ClubSiteId});
	},
});

Template.joinRequests.helpers({
	isAdmin: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.findOne({userId: Meteor.userId(), clubId: ClubSiteId}).admin;
	},
});

Template.joinRequest.helpers({
	isAdmin: function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.findOne({userId: Meteor.userId(), clubId: ClubSiteId}).admin;
	},
});

Template.joinRequests.events({
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

Template.joinRequest.events({
	'click .acceptBtn'() {
		//add person to the club as a new member
		Meteor.call('members.insert', 
			this.userId, //userId
			this.firstName, 
			this.lastName, 
			this.email, 
			this.phoneNumber, 
			'Active', 
			'General Member', 
			this.clubId,
			false
		);
		
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		//console.log(this._id);
		var clubName = Clubs.findOne({_id: this.clubId}).clubName;

		Meteor.call('joinRequests.remove', this._id);
		Meteor.call('emailJoinAccept', this.firstName+" "+this.lastName, this.email, clubName);
		Bert.alert('Join request accepted!', 'success');
	},

	'click .declineBtn'() {
		Meteor.call('joinRequests.remove', this._id);
		Meteor.call('emailJoinDecline', this.firstName+" "+this.lastName, this.email, this.clubName);
		Bert.alert('Join request denied.', 'danger');
	},
});
