import {Template} from 'meteor/templating';
import './subjectsEdit.html';

Template.subjectsEdit.onCreated( function() {
	
});

Template.subjectsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Edit Subject',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.subjectsEdit.helpers({
	
});

Template.subjectsEdit.events({
	
});









