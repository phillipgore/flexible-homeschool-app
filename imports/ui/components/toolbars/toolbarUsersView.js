import {Template} from 'meteor/templating';
import './toolbarUsersView.html';

Template.toolbarUsersView.helpers({
	backButton: function() {
		if (Session.get('selectedFramePosition') === 1) {
			return false;
		}
		return true;
	},
	label() {
		return Session.get('label');
	},
	editUrl() {
		return Session.get('editUrl');
	},
	deleteClass() {
		return Session.get('deleteClass');
	},
	pauseClass() {
		return Session.get('pauseClass');
	},
	unpauseClass() {
		return Session.get('unpauseClass');
	},
})