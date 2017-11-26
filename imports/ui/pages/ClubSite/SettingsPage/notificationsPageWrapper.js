import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Clubs } from '../../../../database/clubs.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';


import './notificationsPageWrapper.html';


Template.notificationsPageWrapper.helpers({
	'club': function() {
		var ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Clubs.findOne({_id: ClubSiteId});
	}
});

Template.notificationsPageWrapper.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }
});