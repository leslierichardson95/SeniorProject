import { Template } from 'meteor/templating';
import { Clubs } from '../../database/clubs.js';
import { Members } from '../../database/members.js';
import { Requirements } from '../../database/requirements.js';
import { Events } from '../../database/events.js';
import { ClubSiteIds } from '../../database/clubSiteIds.js';

import './CalPage.html';

let isPast = (date) => {
	let today = moment().format();
	return moment(today).isAfter(date);
};

var ClubSiteId;
Template.CalPage.onRendered( () => {

	$('#calendar').fullCalendar({
		events(start, end, timezone, callback) {
			// get all clubs the user is a part of 
			Members.join(Clubs, "clubId", "club", ["clubName", "clubDescription", "creationDate"]);
			var usersClubIds = Members.find({userId: Meteor.userId()},{"club._id":1}).fetch();
			// map array to club ids
			usersClubIds = usersClubIds.map(function(x) {return x.club._id});
			// query all events the user is a part of (aka find all events containing a club id the user is a part of)
			let data = Events.find({ clubId:{$in: usersClubIds} }).fetch().map( (event) => {
				//event.editable = !isPast(event.start);
				return event;
			});

			if (data) {
				callback(data);
			}
		},

		eventRender(event, element) {
			element.find('.fc-content').html(
				`<h4>${ event.title }</h4>
				<p class="time">${ event.sTime } - ${event.eTime} </p>
				<p class="location">${event.location} </p>
				<p class="eventType-${ event.eventType }">#${event.eventType} </p>
				`
			);
		},

	});

	Tracker.autorun( () => {
		//ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		// Events.join(Members, "clubId", "member", ["userId"]);
		// Events.find({"member.userId": Meteor.userId()}).fetch();
		$('#calendar').fullCalendar('refetchEvents');
	});
});
