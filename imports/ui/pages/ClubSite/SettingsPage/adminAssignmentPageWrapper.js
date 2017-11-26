import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Clubs } from '../../../../database/clubs.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';


import './adminAssignmentPageWrapper.html';


Template.adminAssignmentPageWrapper.helpers({
	'club': function() {
		var ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Clubs.findOne({_id: ClubSiteId});
	}
});

Template.adminAssignmentPageWrapper.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }
});