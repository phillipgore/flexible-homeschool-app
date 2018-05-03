FlowRouter.route('/settings/list', {
	name: 'settingsList',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
		});
	},
});




// Users
FlowRouter.route('/settings/users/list', {
	name: 'usersList',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'usersList',
		});
	},
});

FlowRouter.route('/settings/users/new', {
	name: 'usersNew',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'usersNew',
		});
	},
});

FlowRouter.route('/settings/users/verify/sent', {
	name: 'usersVerifySent',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'usersVerifySent',
		});
	},
});

FlowRouter.route('/settings/users/view/:selectedUserId', {
	name: 'usersView',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'usersView',
		});
	},
});

FlowRouter.route('/settings/users/edit/:selectedUserId', {
	name: 'usersEdit',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'usersEdit',
		});
	},
});

FlowRouter.route('/settings/users/restricted', {
	name: 'usersRestricted',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'usersRestricted',
		});
	},
});




// Billing
FlowRouter.route('/settings/billing/list', {
	name: 'billingList',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'billingList',
		});
	},
});

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
			frameOne: 'billingInvoices',
		});
	},
});

FlowRouter.route('/settings/billing/edit', {
	name: 'billingEdit',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'billingEdit',
		});
	},
});




// Billing
FlowRouter.route('/settings/support/list', {
	name: 'supportList',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'supportList',
		});
	},
});