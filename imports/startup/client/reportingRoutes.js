import _ from 'lodash'

FlowRouter.route('/reporting/new/:selectedFramePosition', {
	name: 'reportingNew',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'reportingList',
			frameTwo: 'reportingNew',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'reportingNew')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'reportingView')
		}
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
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'reportingEdit')
		}
	},
});

