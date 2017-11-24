import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Members } from '../../../../database/members.js';
import { Events } from '../../../../database/events.js';
import { Requirements } from '../../../../database/requirements.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';
import { Session } from 'meteor/session';

import './requirementLogsPage.html';

var ClubSiteId;
Template.requirementLogsTable.helpers({
	'members': function() {
		//sorts by last name in alphabetical order
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.find({clubId: ClubSiteId}, { sort: { lastName: 1 } }).fetch();
	},
	'requirements': function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Requirements.find({clubId: ClubSiteId}, { sort: { requirementName: 1 } });
	},
	'memberPoints': function(memberID, eventType) {
		var sum = 0;
		var cur = Events.find(
			{attendees: {$in: [memberID]}, eventType: eventType}, {eventValue: 1, _id: 0}
		).forEach(function(doc) {
			sum += parseInt(doc.eventValue);
		});
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		var totalNeeded = Requirements.findOne({clubId: ClubSiteId, requirementName: eventType}).totalNeeded;
		if (sum >= totalNeeded) {
			return "COMPLETE";
		}
		return sum;
			
	},

});

// Template.logsPage.events({
// 	'click .showBtn'(event) {
// 		var membs = Members.find({_id: {$in: this.participants}}, {_id: 0}).fetch();
// 		Session.set("attendee-modal", membs);
// 		$('#attendee-modal').modal('show');
// 	},
// });
	
	
// Template.attendeemodal.helpers({
// 	participants: function() {
// 		return Session.get("attendee-modal");
// 	}
// });
// Template.attendeemodal.events({
// 	'click .deleteBtn'(event) {
			
// 	},
// });
	

// HOT DAMN WHY DIDN'T ANYONE TELL ME ABOUT THIS?
//http://handlebarsjs.com/builtin_helpers.html