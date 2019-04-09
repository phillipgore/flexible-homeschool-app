// Clear Alerts.
function clearAlerts(context) {
	Alerts.remove({});
};


FlowRouter.triggers.enter([clearAlerts]);