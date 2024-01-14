import _ from 'lodash';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/reporting/new/:selectedFramePosition', {
	name: 'reportingNew',
	title:  'Reporting: Reports: New',
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
	title:  'Reporting: Reports: View',
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
	title:  'Reporting: Reports: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'reportingList',
			frameTwo: 'reportingEdit',
		});
	},
});

