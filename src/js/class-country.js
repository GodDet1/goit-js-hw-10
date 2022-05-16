import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import 'notiflix/dist/notiflix-3.2.5.min.css';

export default class COUNTRY {
  constructor(delay) {
    this.delay = delay;
    this.input = document.querySelector('#search-box');
    this.countryList = document.querySelector('.country-list');
    this.countryInfo = document.querySelector('.country-info');

    this.eventListener();
  }

  eventListener() {
    this.input.addEventListener('input', debounce(this.onInputValue.bind(this), this.delay));
  }

  onInputValue(event) {
    this.countryInfo.innerHTML = '';
    this.countryList.innerHTML = '';
    const countryInput = event.target.value.trim();

    this.fetchResponse(countryInput)
      .then(this.countryRender.bind(this))
      .then(this.toTenCountries.bind(this))
      .then(this.toMuchCountries.bind(this))
      .catch(err => Notiflix.Notify.failure(`Oops, there is no country with that name`));
  }

  fetchResponse(country) {
    return fetch(`https://restcountries.com/v3.1/name/${country}`).then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
  }

  countryRender(countries) {
    if (countries.length === 1) {
      const {
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      } = countries[0];

      if (official == 'Russian Federation') {
        const template = this.countryTemplate(
          'Russian-pigs Federation',
          ['Mordor'],
          'Soon will be less',
          'https://www.gorod.cn.ua/image/users/16757/blog_00000138.jpg',
          ['Oink Oink'],
        );

        this.countryInfo.insertAdjacentHTML('beforeend', template, 200);

        return countries;
      }

      const template = this.countryTemplate(official, capital, population, svg, languages, 50);

      this.countryInfo.insertAdjacentHTML('beforeend', template);
    }
    return countries;
  }

  toTenCountries(countries) {
    if (countries.length <= 10 && countries.length > 1) {
      const template = countries
        .map(({ flags: { svg }, name: { official } }) => {
          return this.countriesTemplate(svg, official);
        })
        .join('');
      this.countryList.insertAdjacentHTML('beforeend', template);
    }
    return countries;
  }

  toMuchCountries(countries) {
    if (countries.length > 10) {
      Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
  }

  countryTemplate(official, capital, population, flags, languages, height) {
    const template = `<div class="country__flag-name">
          <img src="${flags}" alt="" height="${height}" class="country__flag" />
          <h2 class="country__name">${official}</h2>
        </div>
        <p class="country__data"><strong>Capital:</strong> ${Object.values(capital)}</p>
        <p class="country__data"><strong>Population:</strong> ${population}</p>
        <p class="country__data"><strong>Languages:</strong> ${Object.values(languages)}</p>`;
    return template;
  }

  countriesTemplate(flags, official) {
    const template = `<li class="country-list__item">
          <img src="${flags}" alt="" height="30" class="country__flag" />
          <h2 class="country__name">${official}</h2>
      </li>`;
    return template;
  }
}
