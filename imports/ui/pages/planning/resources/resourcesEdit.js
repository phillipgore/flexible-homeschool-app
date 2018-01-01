import {Template} from 'meteor/templating';
import './resourcesEdit.html';

Template.resourcesEdit.onCreated( function() {
	
});

Template.resourcesEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Edit Resource',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.resourcesEdit.helpers({
	cancelPath: function() {
		return '/planning/resources/view/' + FlowRouter.getParam('id');
	},
});

Template.resourcesEdit.events({
	
});









