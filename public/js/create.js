const meetings = [];


// dayNames.style.gridTemplateColumns = 'repeat(8, calc(100% / 8 - ' + (scrollbarWidth+1) + 'px / 8))' + (scrollbarWidth) + 'px';



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
// document.defaultView.getComputedStyle(d[0]).gridTemplateColumns.slice(0,-4)
let globalPastDates = 0;

const weekColumns = document.querySelector('.week-columns')
let defaultHeight = parseInt(document.defaultView.getComputedStyle(weekColumns).height, 10)/24;
let defaultHeightInt = 4;
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

    const dateClass = `.d${selectedDateFirst.getFullYear()}-${selectedDateFirst.getMonth()}-${selectedDateFirst.getDate()}`;
    const selectedOptions = document.querySelectorAll(dateClass);

    for (let i=0; i<selectedOptions.length; i++) {
        selectedOptions[i].style.display = 'block';
    }

    globalPastDates = (initialCurrentDate.getTime() - selectedDateFirst.getTime())/(24*3600*1000) + 1;

    const hours = document.querySelectorAll('.week-columns>div')
    for (let i=0; i<7; i++) {
        if (new Date(selectedDateFirst.getTime() + i * 24*3600*1000) < initialCurrentDate) {
            let offset = 24*4*i;
            // console.log(offset)
            let j;
            for (j=offset; j<(offset+24*4); j++) {
                hours[j].classList.add('past')
            }
            hours[j-1].style.borderBottom = '0'
            if (i===6) {
                for (j=offset; j<(offset+24*4); j++) {
                    hours[j].style.borderRight = '0'
                }
            }

        }
        else {
            let offset = 24*4*i;
            // console.log(offset)
            let j;
            for (j=offset; j<(offset+24*4); j++) {
                hours[j].classList.remove('past')
            }
            hours[j-1].style.borderBottom = '0'
            if (i===6) {
                for (j=offset; j<(offset+24*4); j++) {
                    hours[j].style.borderRight = '0'
                }
            }
        }
        
    
    }

}



function createMeeting (e){
    // console.log(e)
    if (e.nodeName=="SPAN") {
        // console.log('spn')
        return null;
    }
    else if (Number(e.style.gridColumn[0]) < globalPastDates) {
        return null;
    }
    else {
        // e.removeEventListener('click',createMeeting, false)
        // e.removeEventListener("click")
        const newOption = document.createElement('div');
        
        const startTime = e.firstChild.textContent;

        const content = document.createElement('span');

        let plusTimeMinutes = (defaultHeightInt % 4) * 15;
        let minutes = Number(startTime.slice(3)) + plusTimeMinutes;
        let plusTimeHours = Math.floor(defaultHeightInt/4) + Math.floor(minutes/60);
        minutes = minutes % 60;
        if (minutes === 0) {
            minutes = '00';
        }

        let endTimeHours = Number(startTime.slice(0,2)) + plusTimeHours;
        let endTime;
        if (endTimeHours < 10) {
            endTime = '0' + endTimeHours + ':' + minutes;
        }
        else if ((endTimeHours === 24) && minutes === '00') {
            endTime = '24:00';
            
        }
        else if (endTimeHours >= 24) {
            endTimeHours -= 24
            endTime = endTimeHours + ":" + minutes
        }
        else {
            endTime = endTimeHours + ":" + minutes
        }

        
        content.textContent = startTime + ' - ' + endTime;
        content.style.display = 'inline';
        newOption.appendChild(content);

        const xbtn = document.createElement('i');
        // xbtn.classList.add('far','fa-window-close','xButton-time');
        // xbtn.classList.add('fas','fa-window-close','xButton-time');
        xbtn.classList.add('fas','fa-times','xButton-time');
        // <i class="fas fa-times"></i>
        xbtn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        })
        xbtn.addEventListener('click', (e) => {
            e.stopPropagation();
            newOption.remove()
        })
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
        const dateClass = `d${selectedDateFirst.getFullYear()}-${selectedDateFirst.getMonth()}-${selectedDateFirst.getDate()}`;
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
        newOption.dataset.height = defaultHeightInt;
        newOption.dataset.tempHeight = defaultHeightInt;

        newOption.classList.add('date-'+newOption.dataset.shortDate.replaceAll('/','-'));
        
        
        // console.log(new Date(selectedDate.getTime()))
        // console.log(- Number(selectedDate.getDay()) + Number(e.style.gridColumn[0]) - 1)
        // console.log((- selectedDate.getDay()))
        // console.log(e.style.gridColumn[0] - 1)

        

        const resizer = document.createElement('div');
        resizer.innerHTML = '<i class="fas fa-grip-lines"></i>'
        resizer.className = 'resizer';
        newOption.appendChild(resizer);
        resizer.addEventListener('mousedown', initDrag, false);

        dragElement(newOption);
        // resizeElement(resizer)

        newOption.style.height = defaultHeight + 'px';
        
        
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

