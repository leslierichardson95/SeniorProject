import { Template } from 'meteor/templating';

import { Members } from '../../../../database/members.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';

import './membersTable.html';

var ClubSiteId; 
Template.membersTable.helpers({
	members() {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		return Members.find({clubId: ClubSiteId});
	},
});

Template.member.helpers({
	isAdmin: function() {
		return Members.findOne({userId: Meteor.userId(), clubId: ClubSiteId}).admin;
	},
});

var rowID;
Template.member.events({
	'click .editBtn'() {
		rowID = this._id;

		// Get corresponding current requirement info 
		var status = this.status;
		var position = this.position;

		if (status === "Admin/Active") {
			document.getElementById('editStatus').disabled = true;
		}

		// Insert current requirement values into the edit modal
		$(".modal-body #editStatus").val(status);
		$(".modal-body #editPosition").val(position);
	},
	'click .updateBtn' (event) {
		event.preventDefault();

		var newStatus = document.getElementById('editStatus').value;
		var newPosition = document.getElementById('editPosition').value;

		Meteor.call('members.updateStatus', rowID, newStatus);
		Meteor.call('members.updatePosition', rowID, newPosition);

		// hide the modal
		$('#editMemberModal').modal('hide');
	},

	'click .deleteBtn'() {
		if (Members.findOne({clubId: ClubSiteId, _id: this._id}).admin) {
			swal("You are an admin!  Please make someone else the club administrator before deleting yourself.", '','error');
		}
		else {
			Meteor.call('requirements.remove', this._id, this.requirementName, ClubSiteId);
		}
    	
	},
});