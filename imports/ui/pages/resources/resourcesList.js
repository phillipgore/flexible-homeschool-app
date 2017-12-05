import {Template} from 'meteor/templating';
import './resourcesList.html';

Template.resourcesList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Resources',
		rightUrl: '/resoures/new',
		rightIcon: 'fss-btn-new',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'resourcesList');
});