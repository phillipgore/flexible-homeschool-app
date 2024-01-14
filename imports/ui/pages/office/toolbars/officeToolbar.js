import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './officeToolbar.html';


Template.officeToolbar.helpers({
	backButton: function() {
		let windowWidth = Session.get('windowWidth');
		let type = Session.get('toolbarType');
		if (type === 'new' || type === 'edit') {
			return false;
		}
		if (windowWidth <= 768 && Session.get('selectedFramePosition') === 3) {
			return true;
		}
		if (windowWidth <= 480 && Session.get('selectedFramePosition') === 2) {
			return true;
		}
		return false;
	},

	labelOne() {
		return Session.get('labelOne');
	},

	labelTwo() {
		return Session.get('labelTwo');
	},

	labelThree() {
		return Session.get('labelThree');
	},

	windowHeight: function() {
		return Session.get('windowHeight');
	},

	windowWidth: function() {
		return Session.get('windowWidth');
	},

	alerts: function() {
		return Alerts.find();
	},

	dialog: function() {
		return Dialogs.findOne();
	},

	selectedFrameClass: function() {
		return Session.get('selectedFrameClass')
	},

	equal: function(itemOne, itemTwo) {
		if (itemOne === itemTwo) {
			return true;
		}
		return false;
	},
});


Template.officeToolbar.events({
	'click .js-btn-back'(event) {
		event.preventDefault();

		let framePositionIndex = FlowRouter.current().route.path.split( '/' ).indexOf(':selectedFramePosition');
		let framePosition = parseInt(FlowRouter.getParam('selectedFramePosition')) - 1;
		let pathArray = window.location.pathname.split( '/' )

		pathArray[framePositionIndex] = framePosition;
		let newPath = pathArray.join("/");

		FlowRouter.go(newPath)
	},
	
});