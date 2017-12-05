import {Template} from 'meteor/templating';
import './reportsList.html';

Template.reportsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Reports',
		rightUrl: '/reports/new',
		rightIcon: 'fss-btn-new',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'reportsList');
});