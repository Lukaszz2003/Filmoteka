import axios from 'axios';

const API_URL = 'https://api.themoviedb.org/3/';
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjg0NzNlZDkyMjFiZjUxZjY1ZjYyMzFmZWM1ZGNhNiIsInN1YiI6IjY0YjlhODFmMzAwOWFhMDBjNWI3OTc1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-kZ0dgbGdwQSV2jydkgQdOLeOv-bFL8HeHwItjiQ9dk';

async function authenticate() {
  const response = await axios({
    method: 'get',
    url: API_URL + 'authentication',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer ' + ACCESS_TOKEN,
    },
  });

  if (response.data.status_message != 'Success.') {
    console.error('API: Authentication Failed!');
  } else {
    console.log('API: Authentication Success!');
  }
}

async function get(path) {
  const url = API_URL + path;
  const accept = 'application/json';
  const auth = ACCESS_TOKEN;

  console.log(url);
  
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      headers: {
        accept: accept,
        authorization: 'Bearer ' + auth,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      console.error(
        'Axios: Request made but the server responded with an error.'
      );
    } else if (error.request) {
      console.error(
        'Axios: Request made but no response is received from the server.'
      );
    } else {
      console.error('Axios: Error occured while setting up the request.');
      console.error(error);
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: accept,
          authorization: 'Bearer ' + auth,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Network response was not OK');
      }
    } catch (error) {
      console.error(
        'Fetch: There has been a problem with your fetch operation:'
      );
      console.error(error);
    }
  }
}

async function getGenres() {
  return await get('genre/movie/list');
}

authenticate();

export default {
  API_URL,
  get,
  getGenres,
};
