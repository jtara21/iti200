
let pointsIncrement = 50;

//secret page
$(function(){

    $("#sprite3").click(function(){
        alert("Activating Secret Page!")
        $("#secretButton").css("visibility", "visible");
        $("#secretButton").css("display", "block");
        $("#sprite3").off("click");
    });
});

// updates user points
function updatePoints() {
    fetch('/updatePoints', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increaseBy: pointsIncrement }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('ERROR');
        }
        return response.json();
    })
    .then(data => {
        console.log('points updated successfully:', data);
        
        fetchLeaderboard();
    })
    .catch(error => {
        console.error('error updating points:', error);
    
    });
}

//leaderboard
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
        .catch(error => {
            console.error('Error fetching leaderboard:', error);
    
        });
}

// page refresh shows leaderboard
window.addEventListener('load', function() {
    fetchLeaderboard();
});

// sign up page
$(document).ready(function() {
    const signUpForm = document.getElementById('signUpForm');

    signUpForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(signUpForm);
        const data = {};
        formData.forEach((value, key) => (data[key] = value));

        // send form data
        fetch('/signup', {
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
            console.log('Sign up successful:', data);
        
            window.location.href = "/homepage.html";
        })
        .catch(error => {
            console.error('Error signing up:', error);
            
        });
    });
});

// contact form
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
            console.log('success', data);
            
        })
        .catch(error => {
            console.error('error:', error);
            
        });
    });
});



//Listens for next button
$("#submitButton").click(function(){
  
    updatePoints(pointsIncrement);
    
    pointsIncrement *= 2;
});