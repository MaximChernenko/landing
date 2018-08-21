"use strict";

const key = "d8835c3dcdb54908aef110608182108";
const apiUrl = "https://api.apixu.com/v1/";
const geoApiUrl = "http://www.geoplugin.net/json.gp";
const current = "current.json";
const forecast = "forecast.json";
const input = document.querySelector(".form__input");
const form = document.querySelector(".form");
const result = document.querySelector(".result");
const resultCurrent = document.querySelector(".result__current");
form.addEventListener("submit", showResult);

updateUserWeather();

function showResult(e) {
  e.preventDefault();
  clear();
  fetchWeather(input.value, current)
    .then(data => ({
      current: data.current,
      location: data.location
    }))
    .then(({ current, location }) => {
      showLocation(location);
      showCurrentWeather(current.temp_c);
    })
    .then(() =>
      fetchWeather(input.value, forecast, true)
        .then(data => data.forecast.forecastday)
        .then(days => showForecastWeather(days))
        .catch(error => console.log(error))
    )
    .then(() => inputReset())
    .catch(() => alert("Введите валидное название города"));
}

function fetchWeather(city, val, flag = false) {
  let apiUrlstr;
  if (!flag) {
    apiUrlstr = `${apiUrl}${val}?key=${key}&q=${city}`;
  } else {
    apiUrlstr = `${apiUrl}${val}?key=${key}&q=${city}&days=7`;
  }
  return fetch(apiUrlstr).then(response => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  });
}

function showLocation(location) {
  const [rest, time] = location.localtime.split(" ");
  resultCurrent.textContent = `Country: ${location.country}. City: ${
    location.name
  }. Time: ${time}. `;
}

function showCurrentWeather(temp_c) {
  resultCurrent.textContent += `Температура в данный момент: ${temp_c} c`;
}

function showForecastWeather(days) {
  const table = document.createElement("table");
  const transformedDays = transformForecastObj(days);
  const rows = transformedDays.map(day => createRow(day));
  table.append(...rows);
  result.appendChild(table);
}

function transformForecastObj(days) {
  return days.map(day => {
    const date = day.date;
    const maxtemp_c = day.day.maxtemp_c;
    const mintemp_c = day.day.mintemp_c;
    return {
      date,
      mintemp_c,
      maxtemp_c
    };
  });
}

function createRow({ date, mintemp_c, maxtemp_c }) {
  let row = document.createElement("tr");
  const tdDate = document.createElement("td");
  tdDate.textContent = "date: " + date;
  const tdMinTemp = document.createElement("td");
  tdMinTemp.textContent = "min temp: " + mintemp_c;
  const tdMaxTemp = document.createElement("td");
  tdMaxTemp.textContent = "max temp: " + maxtemp_c;
  row.append(tdDate, tdMinTemp, tdMaxTemp);
  return row;
}

function inputReset() {
  input.value = "";
}

function updateUserWeather() {
  fetchUserWeather().then(data => {
    fetchWeather(data.geoplugin_city, current)
      .then(data => ({
        current: data.current,
        location: data.location
      }))
      .then(({ current, location }) => {
        showLocation(location);
        showCurrentWeather(current.temp_c);
        return location.name;
      })
      .then(name =>
        fetchWeather(name, forecast, true)
          .then(data => data.forecast.forecastday)
          .then(days => showForecastWeather(days))
          .catch(error => console.log(error))
      )
      .then(() => {
        inputReset();
      })
      .catch(error => console.log(error));
  });
}

function fetchUserWeather() {
  return fetch(geoApiUrl).then(response => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  });
}

function clear() {
  result.children[1].remove();
}
