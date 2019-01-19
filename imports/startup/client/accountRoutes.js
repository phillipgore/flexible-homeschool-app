FlowRouter.route('/', {
	name: 'createAccount',
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
	name: 'verifySent',
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
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'pausedUser',
			frameTwo: '',
			frameThree: '',
		});
	},
});









