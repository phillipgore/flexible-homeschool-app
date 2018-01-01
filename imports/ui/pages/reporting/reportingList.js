import {Template} from 'meteor/templating';
import './reportingList.html';

Template.reportingList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Reporting',
		rightUrl: '/reporting/new',
		rightIcon: 'fss-new',
	});

	// Navbar Settings
	Session.set('activeNav', 'reportingList');
});