import {Groups} from '../../api/groups/groups.js';
import '../../api/groups/methods.js';

import md5 from 'md5';

process.env.MAIL_URL = Meteor.settings.private.mailUrl;

Meteor.methods({
	insertUser: function(userProperties) {
		let userId = Accounts.createUser(userProperties);
		return userId
	},

	sendVerificationEmail: function(userId, email) {
		Accounts.sendVerificationEmail(userId, email);
		return userId
	},
});

Accounts.config({
  sendVerificationEmail: true,
});

Accounts.emailTemplates = {
	from: 'Flexible Homeschool App <no-reply@aflexiblehomeschool.com>',
	siteName: 'Flexible Homeschool App',

	resetPassword: {
		subject: function(user, url) {
			return 'Reset your password for ' + Accounts.emailTemplates.siteName + '.';
		},
		text: function(user, url) {
			url = url.replace('#/reset-password/', 'reset/password/')
			firstName = user.info.firstName
			return firstName + ',\n\n Sorry you forgot your password. Click the link below (or copy and paste into your browser) and we’ll help you get a new one.\n\n\t' + url + '\n\nIf you didn\'t request a password reset, please ignore this email. \n\nThanks.';
	    }
	},

	verifyEmail: {
		subject: function(user, url) {
			return 'Please verify email address for ' + Accounts.emailTemplates.siteName + '.';
		},
		text: function(user, url) {
			url = url.replace('#/verify-email/', 'verify/email/')
			firstName = user.info.firstName
			return firstName + ',\n\n Welcome to Flexible School Schedule. We need to verify your email address to complete your signup. Please click the verification link below (or copy and paste into your browser).\n\n\t' + url + '\n\nIf you have not signed up for Flexible School Schedule, please ignore this email. \n\nThanks.';
		}
	}
};

Accounts.onCreateUser((options, user) => {
	if (options.info) {
		user.info = options.info;
	}
	if (options.group) {
		user.group = options.group;
	}
	if (options.status) {
		user.status = options.status;
	}
	if (options.reportSettings) {
		user.reportSettings = options.reportSettings;
	}

	let mcSubscriptionProperties = {
		email: options.email,
		emailHash: md5(options.email),
		firstName: options.info.firstName,
		lastName: options.info.lastName
	};

	Meteor.call('mcSubscription', mcSubscriptionProperties);

	return user;
});

Accounts.validateLoginAttempt(function(login) {
	if (login.user && login.user.emails && !login.user.emails[0].verified ) {
		throw new Meteor.Error(500, 'unverified');
	}
	return true;
});











