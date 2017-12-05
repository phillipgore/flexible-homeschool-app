import {Template} from 'meteor/templating';
import './toolbar.html';

Template.toolbar.helpers({
	leftUrl() {
		return Session.get('leftUrl');
	},
	leftIcon() {
		return Session.get('leftIcon');
	},
	leftCaret() {
		return Session.get('leftCaret');
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
	rightCaret() {
		return Session.get('rightCaret');
	},
})