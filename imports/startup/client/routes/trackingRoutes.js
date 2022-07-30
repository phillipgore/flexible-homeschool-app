FlowRouter.route('/tracking/students/view/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId', {
	name: 'trackingView',
	title:  'Tracking: View',
	action(params) {
		Session.set('selectedStudentIdType', 'students');
		BlazeLayout.render('app', {
			subbar: 'subbarTracking',
			frameOne: 'trackingList',
			frameTwo: 'trackingView',
		});
	},
});

FlowRouter.route('/tracking/students/edit/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId', {
	name: 'trackingEdit',
	title:  'Tracking: Edit',
	action(params) {
		Session.set('selectedStudentIdType', 'students');
		BlazeLayout.render('app', {
			subbar: 'subbarTracking',
			frameOne: 'trackingList',
			frameTwo: 'trackingEdit',
		});
	},
});

FlowRouter.route('/tracking/studentgroups/view/:selectedFramePosition/:selectedStudentGroupId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId', {
	name: 'trackingView',
	title:  'Tracking: View',
	action(params) {
		Session.set('selectedStudentIdType', 'studentgroups');
		BlazeLayout.render('app', {
			subbar: 'subbarTracking',
			frameOne: 'trackingList',
			frameTwo: 'trackingView',
		});
	},
});

FlowRouter.route('/tracking/studentgroups/edit/:selectedFramePosition/:selectedStudentGroupId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId', {
	name: 'trackingEdit',
	title:  'Tracking: Edit',
	action(params) {
		Session.set('selectedStudentIdType', 'studentgroups');
		BlazeLayout.render('app', {
			subbar: 'subbarTracking',
			frameOne: 'trackingList',
			frameTwo: 'trackingEdit',
		});
	},
});














