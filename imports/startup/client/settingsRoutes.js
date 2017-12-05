FlowRouter.route('/settings/list', {
	name: 'settingsList',
	action() {
		BlazeLayout.render('app', {
			toolbar: 'toolbar',
			main: 'settingsList',
		});
	},
});

FlowRouter.route('/settings/schoolyears/new', {
	name: 'schoolYearsNew',
	action() {
		LocalTerms.remove();
		BlazeLayout.render('app', {
			toolbar: 'toolbar',
			main: 'schoolYearsNew',
		});
	},
});

FlowRouter.route('/settings/schoolyears/list', {
	name: 'schoolYearsList',
	action() {
		BlazeLayout.render('app', {
			toolbar: 'toolbar',
			main: 'schoolYearsList',
		});
	},
});

FlowRouter.route('/settings/schoolyears/:id', {
	name: 'schoolYearsId',
	action() {
		BlazeLayout.render('app', {
			main: 'schoolYearsId',
		});
	},
});