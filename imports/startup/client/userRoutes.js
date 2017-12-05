function checkSignIn(context) {
	const routeName = context.route.name;
	if (Meteor.userId()) {
		FlowRouter.redirect('/students');
	}
};

function checkSignOut(context) {
	const routeName = context.route.name;
	if (!Meteor.userId()) {
		FlowRouter.redirect('/sign-in');
	}
};

FlowRouter.triggers.enter([checkSignIn], {only: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword']});
FlowRouter.triggers.enter([checkSignOut], {except: ['createAccount', 'verifySent', 'signIn', 'reset', 'resetSent', 'resetPassword']});




FlowRouter.route('/', {
	name: 'createAccount',
	action() {
		BlazeLayout.render('app', {
			main: 'createAccount',
		});
	},
});

FlowRouter.route('/verify/sent', {
	name: 'verifySent',
	action() {
		BlazeLayout.render('app', {
			main: 'verifySent',
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
			main: 'verifySuccess',
		});
	},
});

FlowRouter.route('/sign-in', {
	name: 'signIn',
	action() {
		BlazeLayout.render('app', {
			main: 'signIn',
		});
	},
});

FlowRouter.route('/reset', {
	name: 'reset',
	action() {
		BlazeLayout.render('app', {
			main: 'reset',
		});
	},
});

FlowRouter.route('/reset/sent', {
	name: 'resetSent',
	action() {
		BlazeLayout.render('app', {
			main: 'resetSent',
		});
	},
});

FlowRouter.route('/reset/password/:token', {
	name: 'resetPassword',
	action: function(params, queryParams) {
        BlazeLayout.render('app', {
			main: 'resetPassword',
		});
    },
});

FlowRouter.route('/reset/success', {
	name: 'resetSuccess',
	action() {
		BlazeLayout.render('app', {
			main: 'resetSuccess',
		});
	},
});









