import {Template} from 'meteor/templating';
import './resourcesEdit.html';

Template.resourcesEdit.onCreated( function() {
	
});

Template.resourcesEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Edit Resource',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.resourcesEdit.helpers({
	
});

Template.resourcesEdit.events({
	
});









