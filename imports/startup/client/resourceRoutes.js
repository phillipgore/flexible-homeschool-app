FlowRouter.route('/resources/list', {
	name: 'resourcesList',
	action() {
		BlazeLayout.render('app', {
			toolbar: 'toolbar',
			main: 'resourcesList',
		});
	},
});














