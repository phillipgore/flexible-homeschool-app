import {Template} from 'meteor/templating';
import './officeDashboard.html';

Template.officeDashboard.onRendered( function() {
	Session.set({
		labelOne: 'Dashboard',
	});
});