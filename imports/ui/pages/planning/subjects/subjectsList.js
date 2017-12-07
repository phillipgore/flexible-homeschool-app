import {Template} from 'meteor/templating';
import './subjectsList.html';

Template.subjectsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: 'Subjects',
		rightUrl: '/planning/subjects/new',
		rightIcon: 'fss-btn-new',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});