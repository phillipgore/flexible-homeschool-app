import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './usersEach.html';

Template.usersEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.usersEach.onRendered( function() {
	
});

Template.usersEach.helpers({
	scroll: function() {
		if (Session.get('unScrolled') && Meteor.users.find({_id: FlowRouter.getParam('selectedUserId')}).count()) {
			setTimeout(function() {
				let newScrollTop = document.getElementById(FlowRouter.getParam('selectedUserId')).getBoundingClientRect().top - 130;
				if (window.screen.availWidth > 640) {
					document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
				}
				Session.setPersistent('unScrolled', false);
				return false;
			}, 100);
		}
	},

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
