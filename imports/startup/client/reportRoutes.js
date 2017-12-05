FlowRouter.route('/reports/list', {
	name: 'reportsList',
	action() {
		BlazeLayout.render('app', {
			toolbar: 'toolbar',
			main: 'reportsList',
		});
	},
});

