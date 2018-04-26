FlowRouter.route('/', {
	name: 'createAccount',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'createAccount',
		});
	},
});

FlowRouter.route('/verify/sent', {
	name: 'verifySent',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'verifySent',
		});
	},
});

FlowRouter.route('/verify/email/:token', {
	name: 'verifySent',
	action: function(params, queryParams) {
        Accounts.verifyEmail(params.token, function(error) {
			if (error) {
				FlowRouter.redirect('/verify/sent');
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
			frameOne: 'verifySuccess',
		});
	},
});

FlowRouter.route('/sign-in', {
	name: 'signIn',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'signIn',
		});
	},
});

FlowRouter.route('/reset', {
	name: 'reset',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'reset',
		});
	},
});

FlowRouter.route('/reset/sent', {
	name: 'resetSent',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'resetSent',
		});
	},
});

FlowRouter.route('/reset/password/:token', {
	name: 'resetPassword',
	action: function(params, queryParams) {
        BlazeLayout.render('app', {
			frameOne: 'resetPassword',
		});
    },
});

FlowRouter.route('/reset/success', {
	name: 'resetSuccess',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'resetSuccess',
		});
	},
});









