//funktion som updaterar tid och datum
function updateTimeAndDate(){

    const now = new Date();

    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}
updateTimeAndDate();
setInterval(updateTimeAndDate, 1000);


// Funktion för att spara den redigerade texten
function saveContent() {
    const content = document.getElementById("dash-heading").innerText;
    localStorage.setItem("dashboardTitle", content);
}

function setupEventListeners(){
    document.querySelector('.addButton').addEventListener('click', toggleAddLinkForm);
    document.getElementById('confirm-new-link').addEventListener('click', addNewLink);
    document.getElementById('dash-heading').addEventListener("blur", saveContent);

    loadSavedContent();
    loadLinks();
}

function toggleAddLinkForm() {
    document.getElementById('add-link-form').classList.toggle('hidden');
}

function loadSavedContent() {
    const savedContent = localStorage.getItem("dashboardTitle");
    if(savedContent) {
        document.getElementById("dash-heading").innerText = savedContent;
    }
}

document.addEventListener("DOMContentLoaded", setupEventListeners);




function addNewLink() {
    const name = document.getElementById('new-link-name').value;
    const url = document.getElementById('new-link-url').value;

    if(!name || !url) {
        alert('Fill in both fields to add new link');
        return;
    }

    const linkList = document.getElementById('link-list');
    if(linkList.children.length >= 5) {
        alert('five links is enough');
        return;
    }

    const li = document.createElement('li');
    li.innerHTML = `<a href="${url}" target="_blank">${name}</a> <button class="xBtn">X</button>`;

    li.querySelector('.xBtn').addEventListener('click', function() {
        li.remove();
        saveLinks();
    });

    linkList.appendChild(li);

    document.getElementById('new-link-name').value = '';
    document.getElementById('new-link-url').value = '';
    document.getElementById('add-link-form').classList.add('hidden');

    saveLinks();
}



function saveLinks() {
    const links = [];
    document.querySelectorAll('#link-list li').forEach(li => {
        const link = li.querySelector('a');
        links.push({name: link.textContent, url: link.getAttribute('href') });
    });
    localStorage.setItem('links', JSON.stringify(links));
}

function loadLinks() {
    const links = JSON.parse(localStorage.getItem('links')) || [];
    const linkList = document.getElementById('link-list');

    linkList.innerHTML = '';

    links.forEach(link => {
        const li = document.createElement('li');
        li.innerHTML = `<a href= "${link.url}" target="_blank"> ${link.name}</a> <button class="xBtn">X</button>`;

        li.querySelector('.xBtn').addEventListener('click', function() {
            li.remove();
            saveLinks();
        });

        linkList.appendChild(li);
    })
}



// koordinater för Varberg
const lat = 57.1057; 
const lon = 12.2621; 

