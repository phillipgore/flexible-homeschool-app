import {Template} from 'meteor/templating';
import './studentsEdit.html';

Template.studentsEdit.onCreated( function() {
	
});

Template.studentsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Edit Student',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.studentsEdit.helpers({
	
});

Template.studentsEdit.events({
	
});









