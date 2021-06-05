let data;
let initialVotes;
window.onload = () => {
    
    fetch('/meeting/get-data/'+window.location.href.slice(-6))
        .then((response) => {console.log(response)
            if (response.ok) {        
                return response.json()}
            else {
                alert("HTTP-Error: " + response.status);
            }
        })
        .then((jsonData) => {
            console.log('data', jsonData)

            data = jsonData.data
            initialVotes = jsonData.votes
            meetingInfo = jsonData.meetingInfo
            thisUserName = jsonData.thisUserName
            executeAll()
        })
}

function executeAll() {
    const singlevote = meetingInfo.singleVote //0;//an exei 1 epitrepetai mono mia psifos, diaforetika exei 0
    let currvote = 0;
    document.querySelector('h2').innerHTML= meetingInfo.title;
    document.querySelector('h3').innerHTML= meetingInfo.description
    document.querySelector('h4').innerHTML= `Created by: <b>${meetingInfo.creatorName}</b> at ${meetingInfo.createdTime}`;
    document.querySelector('.top-vote').style.display = 'block';
    document.querySelector('#name').value = thisUserName;
    // let dates = [];

    data.forEach(el => {
        el.date = el.date.slice(-4)+'/'+el.date.slice(0,5)
    })
        
    data.sort((firstEl,secondEl) => {
        if (firstEl.date>secondEl.date) return 1
        else return -1
    })
    
    const betterData = {}

    data.forEach(el => {
        try{betterData[el.date].push(el)}
        catch{betterData[el.date] = [el]}
    })

    const daterow = document.querySelector('.date-row');
    const namedays = ['Sunday', 'Monday', 'Tuesday' ,'Wednesday','Thursday','Friday','Saturday']
    function addDayData(day, numOfDays) {
        const lielement = document.createElement("TD");
        lielement.style.width = `${100/numOfDays}%`
        const liday = document.createElement("H2");
        liday.innerHTML= namedays[(new Date(day)).getDay()];
        const lidate = document.createElement("H3");
        lidate.innerHTML = day
        lielement.appendChild(liday);
        lielement.appendChild(lidate);
        daterow.appendChild(lielement);
    }
    
    let numOfDays = 0;
    let maxoc = 0;
    const betterDataKeys = [];
    
    for(const key in betterData) {
        betterData[key].sort((firstEl,secondEl) => {
            if (firstEl.startTime>secondEl.startTime) return 1;
            else return -1;
        })
        betterDataKeys.push(key)
        numOfDays ++;
        maxoc = Math.max(maxoc, betterData[key].length);
    }

    for(const key in betterData) {
        addDayData(key, numOfDays)
    }


    // for (i in data){
    //     if (dates.indexOf(data[i].date)==-1){
    //         dates.push(data[i].date)
    //     }
    // }

    // let maxoc = -Infinity;
    // for (i in dates){
    //     let tempcount = 0
    //     for (j in data){
    //         if (dates[i]==data[j].date){
    //             tempcount+=1;
    //         }
    //     }
    //     if(tempcount>maxoc){
    //         maxoc = tempcount;
    //     }
    // }
    // for(i in dates){
    //     let tempdate = dates[i].substring(6,10)+'/'+dates[i].substring(0,5)
    //     dates[i] = tempdate
    // }
    // dates = dates.sort()
    // const namedays = ['Sunday', 'Monday', 'Tuesday' ,'Wednesday','Thursday','Friday','Saturday']
    // const daterow = document.querySelector('.date-row');
    // for(i in dates){
    //     var lielement = document.createElement("TD");
    //     var liday = document.createElement("H2");
    //     liday.innerHTML= namedays[(new Date(dates[i])).getDay()];
    //     var lidate = document.createElement("H3");
    //     lidate.innerHTML = dates[i]
    //     lielement.appendChild(liday);
    //     lielement.appendChild(lidate);
    //     daterow.appendChild(lielement);
    // }

    const meettable = document.querySelector('.all-dates-rows');
    for(let i=0;i<maxoc ; i++){
        const lielement = document.createElement("TR");
        for(j=0;j<numOfDays ; j++){
            var licell = document.createElement("TD");
            // licell.classList.add("date"+j)
            // licell.classList.add("time"+(new Date(betterDataKeys[j])).getTime())
            lielement.appendChild(licell)
        }
        meettable.appendChild(lielement);
    }
    // const occ = {}
    // for(i in dates){
    //     occ[(new Date(dates[i])).getTime()]=0;
    // }

    const tableCells = document.querySelectorAll('TBODY TD') || document.querySelectorAll('tbody td');

    for(let i=0; i<numOfDays; i++){
        const dateOptionsList = betterData[betterDataKeys[i]];
        for (let j=0; j<dateOptionsList.length ; j++){
            // var tempdate = (new Date(data[i].date)).getTime()

            // var meetcell = document.querySelectorAll('.time'+tempdate)[occ[tempdate]];
            const meetcell = tableCells[i + j*numOfDays]
            // occ[tempdate] +=1;
            meetcell.innerHTML = `<span>${dateOptionsList[j].startTime} - ${dateOptionsList[j].endTime}</span>`
            meetcell.classList.add('meetinghours')
            meetcell.dataset.dateId = dateOptionsList[j].dateId

            const votes = initialVotes.filter(el=>el.VoteDateId==dateOptionsList[j].dateId)
            const userVote = votes.filter(el=>el.UserIdVote).length>0
            const voterNames = []
            votes.forEach(el=>voterNames.push(el.Name))
            if (userVote) {
                meetcell.classList.add('chosen-vote')
                currvote++;
            }
            if (voterNames.length!=0) meetcell.classList.add('voted')

            const voters = document.createElement("P");
            voters.innerHTML = `<b>Voted by: ${voterNames.length}</b><br><span>${voterNames.join(', ')}</span>`
            meetcell.appendChild(voters)
        }
    }
    document.querySelectorAll('.meetinghours').forEach(item => {
        item.addEventListener('click', event => {
            if(item.classList.contains('chosen-vote')){
                item.classList.remove('chosen-vote')
                currvote-=1;
                
            }
            else{
                if( singlevote && (currvote != 0)){
                    alert("You must provide only a single vote!")
                }
                else{
                    item.classList.add('chosen-vote')
                    currvote+=1;
                }
            }
        })
    })
    document.querySelector('#submit-votes-btn').style.display = 'block';

    document.querySelector('#submit-votes-btn').onclick = () => {

        const votes = []
        document.querySelectorAll('.chosen-vote').forEach(el => votes.push(Number(el.dataset.dateId)))
        

        fetch('/meeting/'+window.location.href.slice(-6), {
            method: 'POST', 
            // mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
    
            body: JSON.stringify(votes) // body data type must match "Content-Type" header
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
            location.reload();
        })
        .catch(e => alert(e))
    }
}