let z = 10;



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
  elmnt.onmouseenter = () => {
    elmnt.style.zIndex = z;
    z++;
    elmnt.children[2].style.opacity = '0.7'
  }
  elmnt.onmouseleave = () => {
    elmnt.children[2].style.opacity = '1'
  }
  
  

  function dragMouseDown(e) {
    e.stopPropagation();
    e.target.style.zIndex = z;
    z++;
    e.target.style.cursor = "grabbing"
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
    // console.log(x1)

    // set the element's new position:
    const parentDivDims = e.target.parentElement.getBoundingClientRect()

    
    const width = parentDivDims['width']
    const height = parentDivDims['height']
    const rowNum = Number(elmnt.style.gridRow.split('/')[0])

    if ((y1 > height/(24*4*2)) && (rowNum < 24*4)) {
        elmnt.style.gridRow = (rowNum+1) + '/' + (rowNum+2);
        y1 = y1 - height/(24*4);
        

        let startTime = elmnt.dataset.startTime;
        let endTime = elmnt.dataset.endTime;

        let quarterStart = Number(startTime.slice(3)) + 15;
        let quarterEnd = Number(endTime.slice(3)) + 15;


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

        // console.log(rowNum+1 + Number(elmnt.dataset.height))

        if (rowNum+1 + Number(elmnt.dataset.tempHeight) > 98) {
            let height = elmnt.parentElement.getBoundingClientRect()['height'];
            elmnt.style.height = parseInt(elmnt.style.height, 10) - height/(24*4) + 'px';
            elmnt.dataset.tempHeight = Number(elmnt.dataset.tempHeight) - 1;
            // console.log(parseInt(elmnt.style.height, 10) - height/(24*4))
        }
        // if () {

        // }

    }
    else if ((y1 < -height/(24*4*2)) && (rowNum > 1)) {
        elmnt.style.gridRow = (rowNum-1) + '/' + (rowNum);
        y1 = y1 + height/(24*4);

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


        if ((rowNum-1 + Number(elmnt.dataset.tempHeight) <= 98) && (Number(elmnt.dataset.tempHeight) < Number(elmnt.dataset.height))) {
            let height = elmnt.parentElement.getBoundingClientRect()['height'];
            elmnt.style.height = parseInt(elmnt.style.height, 10) + height/(24*4) + 'px';
            elmnt.dataset.tempHeight = Number(elmnt.dataset.tempHeight) + 1;
            // console.log(parseInt(elmnt.style.height, 10) - height/(24*4))
        }

    }

    let firstCol = 1

    if (1 <= globalPastDates <= 7) {
        firstCol = globalPastDates;
    }



    const colNum = Number(elmnt.style.gridColumn.split('/')[0])
    if ((x1 > width/(7*2)) && (colNum < 7)) {
        elmnt.style.gridColumn = (colNum+1) + '/' + (colNum+2);
        x1 = x1 - width/7;

        const date = new Date(elmnt.dataset.date);

        const newDate = new Date(date.getTime() + 24*3600*1000)

        elmnt.dataset.date = newDate;
        oldClass = 'date-'+elmnt.dataset.shortDate.replaceAll('/','-')

        elmnt.dataset.shortDate = newDate.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"});
        
        newClass = 'date-'+elmnt.dataset.shortDate.replaceAll('/','-')
        elmnt.classList.replace(oldClass,newClass);


            // DO NOT CHANGE THE BELLOW
        
    }
        
    else if ((x1 < -width/(7*2)) && (colNum > firstCol)) {
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
    e.target.style.cursor = "grab"
    document.querySelector('.grabbing').classList.remove('grabbing');
    x1 = 0;
    y1 = 0;
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}





// RESIZING

let  startY, startHeight, height;

let elementDragged;

let endY = 0;

let y2 = 0;

function initDrag(e) {
    e.stopPropagation();

    elementDragged = e.target.parentElement
    if ((e.target == 'i') || (e.target.nodeName == 'I')) {
        elementDragged = e.target.parentElement.parentElement
    }
    elementDragged.style.zIndex = z;
    z++;
    elementDragged.style.cursor = "n-resize"
    document.body.style.cursor = "n-resize"

    startY = e.clientY;
    startHeight = parseInt(document.defaultView.getComputedStyle(elementDragged).height, 10);

    height = elementDragged.parentElement.getBoundingClientRect()['height'];

    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
    endY = 0;
    y2 = 0;
 }

function doDrag(e) {
    endY = startY - e.clientY
    startY = e.clientY

    y2 -= endY

    if (y2 > height/(24*4*2)) {
        let prevHeight = parseInt(document.defaultView.getComputedStyle(elementDragged).height, 10)
        defaultHeight = prevHeight + height/(24*4)
        defaultHeightInt++;
        elementDragged.style.height = defaultHeight + 'px';
        elementDragged.dataset.height = Number(elementDragged.dataset.height) + 1;
        elementDragged.dataset.tempHeight = elementDragged.dataset.height
        // console.log(defaultHeight)
        y2 -= height/(24*4);


        let startTime = elementDragged.dataset.startTime;
        let endTime = elementDragged.dataset.endTime;

    
        let quarterEnd = Number(endTime.slice(3)) + 15;

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
        
        elementDragged.children[0].textContent = startTime + ' - ' + endTime;
        elementDragged.dataset.endTime = endTime;

    }


    else if ((y2 < -height/(24*4*2)) && (parseInt(document.defaultView.getComputedStyle(elementDragged).height, 10) > height/(24*4))) {
        let prevHeight = parseInt(document.defaultView.getComputedStyle(elementDragged).height, 10)
        defaultHeight = prevHeight - height/(24*4)
        defaultHeightInt--;
        elementDragged.style.height = defaultHeight + 'px';
        elementDragged.dataset.height = Number(elementDragged.dataset.height) - 1;
        elementDragged.dataset.tempHeight = elementDragged.dataset.height

        y2 += height/(24*4);

        let startTime = elementDragged.dataset.startTime;
        let endTime = elementDragged.dataset.endTime;

        let quarterEnd = Number(endTime.slice(3)) - 15;
        if (quarterEnd === 0) {
            quarterEnd = '00';
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
        
        elementDragged.children[0].textContent = startTime + ' - ' + endTime;
        elementDragged.dataset.endTime = endTime;
    }
    // elementDragged.style.height = (startHeight + e.clientY - startY) + 'px';
}

function stopDrag(e) {
    document.body.style.cursor = "auto";
    elementDragged.style.cursor = "grab"
    document.documentElement.removeEventListener('mousemove', doDrag, false);    
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
}






































//--------------------------------------------


let selectedDateMonth = initialCurrentDate;
let clickedDay = '.none';
let clickeddate = 0;

const weekColumnsMonth = document.querySelector('.week-columns-month')

let defaultHeightMonth = parseInt(document.defaultView.getComputedStyle(weekColumnsMonth).height, 10)/24;


function createDayCalendar(date) {
    selectedDateMonth = date;
    const currentDate = date;

    const allOptions = document.querySelectorAll('.option');

    for (let i=0; i<allOptions.length; i++) {
        allOptions[i].style.display = 'none';
    }


    const dateClass = `.date-${selectedDateMonth.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"}).replaceAll('/','-')}`;
    clickedDay = dateClass;

    const selectedOptions = document.querySelectorAll(dateClass);

    for (let i=0; i<selectedOptions.length; i++) {
        selectedOptions[i].style.display = 'block';
    }

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const days = document.querySelectorAll(".day-name-month>span");
    // if 
    
    const thisDay = new Date(currentYear, currentMonth, currentDay);
    days[0].textContent = thisDay.toLocaleString("en-US", {month: "short"});
    days[1].textContent = thisDay.toLocaleString("en-US", {day: "numeric"});
    days[2].textContent = thisDay.toLocaleString("en-US", {year: "numeric"});

    if (thisDay.getTime() === initialCurrentDate.getTime()) {
        days[0].parentElement.classList.add('current-day')
    }
    else if (days[0].parentElement.classList.contains('current-day')) {
        days[0].parentElement.classList.remove('current-day')
    }


}


function createMeetingMonth (e){
    if (e.nodeName=="SPAN") {
        return null;
    }
    else {
        const startDate = new Date(selectedDateMonth);

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
        xbtn.classList.add('fas','fa-times','xButton-time');
        xbtn.addEventListener('mousedown', (e) => {
            e.stopPropagation()
        })
        xbtn.addEventListener('click', (e) => {
            e.stopPropagation()
            newOption.remove();
        })
        newOption.appendChild(xbtn)

        newOption.addEventListener('mouseover', function() {
            xbtn.style.color = '#9e4922'
        })
        newOption.addEventListener('mouseout', function() {
            xbtn.style.color = 'transparent'
        })
        
        const selectedDateFirst = new Date(Number(selectedDateMonth.getTime()) - Number(selectedDateMonth.getDay())*24*3600*1000);

        // newOption.dataset.week = 4;
        const dateClass = `d${selectedDateFirst.getFullYear()}-${selectedDateFirst.getMonth()}-${selectedDateFirst.getDate()}`;
        newOption.classList.add(dateClass);
        newOption.classList.add('option');

        newOption.style.gridRow = (Number(startTime.slice(0,2))*4 + 1) + Number(startTime.slice(3,5)/15);
        newOption.style.gridColumn = e.style.gridColumn;


        // const offset = - Number(selectedDate.getDay()) + Number(e.style.gridColumn[0]) - 1;
        const meetingDate = selectedDateMonth

        newOption.dataset.date = meetingDate;
        // DO NOT CHANGE THE BELLOW
        newOption.dataset.shortDate = meetingDate.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"});
        newOption.dataset.startTime = startTime;
        newOption.dataset.endTime = endTime;
        newOption.dataset.height = defaultHeightInt;
        newOption.dataset.tempHeight = defaultHeightInt;


        newOption.classList.add('date-'+newOption.dataset.shortDate.replaceAll('/','-'));

        const resizer = document.createElement('div');
        resizer.innerHTML = '<i class="fas fa-grip-lines"></i>'
        resizer.className = 'resizer';
        newOption.appendChild(resizer);
        resizer.addEventListener('mousedown', initDrag, false);

        dragElementHorizontal(newOption);
        // resizeElement(resizer)

        newOption.style.height = defaultHeightMonth + 'px';
        
        
        e.parentElement.appendChild(newOption);
        
    }
}
const allHoursMonth = document.querySelectorAll(".week-columns-month>div");

// time in hidden span initiallization
for (let i = 0; i<24*4; i++) {
    allHoursMonth[i].style.gridRow = (i%(24*4)+1) +'/' + (i%(24*4)+2);
    allHoursMonth[i].style.gridColumn = (Math.floor(i/(24*4))+1) +'/' + (Math.floor(i/(24*4))+2);
    allHoursMonth[i].addEventListener("click", (e) => createMeetingMonth(e.target) );
}







let currdate = initialCurrentDateTemp;
const highlighted_days = [];

var modalday = document.getElementById("daymodal");
var linkday = document.getElementById("signuplink");
var spanday = document.getElementsByClassName("close-sign");

function prevmonth(givendate) {
    const givenmonth = givendate.getMonth();
    const givenyear = givendate.getFullYear();
    prev = new Date(givenyear, givenmonth, 0);
    currdate = prev;
    return prev;
}
function nextmonth(givendate) {
    const givenmonth = givendate.getMonth();
    const givenyear = givendate.getFullYear();
    const next = new Date(givenyear, givenmonth+1, 1);
    currdate = next;
    return next;
}
// huuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
function createMonthDates(givendate) {
    // console.log(givendate);
    const givenmonth = givendate.getMonth();
    const givenyear = givendate.getFullYear();
    const givenday = givendate.getDay();
    const numofdays = new Date(givenyear, givenmonth+1, 0).getDate();
    const start = new Date(givenyear, givenmonth, 1).getDay();
    let lastmonth = new Date(givenyear, givenmonth, 0).getDate();
    const lastday = new Date(givenyear, givenmonth + 1, 0).getDay();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const firstDayOfSelMonth = new Date(givenyear, givenmonth, 1)
    for (let i = 0; i < start; i++) {
        const newday = document.createElement("LI");
        newday.innerHTML = lastmonth++ - start +1;
        newday.classList.add("notcurr");
        if (firstDayOfSelMonth <= initialCurrentDateTemp) {
            newday.classList.add("past");
        }
        else {
            newday.classList.add("curr");

            current = new Date(givenyear, givenmonth-1, lastmonth - start);
            let currentShort = current.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"});
            currentShort = '.date-'+currentShort.replaceAll('/','-')
            if (document.querySelectorAll(currentShort).length != 0) {
                newday.classList.add("selected");
            }
            // let cnt = 0;
            // for (point in highlighted_days) {
            //     if (current == highlighted_days[point]) {
            //         cnt = 1;
            //         break;
            //     }
            // }
            // if (cnt===1) {
            //     newday.classList.add("selected");
            // }
        }
        const days = document.querySelector(".days")
        days.appendChild(newday);
    }

    for (let i = 0; i < numofdays; i++) {
        const newday = document.createElement("LI");
        newday.innerHTML = i + 1;
        if (new Date(givenyear, givenmonth, i+2) <= new Date()) {
            newday.classList.add("past");

        } else {
            newday.classList.add("curr");
            // console.log(new Date(givenyear, givenmonth, i).getTime());
            
            current = new Date(givenyear, givenmonth, i+1);
            let currentShort = current.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"});
            currentShort = '.date-'+currentShort.replaceAll('/','-')
            if (document.querySelectorAll(currentShort).length != 0) {
                newday.classList.add("selected");
            }
            // let cnt = 0;
            // for (point in highlighted_days) {
            //     if (current == highlighted_days[point]) {
            //         cnt = 1;
            //         break;
            //     }
            // }
            // if (cnt===1) {
            //     newday.classList.add("selected");
            // }
        }
        const days = document.querySelector(".days")
        days.appendChild(newday);
    }

    let newmonthday = 1;

    const firstDayOfNextlMonth = new Date(givenyear, givenmonth+1, 1)

    for (let i = lastday; i < 6; i++) {
        const newday = document.createElement("LI");
        newday.innerHTML = newmonthday++;
        if (firstDayOfNextlMonth <= initialCurrentDateTemp) {
            newday.classList.add("past");
        }
        else {
            newday.classList.add("curr");

            current = new Date(givenyear, givenmonth+1, newmonthday-1);
            
            let currentShort = current.toLocaleString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"});
            currentShort = '.date-'+currentShort.replaceAll('/','-')
            if (document.querySelectorAll(currentShort).length != 0) {
                newday.classList.add("selected");
            }
            
            // let cnt = 0;
            // for (point in highlighted_days) {
            //     if (current == highlighted_days[point]) {
            //         cnt = 1;
            //         break;
            //     }
            // }
            // if (cnt===1) {
            //     newday.classList.add("selected");
            // }
        }
        newday.classList.add("notcurr");
        const days = document.querySelector(".days")
        days.appendChild(newday);
    }

    const titlemonth = months[givenmonth];

    const title = document.querySelector(".month h2");
    title.innerHTML = titlemonth;
    const monthcontainer = document.querySelector(".month");
    monthcontainer.appendChild(title);
  
}

function clearcurrentmonth(){
    const days = document.querySelector(".days");
    days.innerHTML = "";
    const monthcontainer = document.querySelector(".month h2");
    monthcontainer.innerHTML = "";
}

function saveDate(givendate, numday) {
    const givenmonth = givendate.getMonth();
    const givenyear = givendate.getFullYear();
    highlighted_days.push(new Date(givenyear, givenmonth, numday).getTime());
}

function deleteDate(givendate, numday) {
    const givenmonth = givendate.getMonth();
    const givenyear = givendate.getFullYear();
    let ind = highlighted_days.indexOf(new Date(givenyear, givenmonth, numday).getTime());
    
    // console.log(ind);
    if (ind !== -1) {
      highlighted_days.splice(ind, 1);
    }
}

createMonthDates(currdate);
const leftarrow = document.querySelector(".arrow.leftarr");
const rightarrow = document.querySelector(".arrow.rightarr");

leftarrow.addEventListener('click', event => {
    clearcurrentmonth();
    createMonthDates(prevmonth(currdate));
    if(document.querySelectorAll(clickedDay).length===0){
        clickeddate.classList.remove("selected");
        deleteDate(currdate, clickeddate.innerHTML);
    }
});

rightarrow.addEventListener('click', event => {
    clearcurrentmonth();
    createMonthDates(nextmonth(currdate));
    if(document.querySelectorAll(clickedDay).length===0){
        clickeddate.classList.remove("selected");
        deleteDate(currdate, clickeddate.innerHTML);
    }
});

let random_init = 0
const monthAll = document.querySelector('#all-container');
const weekCal = document.querySelector('.cont')
window.onresize = () => {
    weekCal.style.width = `${window.innerWidth*0.7}px`
}
document.getElementById('daytodate').addEventListener('click', function (e) {
    if (e.target.classList.contains("past")) {
        return ;
    }
    if (!(e.target.classList.contains("selected"))) {
        saveDate(currdate, e.target.innerHTML);
    }
    if (random_init==1){
        if(document.querySelectorAll(clickedDay).length===0){
            clickeddate.classList.remove("selected");
            deleteDate(currdate, clickeddate.innerHTML);
        }
    }
    else {
        random_init = 1
    }
    monthAll.style.gridTemplateColumns = '5fr 1.2fr'
    weekCal.style.width = `${window.innerWidth*0.7}px`
    window.innerWidth
    // console.log('ok')
    clickeddate = e.target;
    e.target.classList.add("selected");
    const givenmonth = currdate.getMonth();
    const givenyear = currdate.getFullYear();
    if (e.target.classList.contains('notcurr')) {
        if (e.target.innerHTML > 15) {
            createDayCalendar(new Date(givenyear, givenmonth-1, e.target.innerHTML));
        }
        else {
            createDayCalendar(new Date(givenyear, givenmonth+1, e.target.innerHTML));
        }
    }
    else {
        createDayCalendar(new Date(givenyear, givenmonth, e.target.innerHTML));
    }
    modalday.style.display = "block";

    // To set the scroll
    let defaultHeightInitial = parseInt(document.defaultView.getComputedStyle(weekColumnsMonth).height, 10)/24 || 96;
    if (defaultHeightInitial==="auto") defaultHeightInitial=96
    const el = document.querySelector(".week-days-month");
    el.scrollTop = 0;
    el.scrollLeft = 0;

    // To increment the scroll
    el.scrollTop += defaultHeightInitial * 8 - defaultHeightInitial/4*2.5;
    
})

spanday.onclick = function () {
    modalday.style.display = "none";
    monthAll.style.gridTemplateColumns = '1fr'
    if(document.querySelectorAll(clickedDay).length===0){
        clickeddate.classList.remove("selected");
        deleteDate(currdate, clickeddate.innerHTML);
    }
}



function dragElementHorizontal(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
    elmnt.onmouseenter = () => {
      elmnt.style.zIndex = z;
      z++;
      elmnt.children[2].style.opacity = '0.7'
    }
    elmnt.onmouseleave = () => {
      elmnt.children[2].style.opacity = '1'
    }
    
    
  
    function dragMouseDown(e) {
      e.stopPropagation();
      e.target.style.zIndex = z;
      z++;
      e.target.style.cursor = "grabbing"
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
      // console.log(x1)
  
      // set the element's new position:
      const parentDivDims = e.target.parentElement.getBoundingClientRect()
  
      
      const width = parentDivDims['width']
      const height = parentDivDims['height']
      const rowNum = Number(elmnt.style.gridRow.split('/')[0])
  
      if ((y1 > height/(24*4*2)) && (rowNum < 24*4)) {
          elmnt.style.gridRow = (rowNum+1) + '/' + (rowNum+2);
          y1 = y1 - height/(24*4);
          
  
          let startTime = elmnt.dataset.startTime;
          let endTime = elmnt.dataset.endTime;
  
          let quarterStart = Number(startTime.slice(3)) + 15;
          let quarterEnd = Number(endTime.slice(3)) + 15;
  
  
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
  
          // console.log(rowNum+1 + Number(elmnt.dataset.height))
  
          if (rowNum+1 + Number(elmnt.dataset.tempHeight) > 98) {
              let height = elmnt.parentElement.getBoundingClientRect()['height'];
              elmnt.style.height = parseInt(elmnt.style.height, 10) - height/(24*4) + 'px';
              elmnt.dataset.tempHeight = Number(elmnt.dataset.tempHeight) - 1;
              // console.log(parseInt(elmnt.style.height, 10) - height/(24*4))
          }
          // if () {
  
          // }
  
      }
      else if ((y1 < -height/(24*4*2)) && (rowNum > 1)) {
          elmnt.style.gridRow = (rowNum-1) + '/' + (rowNum);
          y1 = y1 + height/(24*4);
  
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
  
  
          if ((rowNum-1 + Number(elmnt.dataset.tempHeight) <= 98) && (Number(elmnt.dataset.tempHeight) < Number(elmnt.dataset.height))) {
              let height = elmnt.parentElement.getBoundingClientRect()['height'];
              elmnt.style.height = parseInt(elmnt.style.height, 10) + height/(24*4) + 'px';
              elmnt.dataset.tempHeight = Number(elmnt.dataset.tempHeight) + 1;
              // console.log(parseInt(elmnt.style.height, 10) - height/(24*4))
          }
  
      }
  
  
      
    }
  
    function closeDragElement(e) {
      document.body.style.cursor = "auto";
      e.target.style.cursor = "grab"
      document.querySelector('.grabbing').classList.remove('grabbing');
      x1 = 0;
      y1 = 0;
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
























const weekSelector = document.querySelector('#week-selector')
const monthSelector = document.querySelector('#month-selector')
let init_random2 = true;
const week = document.querySelector('.week')
const cont = document.querySelector('.cont')

weekSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('selected')){
        return;
    }

    monthAll.style.gridTemplateColumns = '1fr'
    modalday.style.display = "none";
    if (clickedDay != '.none') {
        if(document.querySelectorAll(clickedDay).length===0){
            clickeddate.classList.remove("selected");
            deleteDate(currdate, clickeddate.innerHTML);
        }
    }

    weekSelector.classList.replace('unselected','selected')
    monthSelector.classList.replace('selected','unselected')
    
    week.style.display = 'grid'
    cont.style.display = 'none'
    
    
    let options = document.querySelectorAll('.option');

    options.forEach((e) => {
        weekColumns.appendChild(e);
        e.style.gridColumn = Number(new Date(e.dataset.date).getDay()) + 1
    })
    
    selectedDate = selectedDateMonth

    createWeekCalendar(selectedDate)
    
    
        
    // createWeekCalendar(selectedDate)
    // options.forEach((e) => e.remove())
    if (init_random2) {
        init_random2 = false;

        const el = document.querySelector(".week-days");

        // To set the scroll
        el.scrollTop = 0;
        el.scrollLeft = 0;

        // To increment the scroll
        defaultHeight = parseInt(document.defaultView.getComputedStyle(weekColumns).height, 10)/24
        console.log(defaultHeight)
        el.scrollTop += defaultHeight * 8 - defaultHeight/4*2.5;
    
        const weekDays = document.querySelector('.week-days')
        const scrollbarWidth = weekDays.offsetWidth - weekDays.clientWidth;
        // console.log(scrollbarWidth)
        // document.querySelector('#hours')
        let width = Number(document.querySelector('.hours').offsetWidth);

        const dayNames = document.querySelector('.day-names')
        let gridTemplateCols = document.defaultView.getComputedStyle(dayNames).gridTemplateColumns.slice(0,-4)
        if (scrollbarWidth<5) dayNames.style.gridTemplateColumns = 'repeat(8, 1fr) 0px';
        else {
            const div = document.createElement('div')
            dayNames.appendChild(div)
            dayNames.style.gridTemplateColumns = 'repeat(8, 1fr)' + (scrollbarWidth+3) + 'px';
            dayNames.style.gridTemplateColumns = `calc( (100% - ${scrollbarWidth+3}px)/8 - 1px ) calc( (100% - ${scrollbarWidth+3}px)/8 ) repeat(6, calc( (100% - ${scrollbarWidth+3}px)/8 + 0.32px )) ${scrollbarWidth+3}px`;
            // dayNames.style.gridTemplateColumns = `${width-1}px repeat(7, ${width}px) ${scrollbarWidth}px`;
        }
    }

})


monthSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('selected')){
        return;
    }

    weekSelector.classList.replace('selected','unselected')
    monthSelector.classList.replace('unselected','selected')
    
    week.style.display = 'none'
    cont.style.display = 'block'

    let options = document.querySelectorAll('.option');

    options.forEach((e) => {
        weekColumnsMonth.appendChild(e)
        e.style.gridColumn = '1/2';
    })

    selectedDateMonth = selectedDate
    currdate = selectedDate
    
    clearcurrentmonth();
    createMonthDates(selectedDateMonth)

    // options.forEach((e) => e.remove())
    
})

