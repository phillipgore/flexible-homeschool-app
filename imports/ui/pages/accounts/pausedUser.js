import {Template} from 'meteor/templating';
import './pausedUser.html';


Template.pausedUser.events({
	'click .js-sign-out'(event) {
		event.preventDefault();
		$('.js-signing-out').show();
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				$('.js-signing-out').hide();
				FlowRouter.go("/sign-in");
			}
		});
	},
});