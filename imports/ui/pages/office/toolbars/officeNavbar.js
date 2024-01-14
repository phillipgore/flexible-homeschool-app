import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './officeNavbar.html';

Template.officeNavbar.onCreated( function() {
	const template = Template.instance();

	template.autorun(() => {
		Meteor.call('getInitialGroupIds', function(error, result) {
			Session.set('initialGroupIds', result)
		});
		Meteor.call('getInitialQuestionId', function(error, result) {
			Session.set('selectedQuestionId', result);
		});
	});
	Session.set('selectedStatusId', 'online')
});

Template.officeNavbar.helpers({
	getInitialGroupId: function(status) {
		if (Session.get('initialGroupIds')) {
			return Session.get('initialGroupIds')[status] && Session.get('initialGroupIds')[status];
		}
	},
	
	selectedGroupId: function() {
		return Session.get('selectedGroupId') && Session.get('selectedGroupId');
	},

	selectedQuestionId: function() {
		return Session.get('selectedQuestionId') && Session.get('selectedQuestionId');
	},

	isActiveRoute: function(route) {
		if (FlowRouter.getRouteName().startsWith(route)) return 'active';
		return null;

	}
});

Template.officeNavbar.events({
	'click .js-btn-nav'(event) {
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');
	},
});