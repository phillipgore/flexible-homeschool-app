import {Template} from 'meteor/templating';
import './schoolYearsEdit.html';

Template.schoolYearsEdit.onCreated( function() {
	
});

Template.schoolYearsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Edit School Year',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.schoolYearsEdit.helpers({
	
});

Template.schoolYearsEdit.events({
	
});









