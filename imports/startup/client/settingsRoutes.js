FlowRouter.route('/settings/list', {
	name: 'settingsList',
	action() {
		BlazeLayout.render('app', {
			main: 'settingsList',
		});
	},
});