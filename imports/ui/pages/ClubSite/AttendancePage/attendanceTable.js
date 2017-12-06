import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Members } from '../../../../database/members.js';
import { Events } from '../../../../database/events.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';

import './attendanceTable.html';

var ClubSiteId;
Template.attendanceTable.helpers({
	events() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;

		// convert current date to a moment object in YYYY-MM-DD format--fullcalendar.io uses moment.js for dates
		var currentDate = moment().startOf('day');
		currentDate = currentDate.format("YYYY-MM-DD");

		return Events.find({clubId: ClubSiteId, start: {$eq: currentDate}}, {sort: {start: 1, sTime: 1}});
	}
});

var info;
Template.eventSignIn.helpers({
	'members': function() {
		// This is where we can filter by members that have already signed in.
		// Need current event id.
		// var memberIds = Events.findOne({_id: this._id}).signedUpMembers;
		// var members = Members.find({_id: {$in: memberIds}});		
		// return members;
		info = Session.get("signin-modal");
		if (info) {
			return Session.get("signin-modal");
		}

	},
	'selectedClass': function() {
		var attendeeId = this._id;
		var selectedAttendee = Session.get('attendee');
		if(attendeeId == selectedAttendee) {
			return "active";
		}
	},
	'selectedAttendee': function() {
		var selectedAttendee = Session.get('attendee');
		return Members.findOne({ _id: selectedAttendee });
	},
});

var eventID;
var selectedButton;
var selectedMember;
var eventType;
Template.eventSignIn.events({
	'click .signInBtn'(event) {
		eventID = this._id;
		eventType = this.eventType;
		var memberIds = Events.findOne({_id: this._id}).signedUpMembers;
		var members = Members.find({_id: {$in: memberIds}}, {sort: {lastName: 1}} ).fetch();

		Session.set("signin-modal", members);
	},

	'click .memberBtn'(event) {
		//get/store selected member name and button
		selectedMember = event.target.innerText;
		selectedButton = event.target;
		var selectedAttendee = this._id;
		Session.set('attendee', selectedAttendee);
	},

	'click .confirmSignInBtn'(event) {
		// Prevent default browser form submit
		//console.log(selectedMember);
		event.preventDefault();
		var selectedAttendee = Session.get('attendee');
		console.log(selectedAttendee);
		var attendeeName = Members.findOne({ _id: selectedAttendee }).firstName;

		//var points = Members.findOne({_id: selectedAttendee})[eventType];
		//console.log(points);

		attendeeName = attendeeName.concat(" ");
		attendeeName = attendeeName.concat(Members.findOne({ _id: selectedAttendee }).lastName);
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		Meteor.call('events.addAttendee', eventID, selectedAttendee, attendeeName, eventType, ClubSiteId);
		Bert.alert('You are signed in!','success');
		//selectedButton.className = "memberBtn list-group-item-success";

		// hide the modal/clear form
		$('#memberSignInModal').modal('hide');
	}, 

});
