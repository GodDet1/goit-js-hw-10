export default function fetchCountries(country) {
  return fetch(`https://restcountries.com/v3.1/name/${country}`).then(response => {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  });
}
