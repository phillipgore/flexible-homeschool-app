import _ from 'lodash'

FlowRouter.route('/reporting/list/:selectedSchoolYearId/:selectedStudentId', {
	name: 'reportingList',
	action() {
		BlazeLayout.render('app', {
			main: 'reportingList',
		});
	},
});

FlowRouter.route('/reporting/settings/edit', {
	name: 'reportingSettingsEdit',
	action() {
		BlazeLayout.render('app', {
			main: 'reportingSettingsEdit',
		});
	},
});

