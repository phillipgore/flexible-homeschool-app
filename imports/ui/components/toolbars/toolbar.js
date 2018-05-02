import {Template} from 'meteor/templating';
import './toolbar.html';

Template.toolbar.helpers({
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