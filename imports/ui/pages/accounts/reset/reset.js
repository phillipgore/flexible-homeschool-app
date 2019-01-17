import {Template} from 'meteor/templating';
import './reset.html';

Template.reset.onRendered( function() {
	let template = Template.instance();
	
	$('.form-reset').validate({
		rules: {
			email: { required: true, email: true },
		},
		messages: {
			email: { required: "Required.", email: "Please enter a valid email address." },
		},
		submitHandler() {
			$('.js-sending').show();
			$('.js-submit').prop('disabled', true);

			const email = template.find("[name='email']").value.trim();
			
			Accounts.forgotPassword({email: email}, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
					
					$('.js-sending').hide();
					$('.js-submit').prop('disabled', false);
				} else {
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