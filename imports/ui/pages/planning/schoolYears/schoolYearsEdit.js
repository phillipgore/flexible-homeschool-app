import {Template} from 'meteor/templating';
import './schoolYearsEdit.html';

Template.schoolYearsEdit.onCreated( function() {
	
});

Template.schoolYearsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Edit School Year',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.schoolYearsEdit.helpers({
	cancelPath: function() {
		return '/planning/schoolyears/view/' + FlowRouter.getParam('id');
	},
});

Template.schoolYearsEdit.events({
	
});









