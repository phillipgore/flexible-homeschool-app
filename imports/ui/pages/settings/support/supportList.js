import {Template} from 'meteor/templating';
import './supportList.html';

Template.supportList.onCreated( function() {
	DocHead.setTitle('Settings: Support: View');
});

Template.supportList.onRendered( function() {
	Session.set({
		toolbarType: 'support',
		labelTwo: 'Support',
		activeNav: 'settingsList',
	});
});