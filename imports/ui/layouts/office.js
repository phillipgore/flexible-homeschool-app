import {Template} from 'meteor/templating';
import './office.html';

Template.office.onRendered( function() {
	$('.loading-initializing').fadeOut('fast', function() {
		$(this).remove();
	});
});

Template.office.helpers({
	windowHeight: function() {
		return Session.get('windowHeight');
	},

	windowWidth: function() {
		return Session.get('windowWidth');
	},

	alerts: function() {
		return Alerts.find();
	},

	dialog: function() {
		return Dialogs.findOne();
	},

	selectedFrameClass: function() {
		return Session.get('selectedFrameClass')
	},
});