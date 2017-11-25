import { Template } from 'meteor/templating';
import { Clubs } from '../database/clubs.js';
import { Members } from '../database/members.js';
import { Requirements } from '../database/requirements.js';
import { Events } from '../database/events.js';
import { ClubSiteIds } from '../database/clubSiteIds.js';

import './event.html';

Template.upcomingEventsTable.helpers({
	upcomingEvents: function() {
		// get all clubs the user is a part of 
		Members.join(Clubs, "clubId", "club", ["clubName", "clubDescription", "creationDate"]);
		var usersClubIds = Members.find({userId: Meteor.userId()},{"club._id":1}).fetch();
		// map array to club ids
		usersClubIds = usersClubIds.map(function(x) {return x.club._id});

		// convert current date to a moment object in YYYY-MM-DD format--fullcalendar.io uses moment.js for dates
		var currentDate = moment().startOf('day');
		currentDate = currentDate.format("YYYY-MM-DD");

		//var clubs = Clubs.find({ _id:{$in: usersClubIds} }, {clubName:1, _id: 0}).fetch();
		Events.join(Clubs, "clubId", "club", ["clubName"]);
		// query all events the user is a part of (aka find all events containing a club id the user is a part of)
		return Events.find({ clubId:{$in: usersClubIds}, start: {$gte: currentDate} }, {sort: {start: 1, sTime: 1}}, {limit: 8}).fetch();
	},

});

Template.upcomingEvent.helpers({
	clubs: function() {
		// get all clubs the user is a part of 
		Members.join(Clubs, "clubId", "club", ["clubName", "clubDescription", "creationDate"]);
		var usersClubIds = Members.find({userId: Meteor.userId()},{"club._id":1}).fetch();
		// map array to club ids
		usersClubIds = usersClubIds.map(function(x) {return x.club._id});
		// query all events the user is a part of (aka find all events containing a club id the user is a part of)
		//console.log(Clubs.find({_id:{$in: usersClubIds} }).fetch());
		return Clubs.find({ _id:{$in: usersClubIds} });
	},

	isPast: function(date) {
		let today = moment().format();
		return moment(today).isAfter(date);
	}
});

Template.pastEventsTable.helpers({
	pastEvents: function() {
		// get all clubs the user is a part of 
		Members.join(Clubs, "clubId", "club", ["clubName", "clubDescription", "creationDate"]);
		var usersClubIds = Members.find({userId: Meteor.userId()},{"club._id":1}).fetch();
		// map array to club ids
		usersClubIds = usersClubIds.map(function(x) {return x.club._id});

		// convert current date to a moment object in YYYY-MM-DD format--fullcalendar.io uses moment.js for dates
		var currentDate = moment().startOf('day');
		currentDate = currentDate.format("YYYY-MM-DD");
		// query all events the user is a part of (aka find all events containing a club id the user is a part of)
		return Events.find({ clubId:{$in: usersClubIds}, start: {$lt: currentDate} }, {sort: {start: 1, sTime: 1}}, {limit: 8});
	}
});