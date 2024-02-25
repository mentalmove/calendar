function iD (x) {
    return document.getElementById(x);
}

var months;
var weekdays;

var now;
var y, m, d;
var mode = "year";

function back () {
	switch (mode) {
		case "day":
			mode = "month";
			init();
		break;
		case "month":
			mode = "year";
			init();
		break;
	}
}

function lang_selected (value) {
	if ( translated_months[value] )
		months = translated_months[value];
	if ( translated_weekdays[value] )
		weekdays = translated_weekdays[value];
	if ( languages.includes(value) ) {
		iD("display_lang").innerHTML = value.toUpperCase();
		if ( window.localStorage )
			localStorage.setItem("calendar_language", value);
	}
	init();
	if ( bodyclick )
		setTimeout(bodyclick, 41);
}
function year_selected (value) {
	if ( value && !isNaN(value) ) {
		var tmp = parseInt(value);
		if ( tmp >= 1900 && tmp <= 2100 )
			y = tmp;
	}
	init();
	if ( bodyclick )
		setTimeout(bodyclick, 41);
}
function month_selected () {}
function day_selected (event) {
	if ( !event.target )
		return;
	if ( mode == "year" ) {
		var month = event.target.month;
		if ( month == null || isNaN(month) || month < 0 || month > 11 )
			return;
		m = month;
		mode = "month";
		init();
		return;
	}
	if ( !event.target.value )
		return;
	if ( event.target.selected ) {
		mode = "month";
		init();
		return;
	}
	var selected_days = iD("month_zone").querySelectorAll(".day.selected");
	for ( var i = 0; i < selected_days.length; i++ ) {
		selected_days[i].classList.remove("selected");
		selected_days[i].selected = false;
	}
	/*var today = iD("month_zone").querySelector(".day.today");
	if ( today )
		today.classList.remove("today");*/
	event.target.classList.add("selected");
	event.target.selected = true;
	d = event.target.value;
	mode = "day";
	init();
}

var bodyclick;
function open_select (element) {
	if ( !element.id || !element.classList.contains("solo") )
		return;
	var subid = element.id + "select";
	var subelement = iD(subid);
	if ( !bodyclick ) {
		subelement.style.display = "block";
		bodyclick = function () {
			iD("yearselect").style.display = "none";
			iD("langselect").style.display = "none";
			iD("remaining").removeEventListener("click", bodyclick, false);
			bodyclick = null;
		};
		setTimeout(function () {
			iD("remaining").addEventListener("click", bodyclick, false);
		}, 41);
	}
}

var prepared = false;
function prepare () {
	var i;
	
	var l = "en";
	var l_index = 0;
	if ( window.localStorage ) {
		var found_lang = localStorage.getItem("calendar_language");
		if ( found_lang ) {
			for ( i = 0; i < languages.length; i++ ) {
				if ( languages[i] == found_lang ) {
					l = found_lang;
					l_index = i;
					break;
				}
			}
		}
	}
	weekdays = translated_weekdays[l];
	months = translated_months[l];
	iD("langselect").selectedIndex = l_index;
	iD("display_lang").innerHTML = l.toUpperCase();

	if ( window.location.search ) {
		var match = location.search.match(/\?(\d{1,4})-?(\d{1,2})?-?(\d{1,2})?/);
		var tmp;
		if ( match && match.length > 1 ) {
			if ( !isNaN(match[1]) ) {
				tmp = parseInt(match[1]);
				if ( tmp >= 1900 && tmp <= 2100 ) {
					y = tmp;
					if ( match.length > 2 && !isNaN(match[2]) ) {
						tmp = parseInt(match[2]);
						if ( tmp >= 1 && tmp <= 12 ) {
							m = tmp - 1;
							mode = "month";
							if ( match.length > 3 && !isNaN(match[3]) ) {
								tmp = parseInt(match[3]);
								if ( tmp >= 1 && tmp <= last_date_of_month(y, m) ) {
									setTimeout(function () {
										d = tmp;
										mode = "day";
										init();
									}, 17);
								}
							}
						}
					}
				}
			}
		}
	}
	
	var option;
	var wrapper = iD("yearselect");
	for ( i = 1900; i <= 2100; i++ ) {
		option = document.createElement("option");
		option.text = i;
		option.value = i;
		wrapper.appendChild(option);
	}
}
function init () {
	if ( !prepared )
		prepare();
	prepared = true;

	now = now || new Date();

	switch (mode) {
		case "year":
			iD("back").classList.add("closed");
			iD("back").style.visibility = "visible";
			iD("year").classList.add("solo");
			iD("month").style.display = "none";
			iD("day").style.display = "none";
			iD("lang").style.visibility = "hidden";

			var actual_month = (y) ? -1 : now.getMonth();
			y = y || now.getFullYear();
			m = null;
			d = null;
			iD("display_numyear").innerHTML = y;
			iD("yearselect").selectedIndex = y - 1900;

			iD("year_zone").style.display = "flex";
			iD("month_zone").style.display = "none";

			iD("year_zone").innerHTML = "";
			var element;
			for ( var i = 0; i < 12; i++ ) {
				element = create_month(iD("year_zone"), i);
				element.title = months[i];
				if ( i == actual_month ) {
					element.classList.add("actual");
					setTimeout(function (el) {
						el.classList.remove("actual");
					}, 1001, element);
				}
			}
		break;
		case "month":
			iD("back").classList.remove("closed");
			iD("back").style.visibility = "visible";
			iD("year").classList.remove("solo");
			iD("month").style.display = "inline";
			iD("day").style.display = "none";
			iD("lang").style.visibility = "visible";

			y = y || now.getFullYear();
			if ( m == null )
				m = now.getMonth();
			d = null;
			iD("display_numyear").innerHTML = y;
			iD("month").innerHTML = months[m];

			iD("year_zone").style.display = "none";
			iD("month_zone").style.display = "flex";

			iD("month_zone").innerHTML = "";
			create_month(iD("month_zone"));
		break;
		case "day":
			iD("back").classList.remove("closed");
			iD("back").style.visibility = "visible";
			iD("year").classList.remove("solo");
			iD("month").style.display = "inline";
			iD("day").style.display = "inline";
			iD("lang").style.visibility = "visible";

			y = y || now.getFullYear();
			if ( m == null )
				m = now.getMonth();
			if ( d == null )
				d = now.getDate();
			iD("display_numyear").innerHTML = y;
			iD("month").innerHTML = months[m];
			iD("display_numday").innerHTML = d;

			iD("year_zone").style.display = "none";
			iD("month_zone").style.display = "flex";

			var weekday = zellers_weekday(y, m, d);
			if ( weekdays[weekday] )
				iD("display_weekday").innerHTML = weekdays[weekday];
		break;
	}
}
