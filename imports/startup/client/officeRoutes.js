// Dashboard
FlowRouter.route('/office/dashboard/:selectedFramePosition', {
	name: 'officeDashboard',
	title:  'Office: Dashboard',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeDashboard',
		});
	},
});



// Accounts
FlowRouter.route('/office/accounts/view/:selectedFramePosition/:selectedStatusId/:selectedGroupId', {
	name: 'officeAccountsView',
	title:  'Office: Accounts: View',
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
	title:  'Office: Accounts: Reset: View',
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
	title:  'Office: Accounts: New',
	action() {
		BlazeLayout.render('office', {
			frameOne: 'officeAccountsList',
			frameTwo: 'officeAccountsNew',
		});
	},
});



// Questions
FlowRouter.route('/office/questions/new/:selectedFramePosition', {
	name: 'officeQuestionsNew',
	title:  'Pause Questions: New',
	action(params) {
		BlazeLayout.render('office', {
			subbar: '',
			frameOne: 'questionsList',
			frameTwo: 'questionsNew',
		});
	},
});

FlowRouter.route('/office/questions/view/:selectedFramePosition/:selectedQuestionId', {
	name: 'officeQuestionsView',
	title:  'Pause Questions: View',
	action(params) {
		BlazeLayout.render('office', {
			subbar: '',
			frameOne: 'questionsList',
			frameTwo: 'questionsView',
		});
	},
});

FlowRouter.route('/office/questions/edit/:selectedFramePosition/:selectedQuestionId', {
	name: 'officeQuestionsEdit',
	title:  'Pause Questions: Edit',
	action(params) {
		BlazeLayout.render('office', {
			subbar: '',
			frameOne: 'questionsList',
			frameTwo: 'questionsEdit',
		});
	},
});





