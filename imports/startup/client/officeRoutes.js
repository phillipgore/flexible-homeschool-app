FlowRouter.route('/office/dashboard', {
	name: 'officeDashboard',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeDashboard',
		});
	},
});

FlowRouter.route('/office/accounts', {
	name: 'officeAccounts',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccount',
		});
	},
});