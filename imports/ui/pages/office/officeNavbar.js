import {Template} from 'meteor/templating';
import './officeNavbar.html';

Template.officeNavbar.onCreated( function() {
	Meteor.call('getInitialGroupIds', function(error, result) {
		Session.set('initialGroupIds', result)
	});
});

Template.officeNavbar.helpers({
	getInitialGroupId: function(status) {
		console.log(Session.get('initialGroupIds'))
		return Session.get('initialGroupIds')[status];
	},
	
	selectedGroupId: function() {
		return Session.get('selectedGroupId');
	},
});

Template.officeNavbar.events({
	'click .js-btn-nav'(event) {
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');
	},
});