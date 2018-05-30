import {Template} from 'meteor/templating';
import './supportList.html';

Template.supportList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		toolbarType: 'support',
		editUrl: '',
		label: 'Support',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});