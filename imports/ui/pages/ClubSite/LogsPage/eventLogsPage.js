import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Members } from '../../../../database/members.js';
import { Events } from '../../../../database/events.js';
import { Requirements } from '../../../../database/requirements.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';
import { Session } from 'meteor/session';

import './eventLogsPage.html';

var ClubSiteId;
Template.eventLogsTable.helpers({
	'members': function() {
		//sorts by last name in alphabetical order
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.find({clubId: ClubSiteId}, { sort: { lastName: 1 } }).fetch();
	},
	'events': function() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Events.find({clubId: ClubSiteId}, { sort: { start: 1, sTime: 1 } });
	},
	'eventAttended': function(memberID, eventName) {
		//check if name === a name in event participants list 
		//if yes, return true, else return false
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		console.log(memberID);
		console.log(Events.find({attendees: {$in: [memberID]}, title: eventName}).fetch());
		if (Events.find({clubId: ClubSiteId, attendees: {$in: [memberID]}, title: eventName}, {title: 1, _id: 0}).count() >= 1) {
			return true;
		}
		return false;

	},

});