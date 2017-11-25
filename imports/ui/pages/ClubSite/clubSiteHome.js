import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Announcements } from '../../../database/announcements.js';
import { Clubs } from '../../../database/clubs.js';
import { ClubSiteIds } from '../../../database/clubSiteIds.js';


import './clubSiteHome.html';


Template.clubSiteHome.helpers({
	'club': function() {
		var ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Clubs.findOne({_id: ClubSiteId});
	}
});

Template.clubSiteHome.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },

    'submit .announcementForm': function(event) {
    	event.preventDefault();
    	var announcement = document.getElementById('announcement').value;
    	var ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
    	Meteor.call('announcements.insert', announcement, ClubSiteId);

    	$('#createAnnouncementModal').modal('hide');
		$('#createAnnouncementModal').find('form')[0].reset();
    }
});

Template.announcementsTable.helpers({
	announcements: function() {
		var ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Announcements.find({clubId: ClubSiteId}, {sort: {datePosted: -1}}, {limit: 10});
	}
});

Template.announcement.events({
	'click .deleteBtn': function() {
		Meteor.call('announcements.remove', this._id);
	}
});