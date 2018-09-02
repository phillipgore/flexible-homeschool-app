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

FlowRouter.route('/office/accounts/view/:selectedFramePosition/:selectedAccountId', {
	name: 'officeAccountView',
	action(params) {
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountView',
		});
	},
});