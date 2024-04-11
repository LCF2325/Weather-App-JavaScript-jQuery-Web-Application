$(document).ready(function() {
  setInterval(updateDateTime, 1000);
  setInterval(getWeather, 60000);
 });
 

 function updateDateTime() {
  $('#currentDateTime').text(new Date().toLocaleString());
 }


function getWeather() {
  const apiKey = '93d48d64233b1cf19ce4bd54efe8afcf';
  const cityInput = document.getElementById('cityInput').value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;

  try {
    $.ajax({
      url: url,
      method: 'GET',
      success: function(data) {
        if (data.cod === '404') {
          document.getElementById('weatherInfo').innerHTML = 'City not found';
          return;
        }

        if (!data.main || !data.main.temp) {
          document.getElementById('weatherInfo').innerHTML = 'Weather data not available';
          return;
        }

        const weatherDescription = data.weather[0].description;
        const capitalizedWeatherDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
        const weatherIcon = getWeatherIcon(data.weather[0].main);

        const weatherInfo = `
          <div class="weather-box">
            <h2>${data.name}, ${data.sys.country} ${weatherIcon}</h2>
            <div class="weather-info-item">Temperature: ${data.main.temp}°C</div>
            <div class="weather-info-item">Feels Like: ${data.main.feels_like}°C</div>
            <div class="weather-info-item">Min Temperature: ${data.main.temp_min}°C</div>
            <div class="weather-info-item">Max Temperature: ${data.main.temp_max}°C</div>
          </div>

          <div class="weather-box">
            <div class="weather-info-item">Weather: ${capitalizedWeatherDescription}</div>
            <div class="weather-info-item">Humidity: ${data.main.humidity}%</div>
          </div>

          <div class="weather-box">
            <div class="weather-info-item">Wind Speed: ${data.wind.speed} m/s</div>
            <div class="weather-info-item">Visibility: ${data.visibility / 1000} km</div>
          </div>
        `;

        document.getElementById('weatherInfo').innerHTML = weatherInfo;
        document.getElementById('weatherInfo').style.display = 'block';
        changeBackground(data.weather[0].main);
        updateDateTime(data);
      },
      error: function(error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherInfo').innerHTML = 'An error occurred';
      }
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    document.getElementById('weatherInfo').innerHTML = 'An error occurred';
  }
}



function getWeatherIcon(weatherCondition) {
  let iconClass;
  switch (weatherCondition.toLowerCase()) {
    case 'clear':
      iconClass = 'icon/clear.gif';
      break;
    case 'clouds':
      iconClass = 'icon/cloud.gif';
      break;
    case 'rain':
      iconClass = 'icon/rain.gif';
      break;
    case 'snow':
      iconClass = 'icon/snow.gif';
      break;
    default:
      iconClass = 'icon/default.gif';
  }
  return `<img src="${iconClass}" alt="${weatherCondition}" class="weather-icon">`;
}

function changeBackground(weatherCondition) {
  let imageUrl;
  switch (weatherCondition.toLowerCase()) {
    case 'clear':
      imageUrl = 'media/clear.jpg';
      break;
    case 'clouds':
      imageUrl = 'media/cloud.jpg';
      break;
    case 'rain':
      imageUrl = 'media/rain.jpg';
      break;
    case 'snow':
      imageUrl = 'media/snow.jpg';
      break;
    default:
      imageUrl = 'media/default.jpg';
  }

  console.log("Background image URL:", imageUrl);
  document.body.style.backgroundImage = `url(${imageUrl})`;
}


function getPictures() {
  const accessKey = 'KUlPhkwFo4EdzI1l9aHr5e6FAf0QWRR17GP1n71OZwI';
  const category = $('#pictureSearch').val();
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(category)}&client_id=${accessKey}`;

  try {
    $.ajax({
      url: url,
      method: 'GET',
      success: function(data) {
        if (data.total === '404') {
          $('#pictureContainer').html('No pictures found');
        } else {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const pictureUrl = data.results[randomIndex].urls.small;
          $('#pictureContainer').html(`<img src="${pictureUrl}" alt="${data.results[randomIndex].alt_description}">`);
        }
        $('#pictureContainer').show();
      },
      error: function(xhr, status, error) {
        console.error('Error fetching pictures:', error);
        $('#pictureContainer').html('An error occurred');
      }
    });
  } catch (error) {
    console.error('Error fetching pictures:', error);
    $('#pictureContainer').html('An error occurred');
  }
}


getPictures();

setInterval(getPictures, 20000);
