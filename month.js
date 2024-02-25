function create_month (wrapper, provided_month) {
	if ( provided_month == null )
		provided_month = m;
	var last = last_date_of_month(y, provided_month);
	var offset = zellers_weekday(y, provided_month, 1) - 1;
	if ( offset < 0 )
		offset += 7;

	var month = document.createElement("div");
	month.className = "month";

	var today = -1;
	if ( now.getFullYear() == y ) {
		if ( now.getMonth() == provided_month )
			today = now.getDate();
	}

	var last_before = last_date_of_month(y, (provided_month - 1));
	var date, week, day;
	var overdue = 0;
	var i;
	for ( i = 0; ; i++ ) {
		date = i - offset + 1;
		if ( !(i % 7) ) {
			if ( date > last )
				break;
			week = document.createElement("div");
			week.className = "week";
			month.appendChild(week);
		}
		day = document.createElement("div");
		day.className = "day";
		if ( date > 0 && date <= last ) {
			/*if ( date != today )
				day.innerHTML = date;
			else {
				var span = document.createElement("span");
				span.className = "today";
				span.innerHTML = date;
				day.appendChild(span);
			}*/
			day.innerHTML = date;
			day.value = date;
			/*	*/
			if ( date <= 7 )
				day.classList.add("top");
			if ( !((i + 1) % 7) || date == last )
				day.classList.add("right");
			if ( date > (last - 7) )
				day.classList.add("bottom");
			if ( !(i % 7) || date == 1 )
				day.classList.add("left");
			if ( date == today )
				day.classList.add("today");
			/*	*/
		}
		else {
			day.classList.add("other");
			if ( date > last )
				day.innerHTML = ++overdue;
			else
				day.innerHTML = last_before + date;
		}
		day.month = provided_month;
		day.onclick = day_selected;
		week.appendChild(day);
	}
	wrapper.appendChild(month);
	return month;
}
