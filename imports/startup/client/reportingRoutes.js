import _ from 'lodash'

FlowRouter.route('/reporting/new/:selectedFramePosition', {
	name: 'reportingNew',
	// title: 'Reporting: New',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'reportingList',
			frameTwo: 'reportingNew',
		});
	},
});

FlowRouter.route('/reporting/view/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId/:selectedReportId', {
	name: 'reportingView',
	// title: 'Reporting: View',
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
	// title: 'Reporting: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'reportingList',
			frameTwo: 'reportingEdit',
		});
	},
});

