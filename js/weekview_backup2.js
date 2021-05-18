const meetings = [];
//commit test change
const initialCurrentDateTemp = new Date()//2021,0,1);
const initialCurrentDate = new Date(initialCurrentDateTemp.getFullYear(), initialCurrentDateTemp.getMonth(), initialCurrentDateTemp.getDate());
let selectedDate = initialCurrentDate;


// quarters.forEach(el => el.addEventListener("click", function (e) {
//     tmp = document.createElement('div')
//     tmp.style.cl
//     tmp.style.backgroundColor = 'blue'
//     e.target.appendChild(tmp)
// })


// createMeeting(quarters[0])


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

    // const selectedDateFirst = new Date(Number(selectedDate.getTime()) )
    // const offset = - Number(selectedDate.getDay());
    const selectedDateFirst = new Date(Number(selectedDate.getTime()) - Number(selectedDate.getDay())*24*3600*1000);

    const dateClass = `.d${selectedDateFirst.getFullYear()}-${selectedDateFirst.getDate()}-${selectedDateFirst.getDate()}`;
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
        const startDate = new Date(selectedDate - 24*3600*1000*selectedDate.getDay());
        // e.removeEventListener('click',createMeeting, false)
        // e.removeEventListener("click")
        const newOption = document.createElement('div');
        
        const startTime = e.firstChild.textContent;

        const content = document.createElement('span');
        const plusOne = Number(startTime.slice(0,2)) + 1;
        let endTime;
        if (plusOne < 10) {
            endTime = '0' + plusOne + startTime.slice(2);
        }
        else if ((plusOne === 24) && startTime.slice(3) !== '00') {
            endTime = '00' + startTime.slice(2);
            
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

        
        const selectedDateFirst = new Date(Number(selectedDate.getTime()) - Number(selectedDate.getDay())*24*3600*1000);

        // newOption.dataset.week = 4;
        const dateClass = `d${selectedDateFirst.getFullYear()}-${selectedDateFirst.getDate()}-${selectedDateFirst.getDate()}`;
        newOption.classList.add(dateClass);
        newOption.classList.add('option');

        //grid placement

        newOption.style.gridRow = (Number(startTime.slice(0,2))*4 + 1) + Number(startTime.slice(3,5)/15);
        newOption.style.gridColumn = e.style.gridColumn;


        const offset = - Number(selectedDate.getDay()) + Number(e.style.gridColumn[0]) - 1;
        const meetingDate = new Date(Number(selectedDate.getTime()) + offset*24*3600*1000);

        newOption.dataset.date = meetingDate;
        // DO NOT CHANGE THE BELLOW
        newOption.dataset.shortDate = meetingDate.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"});
        newOption.dataset.startTime = startTime;
        newOption.dataset.endTime = endTime;
        
        // console.log(new Date(selectedDate.getTime()))
        // console.log(- Number(selectedDate.getDay()) + Number(e.style.gridColumn[0]) - 1)
        // console.log((- selectedDate.getDay()))
        // console.log(e.style.gridColumn[0] - 1)

        dragElement(newOption);
        e.parentElement.appendChild(newOption);
        
    }
}

const allHours = document.querySelectorAll(".week-columns>div");

