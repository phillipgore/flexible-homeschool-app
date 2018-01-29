import {Template} from 'meteor/templating';
import './toolbarUsersView.html';

Template.toolbarUsersView.helpers({
	leftUrl() {
		return Session.get('leftUrl');
	},
	leftIcon() {
		return Session.get('leftIcon');
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