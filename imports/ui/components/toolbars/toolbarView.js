import {Template} from 'meteor/templating';
import './toolbarView.html';

Template.toolbarView.helpers({
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
})