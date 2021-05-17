const meetings = [];

const initialCurrentDateTemp = new Date()//2021,0,1);
const initialCurrentDate = new Date(initialCurrentDateTemp.getFullYear(), initialCurrentDateTemp.getMonth(), initialCurrentDateTemp.getDate());
let selectedDate = initialCurrentDate;

const quarters = document.querySelectorAll(".week-columns>div>div")

// quarters.forEach(el => el.addEventListener("click", function (e) {
//     tmp = document.createElement('div')
//     tmp.style.cl
//     tmp.style.backgroundColor = 'blue'
//     e.target.appendChild(tmp)
// })


// createMeeting(quarters[0])

for (let i = 0; i<quarters.length; i++) {
    quarters[i].addEventListener("click", (e) => createMeeting(e.target) );
}

function createWeekCalendar(date) {
    const currentDate = date;

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentDayOfWeek = currentDate.getDay();
    const previousMonth = new Date(currentYear, currentMonth, 0);
    const previousMonthStr = previousMonth.toLocaleString("en-US", {month: "long"});


    const numOfDates = new Date(currentYear, currentMonth+1, 0).getDate();
    const previousMonthNumOfDates = previousMonth.getDate();

    const text = document.querySelector(".week-title>h1");
    //const currMonthString = currentDate.toLocaleString("el-GR", {month: "short"})
    const currMonthString = currentDate.toLocaleString("en-US", {month: "short"});

    const startDate = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek);
    const startYear = startDate.toLocaleString("en-US", {year: "numeric"});
    const startMonth = startDate.toLocaleString("en-US", {month: "short"});
    const startDay = startDate.toLocaleString("en-US", {day: "numeric"});

    const end = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek + 6);
    const endYear = end.toLocaleString("en-US", {year: "numeric"});
    const endMonth = end.toLocaleString("en-US", {month: "short"});
    const endDay = end.toLocaleString("en-US", {day: "numeric"});

    if (startYear === endYear) {
        if (startMonth === endMonth) {
            text.textContent = `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
        }
        else {
            text.textContent = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
        }
    }
    else {
        text.textContent = `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
    }


    const days = document.querySelectorAll(".day-name>span");
    // if 
    for (let i = 0; i<7; i++) {
        const thisDay = new Date(currentYear, currentMonth, currentDay - currentDayOfWeek + i);
        days[3*i].textContent = thisDay.toLocaleString("en-US", {month: "short"});
        days[3*i+1].textContent = thisDay.toLocaleString("en-US", {day: "numeric"});

        if (thisDay.getTime() === initialCurrentDate.getTime()) {
            days[3*i].parentElement.classList.add('current-day')
        }
        else if (days[3*i].parentElement.classList.contains('current-day')) {
            days[3*i].parentElement.classList.remove('current-day')
        }
    }

    const allOptions = document.querySelectorAll('.option');

    for (let i=0; i<allOptions.length; i++) {
        allOptions[i].style.display = 'none';
    }

    const dateClass = `.d${selectedDate.getFullYear()}-${selectedDate.getDate()}-${selectedDate.getDate()}`;
    const selectedOptions = document.querySelectorAll(dateClass);

    for (let i=0; i<selectedOptions.length; i++) {
        selectedOptions[i].style.display = 'block';
    }

}

createWeekCalendar(selectedDate)


function createMeeting (e){
    if (e.nodeName=="SPAN") {
        console.log('spn')
        return null;
    }
    else {

    // e.removeEventListener('click',createMeeting, false)
    // e.removeEventListener("click")
    const newOption = document.createElement('div');
    newOption.classList.add('option');
    const startTime = e.firstChild.textContent;

    const content = document.createElement('span');
    const plusOne = Number(startTime[1]) + 1;
    let endTime;
    if (plusOne < 10) {
        endTime = startTime[0] + plusOne + startTime.slice(2);
    }
    else {
        endTime = plusOne + startTime.slice(2);
    }

    
    content.textContent = startTime + ' - ' + endTime;
    content.style.display = 'inline';
    newOption.appendChild(content);

    const xbtn = document.createElement('i');
    // xbtn.classList.add('far','fa-window-close','xButton-time');
    // xbtn.classList.add('fas','fa-window-close','xButton-time');
    xbtn.classList.add('fas','fa-times','xButton-time');
    // <i class="fas fa-times"></i>
    xbtn.addEventListener('click', () => newOption.remove())
    newOption.appendChild(xbtn)

    // const xbtn2 = document.createElement('span');
    // xbtn2.classList.add('close');
    // xbtn2.innerHTML = '&times;';
    // // xbtn.classList.add('fas','fa-window-close','xButton-time');
    // xbtn2.addEventListener('click', () => tmp.remove())

    // tmp.appendChild(xbtn2)

    // tmp.addEventListener('click', function (e) {
    //     e.target.remove();
    // })
    // tmp.style.height = e.target.height * 4;
    // tmp.style.backgroundColor = 'blue'

    newOption.addEventListener('mouseover', function() {
        xbtn.style.color = '#9e4922'
    })
    newOption.addEventListener('mouseout', function() {
        xbtn.style.color = 'transparent'
    })

    // newOption.dataset.week = 4;
    const dateClass = `d${selectedDate.getFullYear()}-${selectedDate.getDate()}-${selectedDate.getDate()}`;
    newOption.classList.add(dateClass);

    //grid placement

    newOption.style.gridRow = (Number(startTime.slice(0,2))*4 + 1) + Number(startTime.slice(3,5)/15);


    e.parentElement.appendChild(newOption);}
}

const mon = document.querySelectorAll(".column-mon>div");
const tue = document.querySelectorAll(".column-tue>div");
const wed = document.querySelectorAll(".column-wed>div");
const thu = document.querySelectorAll(".column-thu>div");
const fri = document.querySelectorAll(".column-fri>div");
const sat = document.querySelectorAll(".column-sat>div");
const sun = document.querySelectorAll(".column-sun>div");

for (let i = 1; i<=24*4; i++) {
    mon[i-1].style.gridRow = i +'/' + (i+1);
    mon[i-1].style.gridColumn = '1/2';
    // mon[i-1].style.gridRow = '1/2';

    tue[i-1].style.gridRow = i +'/' + (i+1);
    tue[i-1].style.gridColumn = '1/2';
    // tue[i-1].style.gridRow = '2/3';

    wed[i-1].style.gridRow = i +'/' + (i+1);
    wed[i-1].style.gridColumn = '1/2';
    // wed[i-1].style.gridRow = '3/4';

    thu[i-1].style.gridRow = i +'/' + (i+1);
    thu[i-1].style.gridColumn = '1/2';
    // thu[i-1].style.gridRow = '4/5';

    fri[i-1].style.gridRow = i +'/' + (i+1);
    fri[i-1].style.gridColumn = '1/2';
    // fri[i-1].style.gridRow = '5/6';

    sat[i-1].style.gridRow = i +'/' + (i+1);
    sat[i-1].style.gridColumn = '1/2';
    // sat[i-1].style.gridRow = '6/7';

    sun[i-1].style.gridRow = i +'/' + (i+1);
    sun[i-1].style.gridColumn = '1/2';
    // sun[i-1].style.gridRow = '7/8';
}

const prevButton = document.querySelector('#previousButtonWeek')
const nextButton = document.querySelector('#nextButtonWeek')

prevButton.addEventListener("click", function () {
    selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 7);
    createWeekCalendar(selectedDate);
})

nextButton.addEventListener("click", function () {
    selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 7);
    createWeekCalendar(selectedDate);
})
