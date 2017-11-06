import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Requirements = new Mongo.Collection('requirements');

Meteor.methods({
	'requirements.insert'(requirementName, requirementDescription, totalNeeded) {
		check(requirementName, String);
		check(totalNeeded, String);
		check(description, String);

		if (!this.userId) { throw new Meteor.Error('not-authorized'); }

		Requirements.insert({
			requirementName,
			totalNeeded,
			requirementDescription
		});
	},

	'requirements.update'(requirementId, newRequirementName, newDescription, newTotalNeeded) {
		Requirements.update(requirementId, { $set: {"requirementName": newRequirementName } });
		Requirements.update(requirementId, { $set: {"requirementDescription": newDescription } });
		Requirements.update(requirementId, { $set: {"totalNeeded": newTotalNeeded } });
	},

	'requirements.remove'(requirementId) {
		check(requirementId, String);
		Requirements.remove(requirementId);
	}
});