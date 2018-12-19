// Redirection based on App Admin role.
function isAppAdmin(context) {
	if (Meteor.user().info.role != 'Application Administrator') {
		FlowRouter.go('/')
	}
}

FlowRouter.triggers.enter([isAppAdmin], {only: [
	'officeAccounts',
	'officeDashboard'
]});