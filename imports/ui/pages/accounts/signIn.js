import {Template} from 'meteor/templating';
import './signIn.html';

Template.signIn.onCreated( function() {
	DocHead.setTitle('Sign In');
});

Template.signIn.onRendered( function() {
	let template = Template.instance();

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
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			const email = template.find("[name='email']").value.trim();
			const password = template.find("[name='password']").value.trim();

			Meteor.loginWithPassword (email, password, function(error) {
				if (error) {
					if (error.reason === 'unverified') {
						FlowRouter.go('/verify/sent');
					} else {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.reason + '.',
						});
					
						$('.js-saving').hide();
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