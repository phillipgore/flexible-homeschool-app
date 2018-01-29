FlowRouter.route('/settings/list', {
	name: 'settingsList',
	action() {
		BlazeLayout.render('app', {
			main: 'settingsList',
		});
	},
});




// Users
FlowRouter.route('/settings/users/list', {
	name: 'usersList',
	action() {
		BlazeLayout.render('app', {
			main: 'usersList',
		});
	},
});

FlowRouter.route('/settings/users/new', {
	name: 'usersNew',
	action() {
		BlazeLayout.render('app', {
			main: 'usersNew',
		});
	},
});

FlowRouter.route('/settings/users/verify/sent', {
	name: 'usersVerifySent',
	action() {
		BlazeLayout.render('app', {
			main: 'usersVerifySent',
		});
	},
});

FlowRouter.route('/settings/users/view/:id', {
	name: 'usersView',
	action() {
		BlazeLayout.render('app', {
			main: 'usersView',
		});
	},
});

FlowRouter.route('/settings/users/edit/:id', {
	name: 'usersEdit',
	action() {
		BlazeLayout.render('app', {
			main: 'usersEdit',
		});
	},
});