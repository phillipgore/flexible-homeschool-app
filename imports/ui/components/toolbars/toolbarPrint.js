import {Template} from 'meteor/templating';
import './toolbarPrint.html';

Template.toolbarPrint.helpers({
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

Template.toolbarPrint.events({
	'click .js-print'(event) {
		event.preventDefault();

		window.print();
		return false;		
	},
});