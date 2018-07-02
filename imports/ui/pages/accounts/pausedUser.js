import {Template} from 'meteor/templating';
import './pausedUser.html';


Template.pausedUser.events({
	'click .js-sign-out'(event) {
		event.preventDefault();
		$('.js-loading-signing-out').show();
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go("/sign-in");
			}
		});
	},
});