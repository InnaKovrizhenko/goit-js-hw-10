import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function answerManyMatches() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function answerNoCountryName() {
  Notify.failure('Oops, there is no country with that name');
}

searchBox.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(event) {
  event.preventDefault();
  const countryName = event.target.value.trim();
  if (!countryName) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      console.log(data);
      sortCountries(data);
    })
    .catch(error => {
      answerNoCountryName(error);
    });
}

function sortCountries(countries) {
  if (countries.length > 10) {
    answerManyMatches();
    return;
  } else if (countries.length >= 2 && countries.length <= 10) {
    countryInfo.innerHTML = '';
    const markupList = countries
      .map(country => {
        return `<li><img src="${country.flags.svg}" alt="${country.flags.alt}" width="50" height="50">${country.name.official}</li>`;
      })
      .join('');

    countryList.insertAdjacentHTML('beforeend', markupList);
  } else if (countries.length === 1) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    const markupInfo = countries
      .map(country => {
        return `<img src="${country.flags.svg}" alt="${
          country.name.official
        }" width="50" height="50">
        <h1 class="country-item-name">${country.name.official}</h1>
        <p class="country-item-info">Capital: ${country.capital}</p>
        <p class="country-item-info">Population: ${country.population}</p>
        <p class="country-item-info">Languages: ${Object.values(
          country.languages
        )} </p>`;
      })
      .join();
    countryInfo.insertAdjacentHTML('beforeend', markupInfo);
  }
}
