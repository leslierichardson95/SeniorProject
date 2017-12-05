import { Template } from 'meteor/templating';
import { Requirements } from '../../../../database/requirements.js';
import { Events } from '../../../../database/events.js';
import { ClubSiteIds } from '../../../../database/clubSiteIds.js';

import './eventsCalendar.html';

let isPast = (date) => {
	let today = moment().format();
	return moment(today).isAfter(date);
};

var ClubSiteId;
Template.eventsCalendar.onRendered( () => {
	$('#events-calendar').fullCalendar({
		events(start, end, timezone, callback) {
			ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
			let data = Events.find({clubId: ClubSiteId}).fetch().map( (event) => {
				event.editable = !isPast(event.start);
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
		eventDrop( event, delta, revert ) {
	      let date = event.start.format();
	      if ( !isPast( date ) ) {
	        let update = {
	          _id: event._id,
	          start: date,
	          //end: date
	        };

	        Meteor.call( 'events.update', update, ( error ) => {
	          if ( error ) {
	            Bert.alert( error.reason, 'danger' );
	          }
	        });
	      } else {
	        revert();
	        Bert.alert( 'Sorry, you can\'t move items to the past!', 'danger' );
	      }
	    },
		dayClick(date) {
			Session.set('eventModal', { type: 'add', date: date.format() } );
			$('#add-edit-event-modal').modal('show');
		},
		eventClick(event) {
			Session.set('eventModal', { type: 'edit', event: event._id } );
			$('#add-edit-event-modal').modal('show');
		}
	});

	Tracker.autorun( () => {
		ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
		Events.find({clubId: ClubSiteId}).fetch();
		$('#events-calendar').fullCalendar('refetchEvents');
	});
});

Template.addEditEventModal.helpers({
  requirements() {
  	ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
    return Requirements.find({clubId: ClubSiteId});
  },

  modalType( type ) {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === type;
    }
  },
  modalLabel() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return {
        button: eventModal.type === 'edit' ? 'Edit' : 'Add',
        label: eventModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  selected( v1, v2 ) {
    return v1 === v2;
  },
  event() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return eventModal.type === 'edit' ? Events.findOne( eventModal.event ) : {
        start: eventModal.date,
        //end: eventModal.date
      };
    }
  }
});

Template.addEditEventModal.events({
  'submit form' ( event, template ) {
    event.preventDefault();
    ClubSiteId = ClubSiteIds.findOne({clubIdUser: Meteor.userId()}).clubId;
    console.log(template.find('[name="eventValue"]').value);
    var eventValue = template.find('[name="eventValue"]').value;
    if (eventValue === null || eventValue === undefined || eventValue === '') {
      eventValue = 0;
    }
    console.log(eventValue);
    let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'events.update' : 'events.insert',
        eventItem  = {
          title: template.find( '[name="eventName"]' ).value,
          description: template.find('[name="description"]').value,
          start: template.find( '[name="date"]' ).value,
          sTime: template.find( '[name="sTime"]' ).value,
          eTime: template.find( '[name="eTime"]').value,
          location: template.find('[name="location"]').value,
          eventType: template.find( '[name="eventType"] option:selected' ).value,
          eventValue: eventValue,
          attendees: [],
          clubId: ClubSiteId,
          eventCreator: Meteor.userId()
        };

    if ( submitType === 'events.update' ) {
      eventItem._id   = eventModal.event;
    }

    Meteor.call( submitType, eventItem, ( error ) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        Bert.alert( `Event ${ eventModal.type }ed!`, 'success' );
        closeModal();
      }
    });
  },

  'click .delete-event' (event, template) {
  	let eventModal = Session.get('eventModal');
  	if (confirm('Are you sure?  This is permanent.')) {
  		Meteor.call('events.remove', eventModal.event, (error) => {
  			if (error) {
  				Bert.alert(error.reason, 'danger');
  			}
  			else {
  				Bert.alert('Event deleted!', 'success');
  				closeModal();
  			}
  		});
  	}
  }

});

let closeModal = () => {
  $( '#add-edit-event-modal' ).modal( 'hide' );
  $( '.modal-backdrop' ).fadeOut();
};