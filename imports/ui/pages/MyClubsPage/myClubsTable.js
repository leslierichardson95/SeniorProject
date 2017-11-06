import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Clubs } from '../../../database/clubs.js';
import { Members } from '../../../database/members.js';

import './myClubsTable.html';

// retrieve all clubs the current user is a part of 
// ie, find all clubs containing a member with user's email
Template.myClubsTable.helpers({
	// return all clubs the member is a part of by joining club and member collections
	members: function() {
		Members.join(Clubs, "clubId", "club", ["clubName", "clubDescription", "creationDate"]);
		var array = Members.find({userId: Meteor.userId()},{"club.clubName":1, "club.clubDescription":1, "club.creationDate":1}).fetch();
		return array;
	}
	
});

Template.club.helpers({
	// Checks if the current user is the admin of the club
	isAdmin: function() {
		var adminId = Members.findOne({_id: this._id}).admin;
		return adminId;
	},
});

Template.club.events({
	'click .deleteBtn' () {
		var clubId = Members.findOne({_id: this._id}, {clubId:1, _id:0}).clubId;
		swal({
			title: 'Are you sure you want to delete this club?',
			text: "Once deleted, all club data will be erased and cannot be recovered.",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Yes, delete it!',
		  	cancelButtonText: 'No, cancel!',
		  	confirmButtonClass: 'btn btn-success',
		  	cancelButtonClass: 'btn btn-danger',
		  	buttonsStyling: false,
		}).then(function () {
			// need to get club id based on member id
			Meteor.call('clubs.remove', clubId);
			swal("Club deleted!", '','success');
		});
	}
});
