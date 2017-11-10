import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Requirements = new Mongo.Collection('requirements');

Meteor.methods({
	'requirements.insert'(requirementName, requirementDescription, totalNeeded, clubId) {

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		Requirements.insert({
			requirementName,
			totalNeeded,
			requirementDescription,
			clubId
		});

		Meteor.call('members.addRequirement', requirementName, clubId);
	},

	'requirements.update'(requirementId, oldRequirementName, newRequirementName, newDescription, newTotalNeeded, clubSiteId) {
		Requirements.update(requirementId, { $set: {"requirementName": newRequirementName } });
		Requirements.update(requirementId, { $set: {"requirementDescription": newDescription } });
		Requirements.update(requirementId, { $set: {"totalNeeded": newTotalNeeded } });

		Meteor.call('members.updateRequirement', oldRequirementName, newRequirementName, clubSiteId);
	},

	'requirements.remove'(requirementId, requirementName, clubSiteId) {
		check(requirementId, String);
		Meteor.call('members.removeRequirement', requirementName, clubSiteId);
		Requirements.remove(requirementId);
	}
});