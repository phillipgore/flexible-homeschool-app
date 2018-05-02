import {Template} from 'meteor/templating';
import './toolbarPrint.html';

Template.toolbarPrint.helpers({
	backButton: function() {
		if (Session.get('selectedFramePosition') === 1) {
			return false;
		}
		return true;
	},
	label() {
		return Session.get('label');
	},
	rightUrl() {
		return Session.get('rightUrl');
	},
	rightIcon() {
		return Session.get('rightIcon');
	},
})

Template.toolbarPrint.events({
	'click .js-print'(event) {
		event.preventDefault();

		window.print();
		return false;		
	},
});