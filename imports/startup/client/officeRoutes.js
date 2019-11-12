FlowRouter.route('/office/dashboard/:selectedFramePosition', {
	name: 'officeDashboard',
	// title: 'Office Dashboard',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeDashboard',
		});
	},
});

FlowRouter.route('/office/accounts/view/:selectedFramePosition/:selectedStatusId/:selectedGroupId', {
	name: 'officeAccountsView',
	// title: 'Office Account: View',
	action(params) {
		BlazeLayout.render('office', {
			subbar: 'officeAccountsSubbar',
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountsView',
		});
	},
});

FlowRouter.route('/office/accounts/reset/view/:selectedFramePosition/:selectedStatusId/:selectedGroupId', {
	name: 'officeAccountsResetView',
	// title: 'Office Account: Reset View',
	action(params) {
		BlazeLayout.reset();
		BlazeLayout.render('office', {
			subbar: 'officeAccountsSubbar',
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountsView',
		});
	},
});

FlowRouter.route('/office/accounts/new/:selectedFramePosition', {
	name: 'officeAccountsNew',
	// title: 'Office Account: New',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountsNew',
		});
	},
});