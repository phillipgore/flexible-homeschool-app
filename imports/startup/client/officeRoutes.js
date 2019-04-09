FlowRouter.route('/office/dashboard/:selectedFramePosition', {
	name: 'officeDashboard',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeDashboard',
		});
	},
});

FlowRouter.route('/office/accounts/:selectedFramePosition', {
	name: 'officeAccountsList',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountView',
		});
	},
});

FlowRouter.route('/office/accounts/view/:selectedFramePosition/:selectedGroupId', {
	name: 'officeAccountView',
	action(params) {
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountView',
		});
	},
});

FlowRouter.route('/office/accounts/reset/view/:selectedFramePosition/:selectedGroupId', {
	name: 'officeAccountResetView',
	action(params) {
		BlazeLayout.reset();
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountView',
		});
	},
});

FlowRouter.route('/office/accounts/new/:selectedFramePosition', {
	name: 'officeAccountsNew',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountsNew',
		});
	},
});