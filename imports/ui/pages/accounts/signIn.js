import {Template} from 'meteor/templating';
import './signIn.html';

Template.signIn.onRendered( function() {
	$('.js-form-sign-in').validate({
		rules: {
			email: { required: true, email: true },
			password: { required: true },
		},
		messages: {
			email: { required: "Required.", email: "Please enter a valid email address." },
			password: { required: "Required." },
		},
		submitHandler() {
			$('input').blur();
			$('.js-loading').show();
			$('.js-submit').prop('disabled', true);

			const email = event.target.email.value.trim();
			const password = event.target.password.value.trim();

			Meteor.loginWithPassword (email, password, function(error) {
				if (error) {
					if (error.reason === 'unverified') {
						FlowRouter.go('/verify/sent');
					} else {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason + '.',
						});
					
						$('.js-loading').hide();
						$('.js-submit').prop('disabled', false);
					}
				} else {
					FlowRouter.go('/');
				}
			});

			return false;
		}
	});
});

Template.signIn.helpers({

});

Template.signIn.events({
	'submit .js-form-sign-in'(event) {
		event.preventDefault();
	}
});