export const isSameDate = (lastDate) => {
	lastDate = new Date(lastDate);
	const today = new Date();

	const isSameDate =
		lastDate.getFullYear() === today.getFullYear() &&
		lastDate.getMonth() === today.getMonth() &&
		lastDate.getDate() === today.getDate();

	return isSameDate;
};

export const matchDate = (date1, date2) => {
	date1 = new Date(date1);
	date2 = new Date(date2);

	const isSameDate =
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate();

	return isSameDate;
};

export const formatBillMonth = (billMonth) => {
	const [month, year] = billMonth.toString().split('.');
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return `${monthNames[parseInt(month) - 1]}, 20${year}`;
};

export const toTitleCase = (str) => {
	return str
		.toString()
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
