// Users
FlowRouter.route('/settings/users/view/:selectedFramePosition/:selectedUserId', {
	name: 'usersView',
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
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'billingError',
		});
	},
});

FlowRouter.route('/settings/billing/invoices/:selectedFramePosition', {
	name: 'billingInvoices',
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
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingEdit',
		});
	},
});




// Support
FlowRouter.route('/settings/support/view/:selectedFramePosition', {
	name: 'supportView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'supportList',
		});
	},
});