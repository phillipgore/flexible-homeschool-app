import {Template} from 'meteor/templating';
import './officeDashboard.html';

Template.officeDashboard.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.subscribe('allAccountTotals')
	});
});

Template.officeDashboard.onRendered( function() {
	Session.set({
		labelOne: 'Dashboard',
	});
});