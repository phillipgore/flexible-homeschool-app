import {Template} from 'meteor/templating';
import './reset.html';

Template.reset.onRendered( function() {
	$('.form-reset').validate({
		rules: {
			email: { required: true, email: true },
		},
		messages: {
			email: { required: "Required.", email: "Please enter a valid email address." },
		},
		submitHandler() {
			const email = event.target.email.value.trim();
			
			Accounts.forgotPassword({email: email}, function(error){
				if (error)
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-icn-danger',
						message: error.reason,
					});
				else {
					FlowRouter.go('/reset/sent');
				}
			});

			return false;
		}
	});
});

Template.reset.helpers({

});

Template.reset.events({
	'submit .form-reset'(event) {
		event.preventDefault();
	}
});