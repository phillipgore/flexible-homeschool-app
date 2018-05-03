FlowRouter.route('/tracking/list/:selectedSchoolYearId/:selectedTermId', {
	name: 'trackingList',
	action() {
		BlazeLayout.reset();
		BlazeLayout.render('app', {
			subbar: 'subbarTracking',
			frameOne: 'trackingList',
		});
	},
});


FlowRouter.route('/tracking/students/view/:selectedStudentId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId', {
	name: 'trackingView',
	action() {
		BlazeLayout.reset();
		BlazeLayout.render('app', {
			subbar: 'subbarTrackingStudent',
			frameOne: 'trackingView',
		});
	},
});














