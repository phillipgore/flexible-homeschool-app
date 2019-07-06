import {Template} from 'meteor/templating';

import './officeAccountsSubbar.html';
import _ from 'lodash';

let statusOptionProperties = [
	{_id: 'all', label: 'All Status', colorClass: 'txt-success all'},
	{_id: 'online', label: 'Online', colorClass: 'txt-harvest-light'},
	{_id: 'active', label: 'Active', colorClass: 'txt-success'},
	{_id: 'pausePending', label: 'Pause Pending', colorClass: 'txt-warning-dark'},
	{_id: 'paused', label: 'Paused', colorClass: 'txt-gray-darker'},
	{_id: 'error', label: 'Error', colorClass: 'txt-danger'},
	{_id: 'freeTrial', label: 'Free Trial', colorClass: 'txt-royal'},
	{_id: 'freeTrialExpired', label: 'Free Trial Expired', colorClass: 'txt-royal expired'},
];

Template.officeAccountsSubbar.onCreated( function() {
	const template = Template.instance();

	template.autorun(() => {
		Meteor.call('getInitialGroupIds', function(error, result) {
			Session.set('initialGroupIds', result)
		});
	});
});

Template.officeAccountsSubbar.helpers({
	getInitialGroupId: function(status) {
		return Session.get('initialGroupIds')[status] && Session.get('initialGroupIds')[status];
	},

	statusOptions: function() {
		return statusOptionProperties;
	},

	selectedStatusId: function() {
		return FlowRouter.getParam('selectedStatusId');
	},

	selectedStatusLabel: function(_id) {
		return _.find(statusOptionProperties, ['_id', _id]).label;
	},

	selectedGroupId: function() {
		return FlowRouter.getParam('selectedGroupId')
	},

	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});