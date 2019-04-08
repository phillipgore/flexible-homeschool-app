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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'usersView')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'usersNew')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'usersVerifyResent')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'usersEdit')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'usersRestricted')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'billingError')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'billingInvoices')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'billingEdit')
		}
	},
});

FlowRouter.route('/settings/billing/coupons/:selectedFramePosition', {
	name: 'billingCoupons',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'settingsList',
			frameTwo: 'billingList',
			frameThree: 'billingCoupons',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'billingCoupons')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'supportList')
		}
	},
});