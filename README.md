# Calendar Calculation

Many people think leap year and week day calculation is too complicated to handle it without the help of libraries or frameworks.
The intention of this project is to reveal some of the underlying secrets - if the practical calculation is left to a machine, it is not so difficult.

&nbsp;

### General

Typical calendar units are [year](#year), [month](#month), [week](#week) and [day](#day).
Larger (such as decade or century) or smaller (such as hour or minute) values are not common for practical reasons when the calendar ist displayed on a single page.

A **year** is the time it takes the earth to orbit the sun once.
Seen from our perspective: The time between two highest solar noons.
A year's length is quite stable and varies only very slowly.
Calendars usually try to reflect the astronomic year's length as precisely as possible.

A **month** is historically the time it takes the moon to orbit the earth once (e.g. from one full moon to the next).
Due to the so-called *three-body problem*, this period is not stable at all (it can vary more than ± 6 hours).
Therefore, the modern European calendar still has the unit *month*, but months are disconnected from the astronomic lunar phase.
Lunar calendars are still used to calculate public holidays (e.g. *Easter*).

A **day** is the time it takes the earth to rotate once.
Seen from our perspective: The (average) time between one solar noon and the next
(admittedly, between these two values is a gap of approximately 4 minutes).
A day's length is quite stable, but unfortunately unperiodic to a single year's length.
Calendars usually try to reflect the astronomic day's length as precisely as possible.

A **week** is just an auxiliary value summarising 7 consecutive days.
Historically, it is unknown if there is a religious origin or if **7** is just a suitable value that approximately divides a month's length.  
A **calendar week** is a week that starts with *Monday* and ends with *Sunday*.

&nbsp;


## Year

#### Declaration
Years are named with *unsigned integer numbers*. **Year X** means `The Xth year after Christ's birth`.
Christ's birth itself is not seen as an event in a specific year; it is seen as a moment in time.
Therefore, **Year 1** starts with Christ's birth (amazingly, Christmas is celebrated one week too early).
Years before Christ's birth also can be specified; the first year before Christ's birth (**B.C.**) ends with Christ's birth.

When specifying dates before Christ's birth, one has to be careful:
Assuming a distinct date in the year **2** is given, and we want to have the date *5 years earlier*.
From a modern arithmetic perspective, this date's year should be `-3`.
But since there is no year **0**, it usually is called **4 B.C.** .

#### Year - Month
Every year has exactly 12 months, and the beginning of the year is simultaneously the beginning of the first month.
In modern European calendars, these months always have the same names and always appear in the same order
(this is different in ancient or eastern calendars, e.g. the *chinese calendar*).  
Although many programming languages have lists of month names in different human languages,
it is recommended to store month names in all languages potentionally used in the application.
Since month indices are zero based, this can be done using a [simple array](#month-name-collection).

#### Year - Days
The duration of an astronomic year is approximately 365 days and 6 hours;
therefore, the default length of a year is defined as 365 days.
Since this is too short, every fourth year (i.e. a year divisible by `4`) has 366 days.
This is a little too long, so years divisible by 100 have 365 days.
To get it (almost) perfect, years divisible by 400 have 366 days.
```
IF ( YEAR is NOT divisible by 4 )
	YEAR has 365 days. No further investigations necessary.
IF ( YEAR is divisible by 100 )
	IF ( YEAR is divisible by 400 )
		YEAR has 366 days. No further investigations necessary.
	ELSE
		YEAR has 365 days. No further investigations necessary.
YEAR has 366 days.
```

A year with 366 days is called a *leap year*.

#### Leap year
```
function leap_year (y) {
    if ( y % 4 != 0 )
        return false;
    if ( (y % 100 == 0) && (y % 400 != 0) )
        return false;
    return true;
}
```
Those who prefer brevity over readability might want to write
```
function leap_year (y) {
    return !((y % 4) || (!(y % 100) && (y % 400)));
}
```

The amount of days of a distinct year can be retrieved by calling this function with the year's ordinal number and then assigning `365` or `366`.
```
var amount_days = ( leap_year(year) ) ? 366 : 365;
```

#### Year - Weeks
Neither 365 neither 366 is divisible by 7, but 364 is (`364 / 7 = 52`).  
A year's length, measured in weeks, is **52 + 1 day** or **52 + 2 days**.
```
var additional_days = ( leap_year(year) ) ? 2 : 1;
```

#### Year - Calendar weeks
When a year starts with *Monday* (like 2024), calculating calendar weeks is easy.
In all other cases it has to be decided if the week with *January 1st* has to be added to the old or to the new year.  
The rule (at least in most countries) is: **The week belongs to the year in which its bigger part lies.**  
As a consequence, the rule for the amount of calendar weeks is:  
**A year has 53 calendar weeks, if it starts or ends with Thursday**, in all other cases 52.  
Since this method has to detect the weekday of the first day and eventually of the last day of that year (what is quite expensive),
an equivalent rule is used:  
**If in an arbitrary year the first day is Thursday, or if in a leap year the first day is Wednesday, the year has 53 calendar weeks**, in all other cases 52.
```
var calendar_weeks = 52; // Default
var new_year = new Date(year, 0, 1); // First day of the year
// Other - and better - ways to get the day index (without Date object) below
var new_year_day_index = new_year.getDay();
// 3 - Wednesday
// 4 - Thursday
if ( new_year_day_index == 4 || (new_year_day_index == 3 && leap_year(year)) )
    calendar_weeks = 53;
```
The reason why this works is:  
The year cannot have less than 52 weeks because 365 and 366 are both greater than `7 * 52`.  
If the first day of the year is *Friday*, *Saturday* or *Sunday*,
the first week must be part of the old year, and the year cannot have more than 52 weeks.  
In the year's beginning, the days which belong to the old year have to be added.  
In the year's end, one (non-leap) or two (leap) days have to be added.  
The added days must sum up to minimum 4 to be greater than half a week.

Please also recognise the reverse method to retrieve the [start date of a distinct calendar week](#start-of-calendar-week).

&nbsp;


## Month

#### Declaration
Months are named differently, depending on their usage:
* In common everyday use either by their name (different in each language), either by their index **based on 1**
* In all arithmetic use by their index **based on 0**

Arithmetic index | Human index | English name | Days
---------------- | ----------- | ------------ | ----
0                | 1           | January      | 31
1                | 2           | February     | 28/29
2                | 3           | March        | 31
3                | 4           | April        | 30
4                | 5           | May          | 31
5                | 6           | June         | 30
6                | 7           | July         | 31
7                | 8           | August       | 31
8                | 9           | September    | 30
9                | 10          | October      | 31
10               | 11          | November     | 30
11               | 12          | December     | 31

*[The* Days *- column can be ignored for now]*  
The *zero based index* for months seems like a concession to the way software developers think, but it is indeed much older than the invention of computers.
Generally, zero based countings simplify modulo arithmetics (which are widely used in all kinds of examination of periodic events). 
Index errors are common mistakes when dealing with dates.  
For example, the Javascript command to retrieve the beginning of **2024** is
```
new Date(2024, 0, 1); // Mon Jan 01 2024 00:00:00
// Probably unwanted:
// new Date(2024, 1, 1); // Thu Feb 01 2024 00:00:00
```

#### Month name collection
```
var months = [
	"January", "February", "March", "April",
	"May", "June", "July", "August",
	"September", "October", "November", "December"
];
```
A possible internationalised collection could be
```
var translated_months = {
	en: [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	],
	es: [
		"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
		"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
	],
	de: [
		"Januar", "Februar", "März", "April", "Mai", "Juni",
		"Juli", "August", "September", "Oktober", "November", "Dezember"
	]
};
months = translated_months.en;
// months = translated_months.es;
// months = translated_months.de;
```

#### Month name
Since the numeric month value is zero based, the month name can be easily retrieved as the month name collection value at this index.
```
var month_name = months[0]; // January
month_name = months[1]; // February
month_name = months[2]; // March
var language = "es";
months = translated_months[language];
month_name = months[3]; // Abril
month_name = months[4]; // Mayo
language = "de";
months = translated_months[language];
month_name = months[5]; // Juni
/* ... */
```

#### Month - Days
Since neither 365 neither 366 is divisible by 12, months cannot have all the same length.
Additionally, at least one month's length must depend on wether the actual year is a leap year or not.
This month with variable length is *February*, which was, in Romanian times, the year's last month.
To return a specific month's length, the month index number and, in the case of february, the year must be known.
```
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
    if ( m == 1 && leap_year(y) )
        list[1] = 29;
    return list[m];
}
```
Adding `12` to negative month values is reasonable when retrieving the previous month's length:
The month before *January* is *December*. There is no need to consider the year for *December*.  
The amount of days in a distinct month and the ordinal number of the last day in this month are the same,
so `last_date_of_month()` could be named `amount_days_in_month()` as well. There is no mathematical reason
why months have exactly the length they have.

#### Month - Calendar weeks
In a graphic presentation, months are often displayed as table with 7 columns for the weekdays with Monday in the first column.
The surplus cells can be left empty or, more elegant, be filled with values of the previous resp. next month.  
A month displayed this way has between 4 (e.g. [February 2021](https://mentalmove.github.io/calendar/calendar.html?2021-02)) and 6 (e.g. [December 2024](https://mentalmove.github.io/calendar/calendar.html?2024-12)) rows.

The first row starts, if the month starts on *Monday*, with the first day of the actual month,
in all other cases with the last *Monday* of the previous month.
It ends with the first *Sunday* of the actual month.  
The last row starts with the last *Monday* of the actual month.
It ends, if the month's last day is *Sunday*, with the last day of the actual month,
in all other cases with the first *Sunday* of the next month.

The days to show must be shifted by an `offset`.
This offset can be calculated form the weekday index of the month's start.
A potential result *Sunday* must be interpreted as `7`, not `0`.
This can be understood easily by recognising that *Monday* results in a shift of `0` while *Sunday* results in a shift of `6`,
so there should be the maximum distance between *Monday* and *Sunday*.
This offset must be decreased by `1` because *Monday* shall result in no shift, *Tuesday* in a shift by `1` etc.
**Although there are better ways to retrieve a distinct day's weekday,
a *Date object* is used here because these ways are defined further down the page.**  
The *last day of the previous month* must be known because its ordinal number shall be displayed left of the month's start.  
The *amount of days of the actual month* must be known: Higher values belong to the next month.  
The ordinal number of the *day of the next month* must be known:
Fortunately, all months start with `1`.
```
var first_weekday_of_month = new Date(year, month, 1);
var offset = (first_weekday_of_month.getDay() || 7) - 1;
var last_day_of_previous_month = last_date_of_month(year, (month - 1));
var amount_days_of_actual_month = last_date_of_month(year, month);
var day_next_month = 1;
```
The following procedure executes an infinite iteration, starting with `1`.
Obviously, it is not really infinite but stops when the following condition is reached:  
*The COUNTER is divisible by `7`* AND *the actual month's length is reached or exceeded*  
From the actual month's perspective, the day to show is `COUNTER - offset`.  
From the previous month's perspective, the value just calculated has to be added to `last_day_of_previous_month`.  
From the next month's perspective, a new counting has to begin with `day_next_month`.  
Now, it has to be decided if the actual, previous or next month's value shall be taken:
* Values below `1` belong to the previous month
* Values greater than `amount_days_of_actual_month` belong to the next month
* All other values belong to the actual month
```
var day_actual_month;
var row = [];
for ( var i = 1; ; i++ ) {
    day_actual_month = i - offset;
    if ( day_actual_month < 1 )
        row.push( last_day_of_previous_month + day_actual_month );
    else {
        if ( day_actual_month > amount_days_of_actual_month )
            row.push( day_next_month++ );
        else
            row.push( day_actual_month );
    }
    if ( !(i % 7) ) {
        console.log( row.join(",\t") );
        row = [];
        if ( day_actual_month >= amount_days_of_actual_month )
            break;
    }
}
```
All displayed months on the [demo page](https://mentalmove.github.io/calendar/calendar.html) use this technique.

&nbsp;


## Day

#### Declaration
Days are identified either by their [weekday name](#weekday-names) (different in each language), either by *unsigned integer numbers*, relative to the month.
These numbers should **not** be seen as indices (if so, they would be based on 1) but as **ordinal numbers**.
This perspective has the advantage that the amount of days in a distinct month and the ordinal number of the last day in this month are the same.  
For example, the Javascript command to retrieve the beginning of **January 2024** is
```
new Date(2024, 0, 1); // Mon Jan 01 2024 00:00:00
// Undefined behaviour, result probably unwanted:
// new Date(2024, 0, 0); // Sun Dec 31 2023 00:00:00
```
#### SQL dates
When dates shall be written into a database, they are usually transformed into strings such that their single values are treated as ordinal numbers
and padded with leadings zeros to their maximum length.  
E.g. if you want to write **Sunday March 4th 12**, **Friday July 6th 666** or **Monday February 19th 2024** into a database, you could write
```
function sql_date (time_values) {
    var result = "";
    if ( time_values.length && time_values[0] > 0 ) { // Dates B.C. usually are not accepted
        result += time_values[0];
        while ( result.length < 4 )
            result = "0" + result;
        if ( time_values.length > 1 ) {
            // result += (time_values[1] < 9) ? "-0"+(time_values[1]+1) : "-"+(time_values[1]+1);
            var m = "" + (time_values[1] + 1);
            if ( m.length < 2 )
                m = "0" + m;
            result += "-" + m;
            if ( time_values.length > 2 ) {
                var d = "" + time_values[2];
                if ( d.length < 2 )
                    d = "0" + d;
                result += "-" + d;
            }
        }
    }
    return result;
}
console.log( sql_date([12, 2, 4]) ); // 0012-03-04
console.log( sql_date([666, 6, 6]) ); // 0666-07-06
console.log( sql_date([2024, 1, 19]) ); // 2024-02-19
```

#### Day name collection
```
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
```
A possible internationalised collection could be
```
var translated_days = {
	en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
	de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
};
days = translated_days.en;
// days = translated_days.es;
// days = translated_days.de;
```
Although many programming languages have lists of day names in different human languages,
it is recommended to store day names in all languages potentionally used in the application.

#### Day name
If the day name index is known, the day name can be easily retrieved as the day name collection value at this index.
```
var day_name = days[0]; // Sunday
day_name = days[1]; // Monday
var language = "de";
days = translated_days[language];
day_name = days[2]; // Dienstag
language = "es";
days = translated_days[language];
day_name = days[3]; // miércoles
/* ... */
```

#### Day name index
When the used programming language supports it (Javascript does), the easiest way to get the *day name index*
is to build a *Date object* and ask for the weekday index.
```
var date = new Date(year, month, day);
var day_index = date.getDay();
```
*Sunday* results into `0`. Sometimes, it is useful to see *Sunday* as `7`.
Since the number `0` is `false` from most language's perspective, this behaviour can be retrieved by writing
```
var day_index = date.getDay() || 7;
```

#### Caveats concerning use of *Date objects*
* When an algorithm or an application is translated into another language, it is unknown if the *Date object*
behaves the same way **or even exists**.
* *Date objects* always have limitations. One obvious limitation is that the *Javascript Date object* adds 1900 years
if the provided year is lower than 100: **Thursday December 31st 99** is interpreted as **Friday December 31st 1999**.
There are further, more hidden, restrictions: *Date objects* usually store the date as distance to a reference point.
In Javascript, this is realised as `Milliseconds to Thursday January 1st 1970 00:00:00 Greenwich Time` (positive or negative).
This is `86400000` for a single day and `31536000000` for a single (non-leap) year! Depending on the used computer system,
school arithmetics (`+`, `-`, `*`, `/`) is guaranteed to be trustworthy up to `2147483647` and modulo arithmetics up to `8388607`.
Most compilers or runtime environments use some tricks to extend these limitations, but in any case
the results might or might not be wrong for dates in the far past or far future.
* Built-In objects' methods usually cannot be extended or altered; their intermediate results cannot be used for other purposes.
For example, the *Javascript Date object* probably calculates a distance between two dates when retrieving the *day name index*.
It is not possible to use this internal method. By writing own code (or copying it from somewhere), intermediate results
can be reused. For example, [Day - Year](#day---year) below is realised with side effects of own methods to retrieve the *day name index*.
* *Date objects* methods usually are expensive.
* The idea behind *Date objects* is to work with 'real' moments in time, not with calendar values.
For example, the switch between summer time and winter time **must** be recognised by a *Date object*
but usually is unwanted in a calendar: *One day later* shall be one **day** later independent of
a day's length is `86400000`, `90000000` or `82800000` milliseconds.

All these arguments shall not depreciate the **Date object**! It is more than useful to retrieve the actual time
or to execute multiple operations on a given timestamp.
But generating a *Date object* for the only purpose of using a single calculation method is questionable.

#### Christian Zeller
The first one known to have worked on a general formula for weekdays was **Carl Friedrich Gauß**.
This is not astonishing because Gauß was the first expert (or maybe the inventor) of *modulo arithmetics*.
Gauß stopped his work, maybe because he considered the problem too simple, and generated an *Easter algorithm*
(what indeed is more difficult because calendaric and astronomic information have to be combined).  
In 1882, German mathematician, geographer and theologian *Christian Zeller* published a general formula for weekdays:
```
w = (d + ⌊2.6 ⋅ m − 0.2⌋ + y + ⌊y/4⌋ + ⌊c/4⌋ − 2c) mod 7
```
`⌊⌋` means `Math.floor()`, `c` means *century*, i.e. `3rd and 4th digit from right` resp. `Math.floor(y / 100)`  
The following is a translation into modern computer conventions
```
function weekday (y, m, d) {
    if ( m < 2 )
        y -= 1;
    return w = (((
            d + Math.floor(2.6 * ((m + 10) % 12 + 1) - 0.2)
            + y % 100 + Math.floor(y % 100 / 4)
            + Math.floor(y / 400)
            - 2 * Math.floor(y / 100) - 1
        ) % 7 + 7) % 7 + 1) % 7;
}
```
That looks complicated, and indeed it is! Good news is: It can be used without understanding by just copying and pasting it.  
How did he come up with that idea? To be honest: I can't tell. I guess it was a mixture of logic, intuition and trial-end-error.
But I can tell why it works.  
When searching for leap years, the condition with the highest number is `IF ( YEAR is divisible by 400 )`.
At first, we examine if weekdays get periodic after 400 years. We could do this by looping over 400 years,
inside that years by looping over the months, and sum up the days. There are easier ways.  
Since leap years are one day longer than non-leap years, we can sum up 400 non-leap years and add one day for every leap year.
```
days = 400 * 365 + AMOUNT_LEAP_YEARS * 1
```
Only years divisible by `4` are potential leap years. We can add those and subtract the (yet unknown) non-leap years.
```
days = 400 * 365 + (400 / 4) * 1 - AMOUNT_NON_LEAP_YEARS_DIVISIBLE_BY_FOUR
```
All these potential non-leap years are divisible by `100`.
```
days = 400 * 365 + (400 / 4) * 1 - (400 / 100) * 1 + REMAINING
```
We didn't consider years divisible by `400`; these years appear exactly once in 400 years.
```
days = 400 * 365 + (400 / 4) * 1 - (400 / 100) * 1 + 1
=> days = 400 * 365 + 100 - 4 + 1
=> days = 400 * 365 + 100 - 3
```
We are not interested in the real result but only in the remainder when dividing by `7`.  
When `365` is divided by `7` (`365 = 10 * 35 + 14 + 1`), the remainder is `1`. So we can replace `365` by `1`.
```
days_modulo_seven = 400 * 1 + 100 - 3
=> days_modulo_seven = 400 + 100 - 3 = 497

497 = 490 + 7
=> 497 = (10 * 49) + 7
```
Since `49` and `7` are both divisiable by `7`, we know that weekdays get periodic after 400 years.
That simplifies the task. If they weren't periodic, we would have to work with a period of 2800 years
(what would probably make the formula even more complicated).

If the weekday index of the previous month's last day was known, we just could add the day's ordinal number to this index, divide by `7`, and take the remainder. If we had a lookup table for all months' last days, the solution would be
```
weekday_index = (LAST_MONTH_WEEKDAY_INDEX + d) % 7;
```
Years are (apart from *Feburary*) all the same. To get the nasty *Feburary* out of sight, we re-order the year such that *Feburary* is in the end (like in Romanian times). Inside the [month length table](#month---days), we do the same trick as before and reduce the month lengths to their remainders when dividing by `7`.
Index | Name         | Days
----- | ------------ | ----
2     | March        | 3
3     | April        | 2
4     | May          | 3
5     | June         | 2
6     | July         | 3
7     | August       | 3
8     | September    | 2
9     | October      | 3
10    | November     | 2
11    | December     | 3
0     | January      | 3
1     | February     | 0 or 1

If we don't exceed the annual limit, we can ignore *Feburary* for now. From beginning of *March* to any date in *Feburary*,
the additional days sum up to `29`.
Divided by the amount of months except for *Feburary*, the average value for days to add results into `29 / 11 ≈ 2.6`.  
With this knowledge, we can reduce our lookup table to a single value per year:
```
weekday_index ≈ (REFERENCE_INDEX_FOR_YEAR + m * 2.6 + d) % 7;
```
Of course, this approximate value has to be modified to be an exact integer value. Except for *July* and *November*,
flooring the value leads to the correct result. Fortunately, the indices for *July* and *November* are divisible by `5`
so that `2.6 * index` leads to an integer value; since `5 * 0.2 = 1`, the most common way to get a reasonable result is
```
weekday_index = (INDEX_FOR_LAST_DAY_OF_FEBRUARY + d + Math.floor(2.6 * m - 0.2) - 2) % 7;
```
(*The constant in the end being* `2` *is a coincidental consequence of taking* the last day of Feburary.)  
Centuries have (apart from the beginning) all the same leap years: the years divisible by `4`.
When a lookup table has a reference day per century, the year's last two digits (`y % 100`)
should be sufficient to detect if the year's reference index moves 1 day (`365 % 7 = 1`) or 2 days (`366 % 7 = 2`) per year.
```
weekday_index = (CENTURY_INDEX + y + Math.floor(y / 4) + d + Math.floor(2.6 * m - 0.2) - 2) % 7;
```
The century index can be omitted when a correction value every 400 years (`Math.floor(y / 400)`) is inserted;
this needs another constant to be added to the century value (`Math.floor(y / 400) + CENTURY_CORRECTION`).  
Even the reference date can be dropped - marvellously, the two constants cancel each other out.

One could see it as a miracle that such a formula exists, but there **must** always be a formula
based on the least common multiples (in the worst case all relevant variable values have to be multiplied).  
The miracle is that the weekday formula is relatively simple.

#### Day name index Part II
As promised, the following technique to retrieve the *day name index* has some useful side-effects that will be used later.
Furthermore, the runtime complexity is **𝒪(1)** - that means that the necessary steps are independent of the input.
In other words: If you want to know the weekday of a specific date in the dinosaur era, the algorithm will respond quickly.

This task is divided into some subtasks:
* A reference date with known day index is defined and stored as hard-coded value.
Since the calendar is known to have a period of 400 years, this reference date can move back and forth
multiples of 400 years to suit the actual needs.
* A function to measure the distance between two given dates is defined. Result's unit shall be **day**.
* The distance between a variation of the reference date (before the relevant date) and the relevant date is measured with the above function.
* Result is added to the reference date's day index, sum is divided by `7`.
Overall result is the remainder of this division.

##### Reference date
**January 1st 2000** shall be chosen; this date is just as good or bad as any other date.  
*January 1st 1600*, *January 1st 1200*, *January 1st 2400* or even, if there was a year **0**,
*January 1st 0* are known to have the same day index
(although Zeller's formula doesn't work for non-positive years in its computer translation).  
As we can check with `weekday(2000, 0, 1)`, *January 1st 2000* was a *Saturday*.
```
var DAY_INDEX_0_0_1 = 6;
```

##### Prerequisite: Comparing dates
Since the distance measurement function shall be universally valid,
the possibility of being the first date later than the second one must be anticipated.
A function is necessary to detect this. In case the first date really is later,
the dates are toggled (the distance between **a** and **b** is always the same as between **b** and **a**).  
Year, month and day of first and second date are each seen as pairs.
If the first is lower, then the first date is earlier.
If the first is higher, then the first date is later.
If they are the same, the examination has to be continued.  
If both dates are the same, toggling is optional (and obviously avoided due to performance reasons).
```
function first_date_later (y1, y2, m1, m2, d1, d2) {
    var units = [y1, y2, m1, m2, d1, d2];
    for ( var i = 0; i < units.length; i += 2 ) {
        if ( units[i] < units[i + 1] )
            return false;
        if ( units[i] > units[i + 1] )
            return true;
    }
    return false;
}
```

##### Toggling
If the two dates have to swap places, *year*, *month* and *day* of the first date are stored in temporary values;
*year*, *month* and *day* of the second date are assigned to their first date's counterparts;
finally, the temporary values are assigned to the second date.
```
// Really object oriented languages like Ruby have to be persuaded to duplicate the values
var tmp = [y1, m1, d1];
y1 = y2;
m1 = m2;
d1 = d2;
y2 = tmp[0];
m2 = tmp[1];
d2 = tmp[2];
```

##### Distance measurement - general thoughts
It has to be decided if start day and end day shall both contribute to the result.
**This is not a mathematical but a practical decision**:
*How long is my holiday?* is a different quesion than
*How many days is Peter older than Paul?*  
The distance measurement function described here sees both start day and end day as part of the result (as in the holiday question);
therefore, for detecting the day index, `1` **has to be subtracted from the result**
while for detecting the [day of the year](#day---year) the included day **can remain**.

In the following, dates are increased by one day. This can be retrieved this way:
* IF ( DAY is NOT last day of MONTH )
    * Increase DAY by `1`
* ELSE
    * Set DAY to `1`
    * IF ( MONTH is *December* )
        * Set MONTH to `1`
        * Increase YEAR by `1`
    * ELSE
        * Increase MONTH by `1`

##### Distance measurement - first sketch
A variable DAYS is defined and initially set to `1` (or `0`, see above).  
Start year, start month and start day are copied into a variable ACTUAL_DATE.  
The algorithm simply executes an infinite iteration:
* IF ( ACTUAL_DATE equals END_DATE )
    * RETURN DAYS
    * EXIT
* Increase DAYS by `1`
* Increase ACTUAL_DATE by *one day* (described above)

This will work perfectly fine (assuming the start date is never later than the end date) but will be unacceptable slow:
There must be quicker ways than calculating each day individually.  
The runtime complexity is far away from **𝒪(1)** (indeed it is **𝒪(n)**).
Doubling the time span leads to a doubling of the iteration steps,
tenfold increase in the time span leads to a tenfold increase in the iteration steps etc.

##### Distance measurement - second sketch
Instead of days, now months shall be taken.  
`last_date_of_month(ACTUAL_DATE.YEAR, ACTUAL_DATE.MONTH)` can always retrieve the actual month's length.  
A variable REMAINING_DAYS can be calculated by subtracting ACTUAL_DATE.DAY from this value and adding `1`.  
A subprocedure *Set to the beginning of next month* could be defined as
* Set DAY to `1`
* IF ( MONTH is *December* )
    * Set MONTH to `1`
    * Increase YEAR by `1`
* ELSE
    * Increase MONTH by `1`

The iteration shall be:
* IF ( ACTUAL_DATE.YEAR equals END_DATE.YEAR **AND** ACTUAL_DATE.MONTH equals END_DATE.MONTH )
    * RETURN (DAYS + END_DATE.DAY - ACTUAL_DATE.DAY)
    * EXIT
* Increase DAYS by REMAINING_DAYS
* Set to the beginning of next month

This will also work fine, but (at least for longer distances) approximately **30 times faster**.  
Unfortunately, that doesn't help with the runtime complexity: it still is **𝒪(n)**.
Doubling the time span still leads to a doubling of the iteration steps.  
If the amount of necessary steps shall be independent of the input, another technique has to be found.

##### Some words about runtime complexity and Landau notation
The wording **independent of the input** could be misunderstood.
It doesn't mean that the necessary steps in any imaginable case are *exactly* the same
but that a maximum value of steps exists that never will be exceeded.
It is not mandatory to know this maximum value in order to characterise an algorithm as *independent of the input*.
For large input, the necessary steps will always converge towards this maximum value (or be smaller).
Furthermore, the duration of a single step is not taken into account.
Of course, multiplying two two-digit numbers is cheaper than multiplying two ten-digit numbers,
but that is seen as negligible.

The problem of the two presented sketches is obviously the iteration:
The longer the time span, the more iterations have to be done.
Even the second sketch seems to be unsuccessful, but just a little optimisation is missing.

Firstly, iterations can be kept but have to be limited to an absolute maximum value.  
Secondly, developers tend to consider code with only a few case distinctions elegant
and try to put everything into a single concept.
This way of thinking sometimes needs to be broken.  
The key to an input-independent algorithm is here to resolve the global loop
and break the code down to a finite number of steps.

##### Distance measurement - performance optimised
It has to be checked if the first date is later than the second date;
if so, they have to be toggled.

If start year and end year as well as start month and end month are identical,
the difference between the days (increased by `1`, see above) is returned.
```
if ( y1 == y2 && m1 == m2 )
    return d2 - d1 + 1;
```
It is much cheaper to do this once than inside a loop.

`var days = 0;` is defined and some space is kept free; it will be filled later.

If the function reaches this point, it is known that start month and end month differ.
They are treated separately (there is only one start month and one end month, independent of the input's size).

In the first month, the remaining days until this month's end have to be recognised:
```
days += last_date_of_month(y1, m1) - d1 + 1; // to understand the meaning of `+ 1`, see above
```

In the end of the summation, the end date's day is added. The end month obviosly starts with `1`, so no further calculation is necessary.
```
days += d2;
```

There is exactly one start year and one end year, but they maybe are identical.
The start year is considered in any case.  
The months to be taken into account for the start year begin with the month after the start month.
They must be, if start year and end year are identical, lower than the end month,
otherwise lower than the month after *December*.
The days to add are just the length of the respective month.
```
var limit = (y1 == y2) ? m2 : 12;
for ( i = (m1 + 1); i < limit; i++ )
    days += last_date_of_month(y1, i);
```
If (and only if) start year and end year are **not** identical,
the same has to be done for the months in the end year before the end month, starting with the first month.
```
for ( i = 0; i < m2; i++ )
    days += last_date_of_month(y2, i);
```

At this point, the function is able to handle dates in the same year or in two consecutive years.
The amount of operations is limited to start month, end month,
an iteration of maximum 11 times for the start year,
an iteration of maximum 11 times for the end year.

We will now add calculation for eventual years between start year and end year.
Assuming the amount of years between start year and end year is not greater than 400,
this calculation will also not exceed a maximum number of steps.
Code to ensure this condition to be true will be added later.
If start year and end year are identical, obviously nothing has to be done at this point.

The missing time between start year and end year are complete years, but it is yet unknown which are leap years and which are non-leap years.
The same trick is used as when determining the divisibility of 400 years (measured in days) by 7.
Since leap years are one day longer than non-leap years, we can sum up the non-leap years and later add one day for every leap year.
```
days += (y2 - y1 - 1) * 365; // `365` cannot be replaced by `1` due to wanted general validity 
```
Since we eventually toggled, `y1` is never greater than `y2`.  
Now leap years shall be added.
At first, the lowest and the highest potential leap year are detected.
```
var small_leap = Math.ceil((y1 + 1) / 4) * 4;
var large_leap = Math.floor((y2 - 1) / 4) * 4;
```
The following only shall be executed if `large_leap >= small_leap` (what is not guaranteed).
```
days += (large_leap - small_leap) / 4 + 1;
```
Only years divisible by 100 are missing. In a maximum amount of 400 years, there can't be more than 4 of them.
The algorithm iterates over them, ignores the ones divisible by 400, and subtracts `1` for the others.
```
for (i = (Math.ceil(small_leap/100) * 100); i <= (Math.floor(large_leap/100) * 100); i += 100) {
    if ( !(i % 400) )
        continue;
    days -= 1;
}
```

If the function's only imaginable purpose was detecting the day name index, the work would be done:
The start date must be *January 1st 2000*, maybe moved by a multiple of 400 years back or forth.
It must be **before** the date to examine: If we rely on the toggle mechanism, *Saturday* will remain
the same, but all other days swap their places.
Unless we are making a calendar for the Institute of Quantum Mechanics (*Today is Monday. Or maybe Thursday.
Ask a colleague to measure you*), that's not the result we'd like to see.
So we chose a start date before the date to examine, preferable as close to this date as possible:
Then the century loop is guaranteed never to exceed 4 iterations.

But if the function shall have a general purpose, we lose the independence of the input again for longer time spans.  
A time span of 400 years would need 4 iterations, a time span of 100000 years would need 1000 iterations.

The problem can be solved by building packages of 400 years without any iteration:  
We go back to the space we left free and subtract the start year from the end year.
```
var year_difference = y2 - y1;
```
If the result is smaller than `401`, nothing has to be done.  
If not, `year_difference` is divided by `400` and floored.
```
var factor = Math.floor(year_difference / 400);
```
If `factor` is divisible by `400`, it is decreased by `1`.
The reason is: In the general case,
it is not known if the start date is earlier or later in the year than the end date
(the original gap of multiples of `400` disappears).
```
if ( !(year_difference % 400) )
    factor -= 1;
```
The start year is moved forth by `factor`, multiplied with `400`.
`days` is increased by `factor`, multiplied with `146097` (this constant is obviously hardcoded).
```
days += factor * 146097;
y1 += factor * 400;
```

The complete function:
```
function date_distance (y1, m1, d1, y2, m2, d2) {
    if ( first_date_later(y1, y2, m1, m2, d1, d2) ) {
        var tmp = [y1, m1, d1];
        y1 = y2;
        m1 = m2;
        d1 = d2;
        y2 = tmp[0];
        m2 = tmp[1];
        d2 = tmp[2];
    }
    if ( y1 == y2 && m1 == m2 )
        return d2 - d1 + 1;
    var i;
    var days = 0;
    var year_difference = y2 - y1;
    if ( year_difference > 400 ) {
        var factor = Math.floor(year_difference / 400);
        if ( !(year_difference % 400) )
            factor -= 1;
        days += factor * 146097; // 146097 days are 400 years
        y1 += factor * 400;
    }
    days += last_date_of_month(y1, m1) - d1 + 1;
    var limit = (y1 == y2) ? m2 : 12;
    for ( i = (m1 + 1); i < limit; i++ )
        days += last_date_of_month(y1, i);
    if ( y1 != y2 ) {
        days += (y2 - y1 - 1) * 365;
        var small_leap = Math.ceil((y1 + 1) / 4) * 4;
        var large_leap = Math.floor((y2 - 1) / 4) * 4;
        if ( large_leap >= small_leap ) {
            days += (large_leap - small_leap) / 4 + 1;
            for ( i = (Math.ceil(small_leap / 100) * 100);
                  i <= (Math.floor(large_leap / 100) * 100);
                  i += 100 ) {
                if ( !(i % 400) )
                    continue;
                days -= 1;
            }
        }
        for ( i = 0; i < m2; i++ )
            days += last_date_of_month(y2, i);
    }
    days += d2;
    return days;
}
```

##### Distance measurement - Examples
From **Saturday April 1st 2000** to **Thursday December 26th 2002**
```
console.log( date_distance(2000, 3, 1, 2002, 11, 26) ); // 1000
```
From **Friday May 3rd 3453 B.C.** to **Saturday February 24th 2002 A.D.**
```
console.log( date_distance(-3452, 4, 3, 2024, 1, 24) ); // 2000000
```
Some thoughts about really large date distances, the first meant seriously:
* The optimal runtime complexity protects from long execution but not from number overflows.
If you want to work with really large numbers, you should consider re-writing the functions presented here
using a [suitable library](https://github.com/mentalmove/BigNumbers) for numbers of unlimited size.
* If you hope to find very old documents with date specifications, or if you hope to do time travels,
please keep in mind that people in ancient times might have used another time management.
Especially humans who lived **B.C.** might have problems with a calendar having Christ's birth as central reference date.

##### Day name detection using date distance measurement
`reference_year` is a year divisible by `400` that is lower or equal to the actual year and preferable close to it.
```
var reference_year = Math.floor(year / 400) * 400;
var distance = date_distance(reference_year, 0, 1, year, month, day) - 1;
day_index = (distance + DAY_INDEX_0_0_1) % 7;
day_name = days[day_index];
```
This technique might not be really faster than `weekday()` but also works with dates **B.C.**.

#### Day - Year
Sometimes, it is wanted to know the ordinal number of the day inside the year (i.e. ignoring the months).  
This can retrieved easily by using `date_distance()`.  
This time the included day can remain (**January 1st** shall have number `1`, not `0`).
```
var day_of_year = date_distance(year, 0, 1, year, month, day);
```

#### Day - Calendar week
To detect in which calendar week a distinct date lies,
the easiest method might be combining
detecting the new year's day index with the technique to detect
a year's [amount of calendar weeks](#year---calendar-weeks).  
The above results for `reference_year` and `day_of_year` are reused.  
A potential result *Sunday* must be treated as `7`, not `0`
because *Sunday* belongs per definition to the old week.
```
var new_year_distance = date_distance(reference_year, 0, 1, year, 0, 1) - 1;
var new_year_index = ((new_year_distance + DAY_INDEX_0_0_1) % 7) || 7;
var calendar_week = (new_year_index < 5) ? Math.ceil(day_of_year/7) : Math.floor(day_of_year/7);
```
This code might serve as an example for reusing information.  
*The cumbersome way would be:*  
* Detect the weekday of the year's first day. This consists of the subtasks
    * Find the next smaller year divisible by `400`
    * Measure the distance between this two year's first days.
    * Add `DAY_INDEX_0_0_1` (i.e. `6`), divide by `7` and take the remainder
* Depending on found weekday is *Monday*, *Tuesday*, *Wednesday*, *Thursday*, *Friday*, *Saturday* or *Sunday*,  
the first day of the first calendar week is *January 1st*, *December 31st*, *30th*, *29th*, *January 4th*, *3rd* or *2nd*.
* Measure distance between first day of the first calendar week and relevant day, divide by `7` and floor.

*This can be shortened:*  
The first calendar week starts on a day between *December 29th* and *January 4th*.
Measured from this day, the amount of weeks definitely has to be floored.  
*January 1st* is exactly in the middle of this period.  
Measured from *January 1st*, the amount of weeks has to be floored (*Friday* to *Sunday*) or ceiled (*Monday* to *Thursday*).
Basic value is the already detected `day_of_year`.

&nbsp;


## Week

#### Declaration
Weeks are identified either by start and end date (*from `December 26th 2022` to `January 1st 2023`*),
either by start date and unit *week* (*the week starting with `December 26th 2022`*).
They might overlap months or even years.

Before 1975, **calendar weeks** started with Sunday, since 1975 with Monday
(what might or might not have to do with the decreasing influence of the church).
To avoid chaos with the transition, developers decided to use a **zero based index** with Sunday having **0**:
Using this trick, weekday lists could remain the same although showing **1** for *Monday*.  
Nevertheless, a **calendar week** always starts on Monday;
Sunday always belongs to the old week (what is important to retrieve the ordinal number of a *calendar week* inside a year).  
Historically, the use of weekday numbers as zero based indices or ordinal numbers is heterogeneous.

#### Weekday names
Index | English name
----- | ------------
0     | Sunday
1     | Monday - *Start of week*
2     | Tuesday
3     | Wednesday
4     | Thursday
5     | Friday
6     | Saturday

#### Start of calendar week
It can be calculated at which date a distinct calendar week (first, second, third etc.) in a distinct year starts.
This task is divided into two parts:
* A general function to add an amount of days to a specific date
* Detect the start of the year's first calendar week and add the wanted amount of weeks
```
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
			// After December, a new year starts
			if ( time_values[1] == 11 ) {
				time_values[0]++;
				time_values[1] = 0;
			}
			else
				time_values[1]++;
		}
	}
}
function start_of_calendar_week (y, w) {
	var new_year_index = weekday(y, 0, 1) || 7;
	var result = [y, 0, (9 - new_year_index)];            // Friday, Saturday, Sunday
	if ( new_year_index == 1 )                            // Monday
		result[2] = 1;
	if ( new_year_index < 5 && new_year_index != 1 )      // Tuesday, Wednesday, Thursday
		result = [(y - 1), 11, (33 - new_year_index)];
	add_days(result, ((w - 1) * 7));
	return result;
}
```
At first, the weekday index of the respective year's start must be detected.
**This time, a potential result Sunday must be treated as 7, not 0**.
If the result is *Monday*, the first calendar week's start is *January 1st*.
If the result is *Tuesday*, *Wednesday* or *Thursday*, the first calendar week's start is *December 31st*, *30th* or *29th*,
otherwise *January 2nd*, *3rd* or *4th*.  
Parameter `w` is decreased by `1` (nothing shall be added for the first week) and multiplied with `7` (days in a week).  
The detected date (as array) and the days to add are given to `add_days()`.
In Javascript (and a lot of other languages), arrays in function calls are identified by reference so that changes to the array will
remain after leaving the function; in other languages (like **PHP**) `add_days()` needs a return value.  
Negative values for `days` are ignored - subtract functionality could be complemented in a similar way.  
The function does the following until interrupted:
* If the actual date's month has enough space for the remaining days:
	* Add the remaining days to the actual date's day component
	* EXIT
* Reduce the remaining days by the still available days for the actual date's month (including actual date's day)
* Move the actual date to the beginning of the next month
