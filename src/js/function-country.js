import '../css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 500;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
  const countryInput = event.target.value.trim();

  fetchCountries(countryInput)
    .then(oneCountry)
    .then(toMuchCountries)
    .then(upToTenCountries)
    .catch(err => Notiflix.Notify.failure(` Oops, there is no country with that name`));
}

function oneCountry(countries) {
  if (countries.length === 1) {
    const {
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    } = countries[0];

    countryTemplate(official, capital, population, svg, languages);
  }
  return countries;
}

function upToTenCountries(countries) {
  if (countries.length <= 10 && countries.length > 1) {
    const template = countries
      .map(({ flags: { svg }, name: { official } }) => countriesTemplate(svg, official))
      .join('');
    refs.countryList.insertAdjacentHTML('beforeend', template);
  }
}

function toMuchCountries(countries) {
  {
    if (countries.length > 10) {
      Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
    return countries;
  }
}

function countryTemplate(official, capital, population, flags, languages) {
  const template = `<div class="country__flag-name">
        <img src="${flags}" alt="" height="50" class="country__flag" />
        <h2 class="country__name">${official}</h2>
      </div>
      <p class="country__data"><strong>Capital:</strong> ${Object.values(capital)}</p>
      <p class="country__data"><strong>Population:</strong> ${population}</p>
      <p class="country__data"><strong>Languages:</strong> ${Object.values(languages)}</p>`;
  return refs.countryInfo.insertAdjacentHTML('beforeend', template);
}

function countriesTemplate(flags, official) {
  const template = `<li class="country-list__item">
          <img src="${flags}" alt="" height="30" class="country__flag" />
          <h2 class="country__name">${official}</h2>
      </li>`;
  return template;
}
