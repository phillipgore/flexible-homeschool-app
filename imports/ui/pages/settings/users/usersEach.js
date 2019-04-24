import {Template} from 'meteor/templating';
import './usersEach.html';

Template.usersEach.onRendered( function() {
	let resourcesScrollTop = document.getElementById(FlowRouter.getParam('selectedUserId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		Session.set('resourcesScrollTop', resourcesScrollTop);
		document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
	}
});

Template.usersEach.helpers({
	nonActive: function(pendingCount, pausedCount) {
		if (pendingCount || pausedCount) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedUserId') === id) {
			return true;
		}
		return false;
	},
});
