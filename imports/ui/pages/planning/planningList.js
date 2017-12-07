import {Template} from 'meteor/templating';
import './planningList.html';

Template.planningList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Planning',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.planningList.helpers({
	items: [
		{divider: false, classes: '', icon: 'fss-list-students', label: 'Students', url: '/planning/students/list'},
		{divider: false, classes: '', icon: 'fss-list-schoolyears', label: 'School Years', url: '/planning/schoolyears/list'},
		{divider: false, classes: '', icon: 'fss-list-resources', label: 'Resources', url: '/planning/resources/list'},
		{divider: false, classes: '', icon: 'fss-list-subjects', label: 'Subjects', url: '/planning/subjects/list'},
	]
});