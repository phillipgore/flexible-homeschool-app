import {Template} from 'meteor/templating';
import './toolbarResources.html';

Template.toolbarResources.helpers({
	backButton: function() {
		if (Session.get('selectedFramePosition') === 1) {
			return false;
		}
		return true;
	},
	label() {
		return Session.get('label');
	},
});

Template.toolbarResources.events({
	'click .js-print'(event) {
		event.preventDefault();

		window.print();
		return false;		
	},
});