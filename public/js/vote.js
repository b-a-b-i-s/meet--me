let data;
let initialVotes;
window.addEventListener("load", () => {
    
    fetch('/meeting/get-data/'+window.location.href.slice(-6), {
        method: 'GET', 
        // mode: 'cors', // no-cors, *cors, same-origin
        credentials: 'same-origin', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit

        })
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
})

function executeAll() {
    let finalOption;
    if (meetingInfo.state != 'open') {
        finalOption = Number(meetingInfo.state.slice(1,-1))
    }
    let singlevote = meetingInfo.singleVote //0;//an exei 1 epitrepetai mono mia psifos, diaforetika exei 0
    let currvote = 0;
    document.querySelector('h2').innerHTML= meetingInfo.title;
    document.querySelector('h3').innerHTML= meetingInfo.description
    document.querySelector('h4').innerHTML= `Created by: <b>${meetingInfo.creatorName}</b> at ${meetingInfo.createdTime}`;
    document.querySelector('.top-vote').style.display = 'block';
    if (document.querySelector('#name')) {
        document.querySelector('#name').value = thisUserName;
        document.querySelector('#new-name').value = thisUserName;
    }
    
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

    if (numOfDays==1) document.querySelector('.meeting-table').style.maxWidth = '500px';

    for(const key in betterData) {
        addDayData(key, numOfDays)
    }

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
            if (dateOptionsList[j].dateId == finalOption) meetcell.classList.add("final-option")

            const votes = initialVotes.filter(el=>el.VoteDateId==dateOptionsList[j].dateId)
            const userVote = votes.filter(el=>el.UserIdVote).length>0
            const voterNames = []
            votes.forEach(el=>voterNames.push(el.Name))
            if ((userVote) && meetingInfo.state == 'open') {
                meetcell.classList.add('chosen-vote')
                currvote++;
            }
            if (voterNames.length!=0) meetcell.classList.add('voted')

            const voters = document.createElement("P");
            voters.innerHTML = `<b>Voted by: ${voterNames.length}</b><br><span>${voterNames.join(', ')}</span>`
            meetcell.appendChild(voters)
        }
    }

    if (meetingInfo.state == 'open') {

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

    


        document.querySelector('.button-container').style.display = 'flex';

        const submitVotesBtn = document.querySelector('#submit-votes-btn')

        submitVotesBtn.onclick = () => {

            const votes = []
            document.querySelectorAll('.chosen-vote').forEach(el => votes.push(Number(el.dataset.dateId)))
            const name = document.querySelector('#new-name').value
            if ((!name) || (name == '')){
                document.querySelector('#alert-modal').style.display = 'block'
                document.querySelector('#alert-message').textContent = 'Enter a name'
                return;
            }
            else if (votes.length === 0) {
                document.querySelector('#alert-modal').style.display = 'block'
                document.querySelector('#alert-message').textContent = 'Select at least an option'
                return;
            }

            fetch(`/meeting/add-votes/${window.location.href.slice(-6)}/${name}`, {
                method: 'POST', 
                // mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin',// credentials: 'same-origin', // include, *same-origin, omit
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
                if (data=='invalid'){
                    alert("This won't work !!!")
                }
                else location.reload();
            })
            .catch(e => alert(e))
        }
        
        const chooseFinalBtn = document.querySelector('#choose-final');
        const confirmBtn = document.querySelectorAll('.choose-finals')[0];
        const cancelBtn = document.querySelectorAll('.choose-finals')[1];

        if (chooseFinalBtn) {
            chooseFinalBtn.onclick = () => {
        
                submitVotesBtn.style.display = 'none';
                chooseFinalBtn.style.display = 'none';
    
                document.querySelectorAll('.chosen-vote').forEach(el => el.classList.remove('chosen-vote'))
    
                currvote = 0
                let singlevoteBackup = singlevote
                singlevote = true
    
                cancelBtn.onclick = () => {
                    document.querySelectorAll('.chosen-vote').forEach(el => el.classList.remove('chosen-vote'))
                    currvote = 0
                    confirmBtn.style.display = 'none';
                    cancelBtn.style.display = 'none';
                    submitVotesBtn.style.display = 'block';
                    chooseFinalBtn.style.display = 'block';
                    singlevote = singlevoteBackup
                }
    
                confirmBtn.onclick = () => {
                    const votes = []
                    document.querySelectorAll('.chosen-vote').forEach(el => votes.push(Number(el.dataset.dateId)))
                    // const name = document.querySelectorAll('#name').value
                    if (votes.length != 1){
                        document.querySelector('#alert-modal').style.display = 'block'
                        document.querySelector('#alert-message').textContent = 'Choose at least an option'
                        return;
                    }
    
                    fetch(`/meeting/choose-fianl-option/${window.location.href.slice(-6)}`, {
                        method: 'POST', 
                        // mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin',// credentials: 'same-origin', // include, *same-origin, omit
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
                        if (data=='invalid'){
                            alert("This won't work !!!")
                        }
                        else location.reload();
                    })
                    .catch(e => alert(e))
                }
    
                confirmBtn.style.display = 'block';
                cancelBtn.style.display = 'block';
    
    
                
            }
        }

        
    }

}

