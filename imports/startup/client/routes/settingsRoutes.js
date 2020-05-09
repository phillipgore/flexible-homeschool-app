// Users
FlowRouter.route('/settings/users/view/:selectedFramePosition/:selectedUserId', {
	name: 'usersView',
	title:  'Settings: Users: View',
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
	title:  'Settings: Users: New',
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
	title:  'Settings: Users: Verify Resent',
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
	title:  'Settings: Users: Edit',
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
	title:  'Settings: Users: Restricted',
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
	title:  'Settings: Billing: Error',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'billingError',
		});
	},
});

FlowRouter.route('/settings/billing/invoices/:selectedFramePosition', {
	name: 'billingInvoices',
	title:  'Settings: Billing: Invoices',
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
	title:  'Settings: Billing: Edit',
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
	title:  'Settings: Billing: Coupons',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingCoupons',
		});
	},
});

FlowRouter.route('/settings/billing/pause/:selectedFramePosition', {
	name: 'billingPause',
	title:  'Settings: Billing: Pause Account',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingPause',
		});
	},
});




// Billing
FlowRouter.route('/settings/test/data/:selectedFramePosition', {
	name: 'testDataList',
	title:  'Settings: Test: Data',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'testDataList',
		});
	},
});




// Support
FlowRouter.route('/settings/support/view/:selectedFramePosition', {
	name: 'supportView',
	title:  'Settings: Support: View',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'supportList',
		});
	},
});