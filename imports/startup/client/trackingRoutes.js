FlowRouter.route('/tracking/list', {
	name: 'trackingList',
	action() {
		BlazeLayout.render('app', {
			main: 'trackingList',
		});
	},
});

FlowRouter.route('/tracking/students/:id', {
	name: 'studentsId',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsId',
		});
	},
});














