import {Template} from 'meteor/templating';
import './toolbarSmall.html';

Template.toolbarSmall.helpers({
	test: function() {
		return Session.get('selectedFramePosition');
	},

	backButton: function() {
		if (Session.get('selectedFramePosition') === 1 || Session.get('selectedFramePosition') === 2) {
			return false;
		}
		return true;
	},
})