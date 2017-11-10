import { Template } from 'meteor/templating';

import { Requirements } from '../../../../database/requirements.js';
import { Members } from '../../../../database/members.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';

import './requirementsTable.html';

var ClubSiteId; 
Template.requirementsTable.helpers({
	requirements() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Requirements.find({clubId: ClubSiteId});
	},
});

Template.requirement.helpers({
	isAdmin: function() {
		return Members.findOne({userId: Meteor.userId(), clubId: ClubSiteId}).admin;
	},
});

var rowID;
var oldRequirementName;
Template.requirement.events({

	// occurs when update in modal is clicked
	'click .updateBtn'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		// Get values from form elements
		var newRequirementName = document.getElementById('editRequirementName').value;
		var newTotalNeeded = document.getElementById('editTotalNeeded').value;
		var newDescription = document.getElementById('editDescription').value;

		Meteor.call('requirements.update', rowID, oldRequirementName, newRequirementName, newTotalNeeded, newDescription, ClubSiteId);

		// hide the modal
		$('#editModal').modal('hide');
	},

	'click .deleteBtn'() {
    	Meteor.call('requirements.remove', this._id, this.requirementName, ClubSiteId);
	},

	'click .editBtn'() {
		console.log(this);
		rowID = this._id;
		oldRequirementName = this.requirementName;
		
		// Get corresponding current requirement info 
		var requirementName = this.requirementName;
		var totalNeeded = this.totalNeeded;
		var description = this.requirementDescription;

		// Insert current requirement values into the edit modal
		$(".modal-body #editRequirementName").val(requirementName);
		$(".modal-body #editTotalNeeded").val(totalNeeded);
		$(".modal-body #editDescription").val(description);
	},
});