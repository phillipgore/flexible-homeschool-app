FlowRouter.route('/reporting/list', {
	name: 'reportingList',
	action() {
		BlazeLayout.render('app', {
			main: 'reportingList',
		});
	},
});

