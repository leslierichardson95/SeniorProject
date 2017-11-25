import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Clubs } from '../database/clubs.js';
import { ClubSiteIds } from '../database/clubSiteIds.js';
import { JoinRequests } from '../database/joinRequests.js';
import { Members } from '../database/members.js';

import './search.html';

Template.searchClubsTable.helpers({
	'clubs': function() {
		return Clubs.find({clubName: {$regex: Session.get('prefix') + ".*", $options: 'i'}});
	}
});

Template.search.events({
	'keyup [type=text]': function(event) {
		Session.set('prefix', $('.searchBox').val());
	}
});

Template.searchClub.helpers({
	// check if user is currently a member of the found club
	isMember: function() {
		if (Members.find({userId: Meteor.userId(), clubId: this._id}).count() >= 1) {
			return true;
		}
		else return false;
	}
});

Template.searchClub.events({
	'click .enterBtn' () {
		// set global club site id to the corresponding button pressed
		var clubSiteId = Clubs.findOne({_id: this._id}, {_id:1})._id;
		if (ClubSiteIds.find({clubIdUser: Meteor.userId()}).count() === 0) {
			Meteor.call('clubSiteIds.insert', clubSiteId)
		}
		else {
			Meteor.call('clubSiteIds.update', clubSiteId);
		}
		Router.go('/clubSiteHome'); // go to the corresponding club site page
	},

	'click .requestInviteBtn' () {
		if ( JoinRequests.find({clubId: this._id, userId: Meteor.userId()}).count() >= 1 ) {
			swal('You have already sent a join request for this club!', '', 'error');
		}
		else {
			Meteor.call('joinRequests.insert',
				this._id,
				Meteor.user().profile.firstName,
				Meteor.user().profile.lastName,
				Meteor.user().emails[0].address,
				Meteor.userId()
			);
			swal('Join Club Request Sent!', '', 'success');	
		}
		
	}
});