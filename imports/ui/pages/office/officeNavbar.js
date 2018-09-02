import {Template} from 'meteor/templating';
import './officeNavbar.html';

Template.officeNavbar.helpers({
	
});

Template.officeNavbar.events({
	'click .js-btn-nav'(event) {
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');
	},
});