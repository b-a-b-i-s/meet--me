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
            executeAll()
        })
}

function executeAll() {
    const singlevote = meetingInfo.singleVote //0;//an exei 1 epitrepetai mono mia psifos, diaforetika exei 0
    let currvote = 0;
    document.querySelector('h2').innerHTML= meetingInfo.title;
    document.querySelector('h3').innerHTML= meetingInfo.description
    document.querySelector('h4').innerHTML= `Created by: <b>${meetingInfo.creatorName}</b> at ${meetingInfo.createdTime}`;
    let dates = [];
    // const perDay = []
    for (i in data){
        
        if (dates.indexOf(data[i].date)==-1){
            dates.push(data[i].date)
        }
    }

    let maxoc = -Infinity;
    for (i in dates){
        let tempcount = 0
        for (j in data){
            if (dates[i]==data[j].date){
                tempcount+=1;
            }
        }
        if(tempcount>maxoc){
            maxoc = tempcount;
        }
    }
    for(i in dates){
        let tempdate = dates[i].substring(6,10)+'/'+dates[i].substring(0,5)
        dates[i] = tempdate
    }
    dates = dates.sort()
    const namedays = ['Sunday', 'Monday', 'Tuesday' ,'Wednesday','Thursday','Friday','Saturday']
    const daterow = document.querySelector('.date-row');
    for(i in dates){
        var lielement = document.createElement("TD");
        var liday = document.createElement("H2");
        liday.innerHTML= namedays[(new Date(dates[i])).getDay()];
        var lidate = document.createElement("H3");
        lidate.innerHTML = dates[i]
        lielement.appendChild(liday);
        lielement.appendChild(lidate);
        daterow.appendChild(lielement);
    }
    const meettable = document.querySelector('.all-dates-rows');
    for(i=0;i<maxoc ; i++){
        var lielement = document.createElement("TR");
        for(j=0;j<dates.length ; j++){
            var licell = document.createElement("TD");
            licell.classList.add("date"+j)
            licell.classList.add("time"+(new Date(dates[j])).getTime())
            lielement.appendChild(licell)
        }
        meettable.appendChild(lielement);
    }
    const occ = {}
    for(i in dates){
        occ[(new Date(dates[i])).getTime()]=0;
    }

    for(i in data){
        var tempdate = (new Date(data[i].date)).getTime()

        var meetcell = document.querySelectorAll('.time'+tempdate)[occ[tempdate]];
        occ[tempdate] +=1;
        meetcell.innerHTML = data[i].startTime + ' - ' + data[i].endTime
        meetcell.classList.add('meetinghours')
        var voters = document.createElement("P");
        voters.innerHTML = "<b>Voted by:"+' 6</b>'+'<br>John Doe'+', John Doe'+', John Doe '+', John Doe'+', John Doe '
        meetcell.dataset.dateId = data[i].dateId
        meetcell.appendChild(voters)
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
    document.querySelector('#submit-votes-btn').getElementsByClassName.display = 'block';
}

