import _ from 'lodash'

FlowRouter.route('/reporting/new/:selectedFramePosition', {
	name: 'reportingNew',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'reportingList',
			frameTwo: 'reportingNew',
		});
	},
});

// FlowRouter.route('/reporting/view/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedReportId', {
// 	name: 'reportingView',
// 	action(params) {
// 		BlazeLayout.render('app', {
// 			subbar: 'subbarReporting',
// 			frameOne: 'reportingList',
// 			frameTwo: 'reportingView',
// 		});
// 	},
// });

FlowRouter.route('/reporting/view/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId/:selectedReportId', {
	name: 'reportingView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarReporting',
			frameOne: 'reportingList',
			frameTwo: 'reportingView',
		});
	},
});

FlowRouter.route('/reporting/edit/:selectedFramePosition/:selectedReportId', {
	name: 'reportingEdit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'reportingList',
			frameTwo: 'reportingEdit',
		});
	},
});

