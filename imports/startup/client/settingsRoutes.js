// Users
FlowRouter.route('/settings/users/view/:selectedUserId', {
	name: 'usersView',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersList',
			frameThree: 'usersView',
		});
	},
});

FlowRouter.route('/settings/users/new', {
	name: 'usersNew',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersList',
			frameThree: 'usersNew',
		});
	},
});

FlowRouter.route('/settings/users/verify/resent/:selectedUserId', {
	name: 'usersVerifyResent',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersList',
			frameThree: 'usersVerifyResent',
		});
	},
});

FlowRouter.route('/settings/users/edit/:selectedUserId', {
	name: 'usersEdit',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersList',
			frameThree: 'usersEdit',
		});
	},
});

FlowRouter.route('/settings/users/restricted', {
	name: 'usersRestricted',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersRestricted',
		});
	},
});




// Billing
FlowRouter.route('/settings/billing/error', {
	name: 'billingError',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'billingError',
		});
	},
});

FlowRouter.route('/settings/billing/invoices', {
	name: 'billingInvoices',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingInvoices',
		});
	},
});

FlowRouter.route('/settings/billing/edit', {
	name: 'billingEdit',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingEdit',
		});
	},
});




// Support
FlowRouter.route('/settings/support/view', {
	name: 'supportView',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'supportList',
		});
	},
});