const publishBtn = document.querySelector('.submit-options-btn')
const modalPublish = document.querySelector("#publish-modal")
const spanpub = document.getElementsByClassName("close-sign")[1];

spanpub.onclick = function () {
    modalPublish.style.display = "none";
}

publishBtn.onclick = function () {
    modalPublish.style.display = "block";
}


window.onclick = function (event) {
    // console.log(event.target);
    // if (event.target == modalday) {
    //     monthAll.style.gridTemplateColumns = '1fr'
    //     modalday.style.display = "none";
    //     if(document.querySelectorAll(clickedDay).length===0){
    //         clickeddate.classList.remove("selected");
    //         deleteDate(currdate, clickeddate.innerHTML);
    //     }
    // }
    if (event.target == modalin) {
        modalin.style.display = "none";
    }
    if (event.target == modalup) {
        modalup.style.display = "none";
    }

    if (event.target == modalPublish) {
        modalPublish.style.display = "none";
    }

}



// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function demo() {
//   console.log('Taking a break...');
//   await sleep(2000);
//   console.log('Two seconds later, showing sleep in a loop...');

//   // Sleep in loop
//   for (let i = 0; i < 15; i++) {
//     if (i === 3)
//       await sleep(2000);
//     console.log(i);
//   } 
// }




const finalPublishBtn = document.querySelector('#final-publish')

finalPublishBtn.onclick = () => {
    
    const allOptions = document.querySelectorAll('.option')
    const lista = []
    console.log(allOptions)

    allOptions.forEach( (el) => {
        let dict = {}
        dict['date'] = el.dataset.shortDate
        dict['startTime'] = el.dataset.startTime
        dict['endTime'] = el.dataset.endTime

        lista.push(dict)
    })

    const name = document.querySelector("#meetme-name").value

    const oneVote = document.querySelector("#checkboxOne").checked

    const description = document.querySelector("#description").value

    const dataToSend = {"name":name, "oneVote":oneVote, "description":description, "lista":lista};

    if ((lista.length != 0) && (name != '')) {
        // demo()


        fetch('/add-meeting', {
            method: 'POST',
            // mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
    
            body: JSON.stringify(dataToSend) // body data type must match "Content-Type" header
        })
        .then((response) => {
            if (response.ok) {        
                console.log('Written to db')
                return response.text()
            }
            else {
                alert("HTTP-Error: " + response.status);
            }
        })
        .then((data) => {
            console.log(data)
            window.location.href = '/publish/'+data
        })

        

        
    }
    else if (lista.length == 0){
        alert("No options selected")
    }

   
}