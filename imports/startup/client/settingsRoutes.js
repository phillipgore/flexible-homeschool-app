// Users
FlowRouter.route('/settings/users/view/:selectedFramePosition/:selectedUserId', {
	name: 'usersView',
	// title: 'User: View',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersList',
			frameThree: 'usersView',
		});
	},
});

FlowRouter.route('/settings/users/new/:selectedFramePosition', {
	name: 'usersNew',
	// title: 'User: New',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersList',
			frameThree: 'usersNew',
		});
	},
});

FlowRouter.route('/settings/users/verify/resent/:selectedFramePosition/:selectedUserId', {
	name: 'usersVerifyResent',
	// title: 'User: Verify Resent',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersList',
			frameThree: 'usersVerifyResent',
		});
	},
});

FlowRouter.route('/settings/users/edit/:selectedFramePosition/:selectedUserId', {
	name: 'usersEdit',
	// title: 'User: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersList',
			frameThree: 'usersEdit',
		});
	},
});

FlowRouter.route('/settings/users/restricted/:selectedFramePosition', {
	name: 'usersRestricted',
	// title: 'User: Restricted',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'usersRestricted',
		});
	},
});




// Billing
FlowRouter.route('/settings/billing/error/:selectedFramePosition', {
	name: 'billingError',
	// title: 'Billing: Error',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'billingError',
		});
	},
});

FlowRouter.route('/settings/billing/invoices/:selectedFramePosition', {
	name: 'billingInvoices',
	// title: 'Billing: Invoices',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingInvoices',
		});
	},
});

FlowRouter.route('/settings/billing/edit/:selectedFramePosition', {
	name: 'billingEdit',
	// title: 'Billing: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingEdit',
		});
	},
});

FlowRouter.route('/settings/billing/coupons/:selectedFramePosition', {
	name: 'billingCoupons',
	// title: 'Billing: Coupons',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingCoupons',
		});
	},
});




// Support
FlowRouter.route('/settings/support/view/:selectedFramePosition', {
	name: 'supportView',
	// title: 'Support: View',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'supportList',
		});
	},
});