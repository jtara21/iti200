//secret page

$(function(){

    $("#sprite3").click(function(){
        alert("Activating Secret Page!")
        $("#secretButton").css("visibility", "visible");
        $("#secretButton").css("display", "block");
        $("#sprite3").off("click");
    });
});

// leaderboard
function fetchLeaderboard() {
    fetch('/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboardList = document.getElementById('summoner-leaderboard');
            leaderboardList.innerHTML = ''; 

            data.forEach(player => {
                const listItem = document.createElement('li');
                listItem.textContent = `${player.rank}. ${player.playerName} - ${player.points}`;
                leaderboardList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}


window.addEventListener('load', fetchLeaderboard);


//dummy data
function useDummyData() {
    const dummyData = [
        { rank: "Flame Ruby", playerName: "Firecaster", points: 1000 },
        { rank: "Frost Sapphire", playerName: "Iceweaver", points: 950 },
        { rank: "Earth Emerald", playerName: "Rockshaper", points: 900 },
        { rank: "Storm Topaz", playerName: "Thunderstruck", points: 850 },
        { rank: "Shadow Onyx", playerName: "Darkcloak", points: 800 }
    ];

    const leaderboardList = document.getElementById('summoner-leaderboard');
    leaderboardList.innerHTML = ''; 

    dummyData.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.rank}. ${player.playerName} - ${player.points}`;
        leaderboardList.appendChild(listItem);
    });
}


//contact page
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => (data[key] = value));

        // send form data
        fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('ERROR');
            }
            return response.json();
        })
        .then(data => {
            console.log('SUCCESS:', data);
        
        })
        .catch(error => {
            console.error('Error:', error);
        
        });
    });

    //leaderboard
    function fetchLeaderboard() {
        fetch('/leaderboard')
            .then(response => response.json())
            .then(data => {
                
                console.log('Leaderboard data:', data);
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
            
            });
    }

    fetchLeaderboard();
});