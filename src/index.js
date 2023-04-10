import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { styles } from './styles';

const searchBox = document.querySelector('input#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const clearSearch = reference => (reference.innerHTML = '');

const inputHandler = e => {
  const inputText = e.target.value.trim().toLowerCase();
  if (!inputText) {
    clearSearch(list);
    clearSearch(info);
    info.style.padding = '0px';
    return;
  }
  fetchCountries(inputText)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      showCountries(data);
    })
    .catch(error => {
      clearSearch(list);
      clearSearch(info);
      Notify.failure('Oops, there is no country with that name');
    });
};

const showCountries = data => {
  if (data.length > 1) {
    const showList = showCountryList(data);
    list.innerHTML = showList;
    clearSearch(info);
    info.style.padding = '0px';
  } else {
    const showInfo = showCountryInfo(data);
    info.innerHTML = showInfo;
    info.style.padding = '10px';
    clearSearch(list);
  }
};

const showCountryInfo = data => {
  return data.map(
    ({
      name,
      capital,
      population,
      flags,
      languages,
    }) => `<h1 style="display: flex; align-items: center"><img src="${
      flags.png
    }" alt="${name.official}" width="90" height="60" style = "margin: 10px">${
      name.official
    }</h1>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages)}</p>`
  );
};

const showCountryList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li 
        style="display: flex; align-items: center; gap: 10px; border: 1px solid; border-radius: 5px; padding: 10px; margin: 3px; background-color: lightgray"
        ><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

searchBox.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
