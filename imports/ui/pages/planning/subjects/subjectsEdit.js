import {Template} from 'meteor/templating';
import './subjectsEdit.html';

Template.subjectsEdit.onCreated( function() {
	
});

Template.subjectsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Edit Subject',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.subjectsEdit.helpers({
	cancelPath: function() {
		return '/planning/subjects/view/' + FlowRouter.getParam('id');
	},
});

Template.subjectsEdit.events({
	
});









