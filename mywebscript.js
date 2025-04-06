const weatherIcons = {
    "clear": "☀️",
    "cloudy": "☁️",
    "pcloudy": "⛅",
    "mcloudy": "🌥️",
    "rain": "🌧️",
    "lightrain": "🌦️",
    "oshower": "🌦️",
    "snow": "❄️",
    "fog": "🌫️",
    "thunderstorm": "⛈️"
};

const weatherConditionsMap = {
    "clear": "Clear",
    "cloudy": "Cloudy",
    "pcloudy": "Partly Cloudy",
    "mcloudy": "Mostly Cloudy",
    "rain": "Rain",
    "lightrain": "Light Rain",
    "oshower": "Isolated Shower",
    "snow": "Snow",
    "fog": "Fog",
    "thunderstorm": "Thunderstorm"
};

function updateCoordinates() {
    const selectedValue = document.getElementById('citySelect').value;
    if (selectedValue) {
        const [lat, lon] = selectedValue.split(',');
        console.log("Coordinates updated: ", lat, lon);
    }
}

function getWeather() {
    const selectedValue = document.getElementById('citySelect').value;
    if (!selectedValue) {
        alert("Please select a city.");
        return;
    }

    const [lat, lon] = selectedValue.split(',');
    const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById('weatherDisplay').innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
        });
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weatherDisplay');
    weatherDiv.innerHTML = ""; 

    if (!data.dataseries) {
        weatherDiv.innerHTML = "<p>No weather data available.</p>";
        return;
    }

    data.dataseries.slice(0, 7).forEach((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);

        const rawCondition = day.weather.toLowerCase();
        const timePeriod = day.timepoint < 12 ? "DAY" : "NIGHT";
        const weatherConditionKey = rawCondition.replace(/night|day/, "").trim();
        const weatherCondition = weatherConditionsMap[weatherConditionKey] || "Unknown Condition";

        const weatherIcon = weatherIcons[weatherConditionKey] || "❓";
        const animationClass = weatherConditionKey.includes("rain") ? "rain" : weatherConditionKey.includes("cloud") ? "cloud" : weatherConditionKey.includes("clear") ? "sun" : "";

        const weatherCard = `
            <div class="weather-card">
                <h3>${date.toDateString()}</h3>
                <span class="weather-icon ${animationClass}">${weatherIcon}</span>
                <p>${weatherCondition} - ${timePeriod}</p>
                <p>High: ${day.temp2m}°C</p>
                <p>Low: ${day.temp2m - 3}°C</p>
            </div>
        `;
        weatherDiv.innerHTML += weatherCard;
    });
}