import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesId.html';

Template.resourcesId.onCreated( function() {
	// Subscriptions
	this.subscribe('resource', FlowRouter.getParam('id'));
});

Template.resourcesId.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/resources/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: '',
		rightUrl: '',
		rightIcon: 'fss-btn-settings',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.resourcesId.helpers({
	resource: function() {
		return Resources.findOne({_id: FlowRouter.getParam('id')});
	},
	
	dynamicToolbarLabel: function() {
		let resouce = Resources.findOne({_id: FlowRouter.getParam('id')});
		return resouce && resouce.title;
	},

	availabilityStatment: function(availability) {
		if (availability === 'own') {
			return 'I have it.'
		}
		if (availability === 'library') {
			return 'The Library has it.'
		}
		return 'I need it.'
	}
});