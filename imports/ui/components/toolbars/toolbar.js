import {Template} from 'meteor/templating';
import './toolbar.html';

Template.toolbar.helpers({
	leftUrl() {
		return Session.get('leftUrl');
	},
	leftIcon() {
		return Session.get('leftIcon');
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