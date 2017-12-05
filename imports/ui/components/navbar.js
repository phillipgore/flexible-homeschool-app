import {Template} from 'meteor/templating';
import './navbar.html';

Template.navbar.helpers({
	active(nav) {
		if (Session.get('activeNav') ===  nav) {
			return 'active';
		}
		return;
	}
});