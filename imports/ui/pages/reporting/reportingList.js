import {Template} from 'meteor/templating';
import './reportingList.html';

Template.reportingList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Reporting',
		rightUrl: '/reporting/new',
		rightIcon: 'fss-btn-new',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'reportingList');
});