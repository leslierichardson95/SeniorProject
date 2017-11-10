import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
//import { Clubs } from '../database/clubs.js';

import './clubSiteSideNav.html';

// Template.clubSiteNavbar.onRendered(function() {

// });

Template.clubSiteSideNav.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }
});