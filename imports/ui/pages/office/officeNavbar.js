import {Template} from 'meteor/templating';
import './officeNavbar.html';

Template.officeNavbar.onCreated( function() {
	const template = Template.instance();

	template.autorun(() => {
		Meteor.call('getInitialGroupIds', function(error, result) {
			Session.set('initialGroupIds', result)
		});
	});
	Session.set('selectedStatusId', 'online')
});

Template.officeNavbar.helpers({
	getInitialGroupId: function(status) {
		return Session.get('initialGroupIds')[status] && Session.get('initialGroupIds')[status];
	},
	
	selectedGroupId: function() {
		return Session.get('selectedGroupId') && Session.get('selectedGroupId');
	},
});

Template.officeNavbar.events({
	'click .js-btn-nav'(event) {
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');
	},
});