// time in hidden span initiallization
for (let i = 0; i<24*4*7; i++) {
    allHours[i].style.gridRow = (i%(24*4)+1) +'/' + (i%(24*4)+2);
    allHours[i].style.gridColumn = (Math.floor(i/(24*4))+1) +'/' + (Math.floor(i/(24*4))+2);
    allHours[i].addEventListener("click", (e) => createMeeting(e.target) );
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




// dragElement(document.getElementById("mydiv"));
let x1 = 0
let y1 = 0
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e.target.classList.add('grabbing')
    // console.log(e.target)
    document.body.style.cursor = "grabbing"
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    y1 = 0
  }

  function elementDrag(e) {

    
    
    // e.target.style.position = 'absolute';
    e = e || window.event;
    e.preventDefault();

    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    

    x1 -= pos1
    y1 -= pos2

    // set the element's new position:
    const parentDivDims = e.target.parentElement.getBoundingClientRect()
    
    const width = parentDivDims['width']
    const height = parentDivDims['height']
    const rowNum = Number(elmnt.style.gridRow.split('/')[0])

    if ((y1 >= height/(24*4)) && (rowNum < 24*4)) {
        elmnt.style.gridRow = (rowNum+1) + '/' + (rowNum+2);
        y1 = y1 - height/(24*4);
        

        let startTime = elmnt.dataset.startTime;
        let endTime = elmnt.dataset.endTime;

        let quarterStart = Number(startTime.slice(3)) + 15;
        if (quarterStart === 0) {
            quarterStart = '00';
        }
        let quarterEnd = Number(endTime.slice(3)) + 15;
        if (quarterEnd === 0) {
            quarterEnd = '00';
        }

        if (quarterStart !== 60) {
            startTime = startTime.slice(0,3) + quarterStart;
        }
        else {
            let plusOne = Number(startTime.slice(0,2)) + 1;
            if (plusOne < 10) {
                startTime = '0' + plusOne + ':00';
            }
            else {
                startTime = plusOne + ':00';
            }
        }

        if (quarterEnd !== 60) {
            if (endTime.slice(0,2) === '24') {
                endTime = '00:' + quarterEnd;
            }
            else {
                endTime = endTime.slice(0,3) + quarterEnd;
            }
        }
        else {
            let plusOne = Number(endTime.slice(0,2)) + 1;
            if (plusOne < 10) {
                endTime = '0' + plusOne + ':00';
            }
            else {
                endTime = plusOne + ':00';
            }
        }
        
        elmnt.children[0].textContent = startTime + ' - ' + endTime;


        elmnt.dataset.startTime = startTime;
        elmnt.dataset.endTime = endTime;

    }
    if ((y1 <= -height/(24*4)) && (rowNum > 1)) {
        elmnt.style.gridRow = (rowNum-1) + '/' + (rowNum);
        y1 = y1 + height/(24*4);

        let prevTime = elmnt.children[0].textContent;

        let startTime = elmnt.dataset.startTime;
        let endTime = elmnt.dataset.endTime;

        let quarterStart = Number(startTime.slice(3)) - 15;
        if (quarterStart === 0) {
            quarterStart = '00';
        }
        let quarterEnd = Number(endTime.slice(3)) - 15;
        if (quarterEnd === 0) {
            quarterEnd = '00';
        }

        if (quarterStart !== -15) {
            startTime = startTime.slice(0,3) + quarterStart;
        }
        else {
            let minusOne = Number(startTime.slice(0,2)) - 1;
            if (minusOne < 10) {
                startTime = '0' + minusOne + ':45';
            }
            else {
                startTime = minusOne + ':45';
            }
        }

        if (quarterEnd !== -15) {
            endTime = endTime.slice(0,3) + quarterEnd;
            if (endTime === '00:00') {
                endTime = '24:00'
            }
        }
        else {
            let minusOne = Number(endTime.slice(0,2)) - 1;
            if (minusOne < 10) {
                endTime = '0' + minusOne + ':45';
            }
            else {
                endTime = minusOne + ':45';
            }
        }
        
        elmnt.children[0].textContent = startTime + ' - ' + endTime;

        elmnt.dataset.startTime = startTime;
        elmnt.dataset.endTime = endTime;

    }




    const colNum = Number(elmnt.style.gridColumn.split('/')[0])
    if ((x1 >= width/7) && (colNum < 7)) {
        elmnt.style.gridColumn = (colNum+1) + '/' + (colNum+2);
        x1 = x1 - width/7;

        const date = new Date(elmnt.dataset.date);

        const newDate = new Date(date.getTime() + 24*3600*1000)

        elmnt.dataset.date = newDate;

            // DO NOT CHANGE THE BELLOW
        elmnt.dataset.shortDate = newDate.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"});
    }
        
    if ((x1 <= -width/7) && (colNum > 1)) {
        elmnt.style.gridColumn = (colNum-1) + '/' + (colNum);
        x1 = x1 + width/7;

        const date = new Date(elmnt.dataset.date);

        const newDate = new Date(date.getTime() - 24*3600*1000)

        elmnt.dataset.date = newDate;

            // DO NOT CHANGE THE BELLOW
        elmnt.dataset.shortDate = newDate.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"});
    }
        

    
  }

  function closeDragElement(e) {
    document.body.style.cursor = "auto";
    document.querySelector('.grabbing').classList.remove('grabbing');

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}