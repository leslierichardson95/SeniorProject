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
	},

	isAdmin: function() {
		// return 
	}
	
});

Template.club.events({
	'click .deleteBtn' () {
		// need to get club id based on member id
		var clubId = Members.findOne({_id: this._id}, {clubId:1, _id:0}).clubId;
		Meteor.call('clubs.remove', clubId);
	}
});
