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

Accounts.emailTemplates.siteName = 'Flexible Homeschool App';
Accounts.emailTemplates.from = 'Flexible Homeschool App <no-reply@aflexiblehomeschool.com>';

Accounts.emailTemplates.resetPassword = {
	subject() {
		return 'Reset your password for ' + Accounts.emailTemplates.siteName + '.';
	},
	text(user, url) {
		url = url.replace('#/reset-password/', 'reset/password/');
		firstName = user.info.firstName;

		return firstName + ',\n\n Sorry you forgot your password. Click the link below (or copy and paste into your browser) and we’ll help you get a new one.\n\n\t' + url + '\n\nIf you didn\'t request a password reset, please ignore this email. \n\nThanks.';
    },
    html(user, url) {
    	SSR.compileTemplate('resetPasswordEmail', Assets.getText('resetPasswordEmail.html'));

		console.log(url);
		url = url.replace('#/reset-password/', 'reset/password/');
		firstName = user.info.firstName;
		console.log(url);

    	const html = SSR.render('resetPasswordEmail', { url, user });
		return html;
    }
};

Accounts.emailTemplates.verifyEmail = {
	subject() {
		return 'Please verify email address for ' + Accounts.emailTemplates.siteName + '.';
	},
	text(user, url) {
		url = url.replace('#/verify-email/', 'verify/email/');
		firstName = user.info.firstName;
		return firstName + ',\n\n Welcome to Flexible School Schedule. We need to verify your email address to complete your signup. Please click the verification link below (or copy and paste into your browser).\n\n\t' + url + '\n\nIf you have not signed up for Flexible School Schedule, please ignore this email. \n\nThanks.';
	},
    html(user, url) {
    	SSR.compileTemplate('verifyEmail', Assets.getText('verifyEmail.html'));

		console.log(url);
    	url = url.replace('#/verify-email/', 'verify/email/');
		firstName = user.info.firstName;
		console.log(url);

    	const html = SSR.render('verifyEmail', { url, user });
		return html;
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