// Konstruera URL för API-anropet
const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`;

function fetchWeather() {

    fetch(url)
    .then(response => response.json())
    .then(data => {


        console.log("fetchWeather is running");

        const weatherDescriptions = {
          1: 'fa-sun',
          2: 'fa-cloud-sun',
          3: 'fa-cloud',
          4: 'fa-cloud',
          5: 'fa-cloud',
          6: 'fa-smog',
          7: 'fa-cloud-rain',
          8: 'fa-bolt',
          9: 'fa-cloud-raid',
          10: 'fa-cloud-rain',
          11: 'fa-cloud-showers-heavy',
          12: 'fa-bolt',
          13: 'fa-snowflake',
          14: 'fa-snowflake',
          15: 'fa-snowflake',
          16: 'fa-snowflake'
        };

        const currentWeather = data.timeSeries[0].parameters.find(param => param.name === 'Wsymb2').values[0];
        const weatherTomorrow = data.timeSeries[13].parameters.find(param => param.name === 'Wsymb2').values[0];
        const weatherDayAfter = data.timeSeries[25].parameters.find(param => param.name === 'Wsymb2').values[0];

        const tempToday = data.timeSeries[0].parameters.find(param => param.name === 't').values[0] + '°C';
        const tempTomorrow = data.timeSeries[13].parameters.find(param => param.name === 't').values[0] + '°C';
        const tempDayAfter = data.timeSeries[25].parameters.find(param => param.name === 't').values[0] + '°C';

        const weatherIconToday = weatherDescriptions[currentWeather];
        const weatherIconTomorrow = weatherDescriptions[weatherTomorrow];
        const weatherIconDayAfter = weatherDescriptions[weatherDayAfter];



        document.getElementById('temp-today').textContent = tempToday;
        document.getElementById('icon-today').classList.add('fas', weatherIconToday);

        document.getElementById('temp-tomorrow').textContent = tempTomorrow;
        document.getElementById('icon-tomorrow').classList.add('fas', weatherIconTomorrow);

        document.getElementById('temp-day-after').textContent = tempDayAfter;
        document.getElementById('icon-day-after').classList.add('fas', weatherIconDayAfter);



        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        const weekDays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

        document.getElementById('weekday-today').textContent = "idag ";
        document.getElementById('weekday-tomorrow').textContent = "Imorgon ";
        document.getElementById('weekday-day-after').textContent = weekDays[dayAfterTomorrow.getDay()] + " ";
        
    })
    .catch(error => {
        console.error('Couldnt fetch weather data from smhi', error);
    });
}
fetchWeather();



//klick funktion på generateBtn, genererar från gradients array 
document.querySelector('.generateBtn').addEventListener('click', function() {
    const gradients = [
        'linear-gradient(135deg, #78aafa 0%, #c2e9fb 100%)',
        'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
        'linear-gradient(0deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(132deg, #F4D03F 0%, #16A085 100%)',
        'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)',
        'linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%)'
    ];

    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    document.body.style.backgroundImage = randomGradient;

}); 



const urlFootball = 'https://api-football-v1.p.rapidapi.com/v3/fixtures/rounds?league=39&season=2023&current=true';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '385cd1b0f0mshc29f519e4b5882ep15e3a1jsn230caf55b8d7',
		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};


async function fetchCurrentRound() {
    const response = await fetch(urlFootball, options);
    const data = await response.json();
    return data.response[0];
}

async function fetchFixturesForRound(round){
    const urlFixtures = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2023&round=${encodeURIComponent(round)}`;
    const response = await fetch(urlFixtures, options);
    const data = await response.json();
    return data.response;
}

async function displayUpcomingFixtures() {
    try {
        const round = await fetchCurrentRound();
        const fixtures = await fetchFixturesForRound(round);

        fixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

        const container = document.querySelector('.widget.football');
        container.innerHTML = '';

        fixtures.forEach(fixture => {
            const fixtureElement = document.createElement('div');
            fixtureElement.className = 'fixture';

            //Ikoner för hemmalag
            const homeTeamIcon = document.createElement('img');
            homeTeamIcon.src = fixture.teams.home.logo;
            homeTeamIcon.alt = fixture.teams.home.name;
            homeTeamIcon.className = 'team-icon';

            //Ikoner för bortalag
            const awayTeamIcon = document.createElement('img');
            awayTeamIcon.src = fixture.teams.away.logo;
            awayTeamIcon.alt = fixture.teams.away.name;
            awayTeamIcon.className = 'team-icon';


            const matchDate = new Date(fixture.fixture.date);
            const timeString = matchDate.toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const dateString = matchDate.toLocaleDateString('sv-SE');
            //matchinfo
            const gameInfo = document.createElement('p');
            gameInfo.textContent = `${fixture.teams.home.name} vs ${fixture.teams.away.name} - ${dateString} kl. ${timeString}`;

            fixtureElement.appendChild(homeTeamIcon);
            fixtureElement.appendChild(gameInfo);
            fixtureElement.appendChild(awayTeamIcon);

            
            container.appendChild(fixtureElement);

        });
    } catch(error){
        console.error('Could not fetch football data', error);
    }
}

displayUpcomingFixtures();














