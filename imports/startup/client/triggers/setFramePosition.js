// Set frame position.
function setFramePosition(context) {
	let currentPostion = context.params.selectedFramePosition;

	if (!currentPostion || currentPostion === '1') {
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');		
	} else if (currentPostion === '2') {
		Session.setPersistent('selectedFramePosition', 2);
		Session.setPersistent('selectedFrameClass', 'frame-position-two');		
	} else if (currentPostion === '3') {
		Session.setPersistent('selectedFramePosition', 3);
		Session.setPersistent('selectedFrameClass', 'frame-position-three');		
	} 
};

FlowRouter.triggers.enter([setFramePosition]);