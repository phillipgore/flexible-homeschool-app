import {Template} from 'meteor/templating';
import './toolbarView.html';

Template.toolbarView.helpers({
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
})