import { Template } from 'meteor/templating';
import { Clubs } from '../database/clubs.js';
import { Members } from '../database/members.js';
import { Announcements } from '../database/announcements.js';
import { Events } from '../database/events.js';
import { ClubSiteIds } from '../database/clubSiteIds.js';

import './post.html';

Template.clubPostsTable.helpers({
	clubPosts: function() {
		// get all clubs the user is a part of 
		Members.join(Clubs, "clubId", "club", ["clubName", "clubDescription", "creationDate"]);
		var usersClubIds = Members.find({userId: Meteor.userId()},{"club._id":1}).fetch();
		// map array to club ids
		usersClubIds = usersClubIds.map(function(x) {return x.club._id});

		Announcements.join(Clubs, "clubId", "club", ["clubName"]);
		return Announcements.find({ clubId:{$in: usersClubIds} }, {sort: {datePosted: -1}}, {limit: 10}).fetch();

	}
});