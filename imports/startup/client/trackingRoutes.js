FlowRouter.route('/tracking/list/:selectedSchoolYearId/:selectedTermId', {
	name: 'trackingList',
	action() {
		BlazeLayout.reset();
		BlazeLayout.render('app', {
			main: 'trackingList',
		});
	},
});


FlowRouter.route('/tracking/students/view/:id/:selectedSchoolYearId/:selectedTermId/:selectedWeekId', {
	name: 'trackingView',
	action() {
		BlazeLayout.reset();
		BlazeLayout.render('app', {
			main: 'trackingView',
		});
	},
});














