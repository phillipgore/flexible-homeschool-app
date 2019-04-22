// Reset scroll position.
function scrollReset(context) {
	$(window).scrollTop(0);
};

FlowRouter.triggers.enter([scrollReset], {except: [
	'resourcesView',
]});