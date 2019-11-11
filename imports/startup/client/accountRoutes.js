FlowRouter.globals.push({
	title: 'Flexible Homeschool App'
});

FlowRouter.route('/', {
	name: 'createAccount',
	title: 'Create Account',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarAccounts',
			frameOne: 'createAccount',
			frameTwo: '',
			frameThree: '',
		});
	},
});

FlowRouter.route('/verify/sent', {
	name: 'verifySent',
	title: 'Verify Sent',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarAccounts',
			frameOne: 'verifySent',
			frameTwo: '',
			frameThree: '',
		});
	},
});

FlowRouter.route('/verify/email/:token', {
	name: 'verifySentToken',
	title: 'Verify Sent: Token',
	action: function(params, queryParams) {
        Accounts.verifyEmail(params.token, function(error) {
			if (error) {
				FlowRouter.redirect('/sign-in');
			} else {
				FlowRouter.redirect('/verify/success');
			}
		});
    },
});

FlowRouter.route('/verify/success', {
	name: 'verifySuccess',
	title: 'Verify Success',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarAccounts',
			frameOne: 'verifySuccess',
			frameTwo: '',
			frameThree: '',
		});
	},
});

FlowRouter.route('/sign-in', {
	name: 'signIn',
	title: 'Sign In',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarAccounts',
			frameOne: 'signIn',
			frameTwo: '',
			frameThree: '',
		});
	},
});

FlowRouter.route('/sign-out', {
	name: 'signOut',
	title: 'Sign Out',
	action() {
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go("/sign-in");
			}
		});
	},
});

FlowRouter.route('/reset', {
	name: 'reset',
	title: 'Reset',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarAccounts',
			frameOne: 'reset',
			frameTwo: '',
			frameThree: '',
		});
	},
});

FlowRouter.route('/reset/sent', {
	name: 'resetSent',
	title: 'Reset Sent',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarAccounts',
			frameOne: 'resetSent',
			frameTwo: '',
			frameThree: '',
		});
	},
});

FlowRouter.route('/reset/password/:token', {
	name: 'resetPassword',
	title: 'Reset Password',
	action: function(params, queryParams) {
        BlazeLayout.render('app', {
			subbar: 'subbarAccounts',
			frameOne: 'resetPassword',
			frameTwo: '',
			frameThree: '',
		});
    },
});

FlowRouter.route('/reset/success', {
	name: 'resetSuccess',
	title: 'Reset Success',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarAccounts',
			frameOne: 'resetSuccess',
			frameTwo: '',
			frameThree: '',
		});
	},
});

FlowRouter.route('/paused/user', {
	name: 'pausedUser',
	title: 'Paused User',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'pausedUser',
			frameTwo: '',
			frameThree: '',
		});
	},
});









