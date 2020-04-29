import {Template} from 'meteor/templating';
import {Groups} from '../../../../api/groups/groups.js';
import './officeAccountsEach.html';

Template.officeAccountsEach.onRendered( function() {
	let newScrollTop = document.getElementById(FlowRouter.getParam('selectedGroupId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-one')[0].scrollTop = newScrollTop;
	}
});

Template.officeAccountsEach.helpers({
	selectedStatusId: function() {
		return FlowRouter.getParam('selectedStatusId');
	},

	userName: function(groupId) {
		let user = Meteor.users.findOne({'info.groupId': groupId}, {sort: {createdAt: 1}}) && Meteor.users.findOne({'info.groupId': groupId}, {sort: {createdAt: 1}});
		return user.info.firstName +' '+ user.info.lastName;
	},

	userEmail: function(groupId) {
		let user = Meteor.users.findOne({'info.groupId': groupId}, {sort: {createdAt: 1}}) && Meteor.users.findOne({'info.groupId': groupId}, {sort: {createdAt: 1}});
		return user.emails[0].address;
	},

	userIsAppAdmin: function(groupId) {
		let user = Meteor.users.findOne({'info.groupId': groupId}, {sort: {createdAt: 1}}) && Meteor.users.findOne({'info.groupId': groupId}, {sort: {createdAt: 1}});
		if (user.info.role === 'Application Administrator') {
			return true;
		}
		return false;
	},

	subscriptionStatus: function (groupId) {
		let subscriptionStatus = Groups.findOne({_id: groupId}).subscriptionStatus;
		if (subscriptionStatus === 'pausePending') {
			return 'txt-warning';
		}
		if (subscriptionStatus === 'paused') {
			return 'txt-gray-darker';
		}
		if (subscriptionStatus === 'error') {
			return 'txt-danger';
		}
		if (subscriptionStatus === 'freeTrial') {
			return 'txt-royal';
		}
		if (subscriptionStatus === 'freeTrialExpired') {
			return 'txt-royal expired';
		}
		return 'txt-info';
	},

	active: function(groupId) {
		if (FlowRouter.getParam('selectedGroupId') === groupId) {
			return true;
		}
		return false;
	}
});





