FlowRouter.route('/office/dashboard', {
	name: 'officeDashboard',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeDashboard',
		});
	},
});

FlowRouter.route('/office/accounts', {
	name: 'officeAccountsList',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountView',
		});
	},
});

FlowRouter.route('/office/accounts/view/2/:selectedAccountId', {
	name: 'officeAccountView',
	action(params) {
		BlazeLayout.render('office', {
			subbar: '',
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountView',
		});
	},
});