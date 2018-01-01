import {Template} from 'meteor/templating';
import './createAccount.html';

Template.createAccount.onRendered( function() {	
	$('.js-form-create-account').validate({
		rules: {
			firstName: { required: true },
			lastName: { required: true },
			email: { required: true, email: true },
			password: { required: true },
			retypePassword: { required: true, equalTo: "#password" },
			creditCard: { required: true, creditcard: true },
			cvc: { required: true, digits: true, minlength: 3, maxlength: 3 },
		},
		messages: {
			firstName: { required: "Required." },
			lastName: { required: "Required." },
			email: { required: "Required.", email: "Please enter a valid email address." },
			password: { required: "Required." },
			retypePassword: { required: "Required.", equalTo: "Passwords do not match." },
			creditCard: { required: "Required.", creditcard: "Please enter a valid credit card." },
			cvc: { required: "Required.", digits: "Invalid.", minlength: "Invalid.", maxlength: "Invalid." },
		},
		submitHandler() {	
			const user = {
				email: event.target.email.value.trim(),
				password: event.target.password.value.trim(),
				info: {
					firstName: event.target.firstName.value.trim(),
					lastName: event.target.lastName.value.trim(),
					relationshipToStudents: event.target.relationshipToStudents.value.trim(),
					groupId: new Mongo.ObjectID().toHexString(),
				}
			}

			Accounts.createUser(user, function(error) {
				if (error) {
					if (error.reason === 'unverified') {
						FlowRouter.go('/verify/sent');
					} else {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});
					}
				} else {
					FlowRouter.go('/verify/sent');
				}
			});

			return false;
		}
	});
});

Template.createAccount.helpers({
	relationships: [
		{label: 'I Am Mom', value: 'Mom'},
		{label: 'I Am Dad', value: 'Dad'},
		{label: 'I Am Brother', value: 'Brother'},
		{label: 'I Am Sister', value: 'Sister'},
		{label: 'I Am Tutor', value: 'Tutor'},
		{label: 'I Am Teacher', value: 'Teacher'},
		{label: 'I Am Grandma', value: 'Grandma'},
		{label: 'I Am Grandpa', value: 'Grandpa'},
		{label: 'I Am Aunt', value: 'Aunt'},
		{label: 'I Am Uncle', value: 'Uncle'},
	]
});

Template.createAccount.events({
	'click .js-show-coupon'(event) {
		$('.js-show-coupon').addClass('hide');
		$('.js-coupon').removeClass('hide').focus();
	},
	'submit .js-form-create-account'(event) {
		event.preventDefault();
	},
});