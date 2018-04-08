FlowRouter.route('/tracking/list', {
	name: 'trackingList',
	action() {
		BlazeLayout.render('app', {
			main: 'trackingList',
		});
	},
});


FlowRouter.route('/tracking/students/view/:id', {
	name: 'trackingView',
	action() {
		BlazeLayout.render('app', {
			main: 'trackingView',
		});
	},
});














