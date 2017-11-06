import { Template } from 'meteor/templating';
import { Clubs } from '../../../database/clubs.js'; 

import './myClubsPage.html';

Template.myClubsPage.events({
	'submit .clubForm'(event) {
		event.preventDefault();

		var clubName = document.getElementById('clubName').value;
		var clubDescription = document.getElementById('clubDescription').value;
		
		Meteor.call('clubs.insert', clubName, clubDescription, this.userId);

		$('#clubCreationModal').modal('hide');
		$('#clubCreationModal').find('form')[0].reset();
	}
});