import { Template } from 'meteor/templating';
import { InviteCodes } from '../../../database/inviteCodes.js';
import { Members } from '../../../database/members.js';
import { Clubs } from '../../../database/clubs.js';

import './inviteCodePage.html';

Template.inviteCodePage.events({
	'click .inviteBtn': function(event, error) {
		event.preventDefault();

		var inviteCode = document.getElementById('inviteCode').value;
		var inviteMatch = InviteCodes.findOne({inviteCode: inviteCode});

		// check if the invite hasn't been used yet
		if (inviteMatch !== null) {
			var clubId = inviteMatch.clubId;
			var clubName = Clubs.findOne({_id: clubId}).clubName;
			var member = Members.findOne({clubId: clubId, userId: Meteor.userId()});
			//console.log(member);

			// check if the person isn't already a member
			if ( member ) {
				swal('You are already a member of ' + clubName + '!', '', 'error');
			}
			else {
				var firstName = Meteor.user().profile.firstName;
				var lastName = Meteor.user().profile.lastName;
				var email = Meteor.user().emails[0].address;
				var phoneNumber = Meteor.user().profile.phoneNumber;

				// add person to the club as a new member
				Meteor.call('members.insert', 
					Meteor.userId(),
					firstName, 
					lastName, 
					email, 
					phoneNumber, 
					'Active', 
					'General Member', 
					clubId,
					false
				);

				// invite code has been used--delete it
				Meteor.call('inviteCodes.remove', inviteCode);

				swal('You are now a member of ' + clubName + '!', '', 'success');
			}
		}
		else {
			swal('This invite code has already been used!', '', 'error');
		}
	}
});