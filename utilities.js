var languages = ["en", "de"];
var translated_months = {
	en: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	de: [
		"Januar",
		"Februar",
		"März",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Dezember"
	]
};
var translated_weekdays = {
	en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
};

/* YEAR */
function leap_year (y) {
	if ( y % 4 )
		return false;
	if ( !(y % 100) && (y % 400) )
		return false;
	return true;
}

/* MONTH */
function last_date_of_month (y, m) {
	if ( m < 0 )
		m += 12;
	m = m % 12;
	var list = [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	if ( m == 1 && leap_year (y) )
		list[1] = 29;
	return list[m];
}

/* WEEK */
function start_of_calendar_week (y, w) {
	var new_year_index = zellers_weekday(y, 0, 1) || 7;
	var result = [y, 0, (9 - new_year_index)];
	if ( new_year_index == 1 )
		result[2] = 1;
	if ( new_year_index < 5 && new_year_index != 1 )
		result = [(y - 1), 11, (33 - new_year_index)];
	add_days(result, ((w - 1) * 7));
	return result;
}

/* DAY */
function zellers_weekday (y, m, d) {
    if ( m < 2 )
        y -= 1;
    return w = (((
            d + Math.floor(2.6 * ((m + 10) % 12 + 1) - 0.2)
            + y % 100 + Math.floor(y % 100 / 4)
            + Math.floor(y / 400)
            - 2 * Math.floor(y / 100) - 1
        ) % 7 + 7) % 7 + 1) % 7;
}
function add_days (time_values, days) {
	var last;
	if ( days > 0 ) {
		while ( true ) {
			last = last_date_of_month(time_values[0], time_values[1]);
			if ( (time_values[2] + days) <= last ) {
				time_values[2] += days;
				return;
			}
			days -= (last - time_values[2] + 1);
			time_values[2] = 1;
			if ( time_values[1] == 11 ) {
				time_values[0]++;
				time_values[1] = 0;
			}
			else
				time_values[1]++;
		}
	}
}
