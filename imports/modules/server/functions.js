import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Lessons} from '../../api/lessons/lessons.js';
import _ from 'lodash'

export function minutesConvert(minutes) {
	if (isNaN(minutes)) {
		return "0h 0m";
	}
	if (minutes === 60) {
		return "1h 0m";
	}
	if (minutes > 60) {
		let hours = Math.floor(minutes / 60);
		let minutesLeft = minutes - (hours * 60);
		return hours +"h "+ Math.round(minutesLeft) +"m";
	}
	if (minutes < 60) {
		let seconds = 60 * (minutes - Math.floor(minutes));
		return Math.floor(minutes) + "m "+ Math.round(seconds) +"s";
	}
};

export function penniesToDolars(pennies) {
	if (isNaN(pennies)) {
		return 0;
	}
	return Math.round(pennies / 100);
};




