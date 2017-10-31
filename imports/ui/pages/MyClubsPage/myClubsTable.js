import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Clubs } from '../../../database/clubs.js';
import { Members } from '../../../database/members.js';

import './myClubsTable.html';

// retrieve all clubs the current user is a part of 
// ie, find all clubs containing a member with user's email
Template.myClubsTable.helpers({
	'clubs': function() {
		return Clubs.find({members: Meteor.userId });
	},
	'members': function() {
		return Members.find({})
	}
});