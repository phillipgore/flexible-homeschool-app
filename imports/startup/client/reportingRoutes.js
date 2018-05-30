import _ from 'lodash'

FlowRouter.route('/reporting/new/:selectedStudentId/:selectedSchoolYearId', {
	name: 'reportingNew',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'reportingList',
			frameTwo: 'reportingNew',
		});
	},
});

FlowRouter.route('/reporting/view/:selectedStudentId/:selectedSchoolYearId/:selectedReportId', {
	name: 'reportingView',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarReporting',
			frameOne: 'reportingList',
			frameTwo: 'reportingView',
		});
	},
});

FlowRouter.route('/reporting/edit/:selectedStudentId/:selectedSchoolYearId/:selectedReportId', {
	name: 'reportingEdit',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'reportingList',
			frameTwo: 'reportingEdit',
		});
	},
});

