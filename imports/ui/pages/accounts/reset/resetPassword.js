import {Template} from 'meteor/templating';
import './resetPassword.html';

Template.resetPassword.onCreated( function() {
	DocHead.setTitle('Reset Password');
});

Template.resetPassword.onRendered( function() {
	let template = Template.instance();
	
	$('.js-form-reset-password').validate({
		rules: {
			password: { required: true },
			retypePassword: { required: true, equalTo: "#password" },
		},
		messages: {
			password: { required: "Required." },
			retypePassword: { required: "Required.", equalTo: "Passwords do not match." },
		},
		submitHandler() {
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);
	
			const password = template.find("[name='password']").value.trim();

			Accounts.resetPassword(FlowRouter.getParam('token'), password, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					FlowRouter.go('/reset/success');
				}
			});

			return false;
		}
	});
});

Template.resetPassword.events({
	'submit .js-form-reset-password'(event) {
		event.preventDefault();
	},
});