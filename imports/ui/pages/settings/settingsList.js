import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Groups} from '../../../api/groups/groups.js';
import moment from 'moment';
import _ from 'lodash'
import './settingsList.html';

Template.settingsList.onCreated( function() {
	// Subscriptions
	let template = Template.instance();
	
	template.autorun(() => {
		this.groupData = Meteor.subscribe('group');
	});
});

Template.settingsList.onRendered( function() {
	Session.set({
		labelOne: 'Settings',
		activeNav: 'settingsList',
	});
});

Template.settingsList.helpers({
	subscriptionReady: function() {
		if (Template.instance().groupData.ready()) {
			return true;
		}
		return false;
	},

	user: function() {
		return Meteor.users.findOne();
	},

	userRestricted: function(role) {
		if (role === 'Observer' || role === 'User' || role === 'Application Administrator' || role === 'Developer') {
			return true;
		}
		return false;
	},

	applicationAdministrator: function(role) {
		if (role === 'Application Administrator') {
			return true;
		}
		return false;
	},

	developerOrApplicationAdministrator: function(role) {
		if (role === 'Application Administrator' || role === 'Developer') {
			return true;
		}
		return false;
	},

	group: function() {
		return Groups.findOne({});
	},

	freeTrial: function(status) {
		if (status === 'freeTrial') {
			return true;
		}
		return false;
	},

	groupPaused: function(status) {
		if (status === 'paused') {
			return true;
		}
		return false;
	},

	selectedUserId: function() {
		return Session.get('selectedUserId');
	},

	billingPath: function() {
		return Session.get('billingPath');
	},

	active: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},
});

Template.settingsList.events({
	'click .js-restricted '(event) {
		let role = $(event.currentTarget).attr('data-role');
		let section = $(event.currentTarget).attr('data-section');
		function message(role) {
			if (role ==='Application Administrator' || role === 'Developer') {
				return 'Your role of "' + role + '" does not currently have this functionality.'
			}
			return 'Your role of "' + role + '" does not allow access to the ' + _.capitalize(section) + ' section.'
		}
		Alerts.insert({
			colorClass: 'bg-info',
			iconClass: 'icn-info',
			message: message(role),
		});
	},

	'click .js-paused '(event) {
		let subscriptionPausedOn = moment(Groups.findOne({}).subscriptionPausedOn).format('MMMM D, YYYY');
		Alerts.insert({
			colorClass: 'bg-info',
			iconClass: 'icn-info',
			message: `Your account is paused. You are no longer being billed. You will have access to your data until ${subscriptionPausedOn}. You may unpause your account at any time.`,
		});
	},

	'click .js-reset-password'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'You will be logged out and taken to the reset Password form.',
			confirmClass: 'js-reset-password-confirmed',
		});
	},

	'click .js-sign-out'(event) {
		event.preventDefault();
		$('.js-signing-out').show();
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go("/sign-in");
			}
		});
	},
});