import {Template} from 'meteor/templating';
import './usersVerifySent.html';

Template.usersVerifySent.onRendered( function() {
	// Toolbar Settings
	Session.set({
		label: 'New User',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});