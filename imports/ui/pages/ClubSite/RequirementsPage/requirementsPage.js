import { Template } from 'meteor/templating';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';

import './requirementsPage.html';

Template.requirementsPage.events({
	'submit .requirementForm'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		var requirementName = document.getElementById('requirementName').value;
		var totalNeeded = document.getElementById('totalNeeded').value;
		var description = document.getElementById('description').value;

		var ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		Meteor.call('requirements.insert', requirementName, description, totalNeeded, ClubSiteId);

		// hide the modal/clear form
		$('#addRequirementModal').modal('hide');
		$('#addRequirementModal').find('form')[0].reset();
	}
})