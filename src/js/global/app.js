import api from './api.js';
import { Loading, Notify } from 'notiflix';

const MOVIE_WINDOW_BACKDROP_DIV_ELEMENT_ID = 'movie-window-backdrop';
const ABOUT_WINDOW_BACKDROP_DIV_ELEMENT_ID = 'about-window-backdrop';
const SEARCH_FORM_ELEMENT_ID = 'search-form';
const ABOUT_LINK_A_ELEMENT_ID = "about-us";
const ABOUT_WINDOW_CLOSE_BTN_ELEMENT_ID = "about-close-button";

const WATCHED_BUTTON_ELEMENT_ID = 'watched-button';
const QUEUE_BUTTON_ELEMENT_ID = 'queue-button';

const MOVIE_CARDS_PARENT_ELEMENT_ID = 'gallery';
const MOVIE_CARD_ELEMENTS_CSS_CLASS = 'movie-card';

const LOCAL_STORAGE_QUEUE_KEY = 'queue_movies';
const LOCAL_STORAGE_WATCH_KEY = 'watch_movies';

const NUM_OF_MOVIES_PER_PAGE = 20;
const PRIMARY_COLOR_HEX = '#FF6B01';
const FONT_FAMILY = 'Roboto';

function createMovieCardId(movieId) {
  return 'movie-' + movieId;
}

function getMovieIdFromMovieCardElement(moveCardElement) {
  const movieId = moveCardElement.id.split('-');

  return movieId[1];
}

async function renderMovieCardHTML(movieId) {
  try {
    const movieObject = await api.get('movie/' + movieId);

    if (movieObject.poster_path === null) {
      return '';
    }

    const moviePoster =
      'https://image.tmdb.org/t/p/w500' + movieObject.poster_path;
    const movieYear = movieObject.release_date.split('-')[0];
    const movieTitle = movieObject.original_title;

    const genresArray = [];

    let genres = '';

    for (const genre of movieObject.genres) {
      genresArray.push(genre.name);
    }

    if (genresArray.length > 2) {
      genres = `${genresArray[0]}, ${genresArray[1]}, Other`;
    } else {
      genres = genresArray.join(', ');
    }

    return `
      <li class = "movie-card" id="${createMovieCardId(movieId)}">
          <div class="movie-thumb">
            <img class="movie-image" src="${moviePoster}" alt="Poster image" loading="lazy" />
          </div>
          <div class="movie-info">
            <p class="movie-name">${movieTitle}</p>
            <p class="movie-genres">${genres} | ${movieYear}</p>
          </div>
        </li>`;
  } catch (error) {
    console.log('API: Movie ' + movieId + " don't exist in api database!");

    return '';
  }
};

async function showMovieCards(moviesArray) {
  let html = '';

  for (const movie of moviesArray.results) {
    html += await renderMovieCardHTML(movie.id);
  }

  return html;
};

async function getMoviesByKeyWord(keyword, page = 1) {
  Loading.circle('Loading movies by keyword');

  const galleryULElement = document.getElementById(
    MOVIE_CARDS_PARENT_ELEMENT_ID
  );

  galleryULElement.innerHTML = '';

  //const keywords = await api.get('search/keyword?query=' + keyword);

  //console.log(keywords);

  //if (keywords.results.length === 0) {
  //  onSearchFailed();
  //} else {
  //  const kwStr = keywords.results.map(kw => kw.name).join(",");
  //  console.log(kwStr);
  //  const params = {
  //    with_keywords: kwStr,
  //    sort_by: 'popularity.desc',
  //    page: page,
  //  }
  //  const searchParams = new URLSearchParams(params).toString();
    const movies = await api.get(`search/movie?query=${keyword}&page=${page}`);

    if (movies.total_results > 0) {
      const movieCards = await showMovieCards(movies);

      currentPage = movies.page;
      currentKeyword = keyword;
      totalPages = movies.total_pages;
      galleryULElement.innerHTML = movieCards;
  
      onSearchSuccess();
      console.log(currentKeyword);
    } else {
      currentPage = 1;
      currentKeyword = '';
      totalPages = 0;
  
      onSearchFailed();
    }
  //}

  setPaginationButtons();
  Loading.remove();
};

async function getMoviesTodayTrends(page = 1) {
  Loading.circle("Loading popular movies");

  const galleryULElement = document.getElementById(
    MOVIE_CARDS_PARENT_ELEMENT_ID
  );

  const movies = await api.get(`movie/popular?page=${page}`);
  const movieCards = await showMovieCards(movies);

  galleryULElement.innerHTML = movieCards;

  currentPage = movies.page;
  totalPages = movies.total_pages;

  setPaginationButtons();
  Loading.remove();
};

async function getMovieByID(movieId) {
  Loading.circle('Loading movie data');

  const movie = await api.get('movie/' + movieId);

  Loading.remove();

  return movie;
};

function onSearchFailed() {
  const searchMsg = document.querySelector('.search-msg');

  searchMsg.classList.remove('hidden');
};

function onSearchSuccess() {
  const searchMsg = document.querySelector('.search-msg');

  searchMsg.classList.add('hidden');
};

function setPaginationButtons() {
  if (totalPages) {
    const firstBtn = document.getElementById('first-btn');
    const lastBtn = document.getElementById('last-btn');

    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
  
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');
    const btn4 = document.getElementById('btn4');
    const btn5 = document.getElementById('btn5');
  
    const buttonsArray = [btn1, btn2, btn3, btn4, btn5];
  
    let activeBtn = null;

    firstBtn.classList.remove('hidden');
    lastBtn.classList.remove('hidden');
    
    leftBtn.classList.remove('hidden');
    rightBtn.classList.remove('hidden');

    buttonsArray.forEach(btn => {
      btn.classList.remove('hidden');
    });
  
    if (totalPages > 40) {
      totalPages = 40;
    }
  
    firstBtn.textContent = '1';
    firstBtn.value = '1';
  
    lastBtn.textContent = totalPages;
    lastBtn.value = totalPages;
  
    if (currentPage < 3) {
      btn1.textContent = '1';
      btn1.value = '1';
  
      btn2.textContent = '2';
      btn2.value = '2';
  
      btn3.textContent = '3';
      btn3.value = '3';
  
      btn4.textContent = '4';
      btn4.value = '4';
  
      btn5.textContent = '5';
      btn5.value = '5';
    } else if (currentPage > totalPages - 3) {
      btn1.textContent = totalPages - 4;
      btn1.value = totalPages - 4;
  
      btn2.textContent = totalPages - 3;
      btn2.value = totalPages - 3;
  
      btn3.textContent = totalPages - 2;
      btn3.value = totalPages - 2;
  
      btn4.textContent = totalPages - 1;
      btn4.value = totalPages - 1;
  
      btn5.textContent = totalPages;
      btn5.value = totalPages;
    } else {
      btn1.textContent = currentPage - 2;
      btn1.value = currentPage - 2;
  
      btn2.textContent = currentPage - 1;
      btn2.value = currentPage - 1;
  
      btn3.textContent = currentPage;
      btn3.value = currentPage;
  
      btn4.textContent = currentPage + 1;
      btn4.value = currentPage + 1;
  
      btn5.textContent = currentPage + 2;
      btn5.value = currentPage + 2;
    }
  
    buttonsArray.forEach(btn => {
      btn.classList.remove('active');
    });
  
    activeBtn = buttonsArray.find(btn => btn.value == currentPage);
    activeBtn.classList.add('active');
  }
};

function addMovieToLibrary(movieId, key) {
  let movies = JSON.parse(localStorage.getItem(key));

  if (movies) {
    for (const movie of movies) {
      if (movie === movieId) {
        return false;
      }
    }
  } else {
    movies = [];
  }
  
  movies.push(movieId);

  localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(movies));

  return true;
}

function getFromStorage(key) {
  try {
    const serialisedState = localStorage.getItem(key);
    return serialisedState === null ? undefined : JSON.parse(serialisedState);
  } catch (error) {
    console.log(error.message);
  }
}

async function showMoviesFromLocalStorage(key, page = 1) {
  const gallery = document.getElementById(MOVIE_CARDS_PARENT_ELEMENT_ID);
  const offset = (page - 1) * NUM_OF_MOVIES_PER_PAGE;

  let movies = getFromStorage(key) || [];
  let html = '';

  Loading.circle('Loading movies from library');

  totalPages = Math.ceil(movies.length / NUM_OF_MOVIES_PER_PAGE);
  currentPage = page;

  movies = movies.slice(offset, offset + NUM_OF_MOVIES_PER_PAGE);

  for (const movie of movies) {
    html += await renderMovieCardHTML(movie);
  }

  gallery.innerHTML = html;

  setPaginationButtons();
  Loading.remove();
}

let currentPage = 1;
let totalPages = 0;
let currentWebPage = "";
let currentLibraryPage = "";
let currentKeyword = "";

function setPage(page) {
  currentPage = page;
}

function setWebPage(webPage) {
  currentWebPage = webPage;
}

function setLibraryPage(libraryPage) {
  currentLibraryPage = libraryPage;
}

function setKeyword(keyword) {
  currentKeyword = keyword;
}

function getPage() {
  return currentPage;
}

function getTotalPages() {
  return totalPages;
}

function getWebPage() {
  return currentWebPage;
}

function getLibraryPage() {
  return currentLibraryPage;
}

function getKeyword() {
  return currentKeyword;
}

Loading.init({
  svgColor: PRIMARY_COLOR_HEX,
  fontFamily: FONT_FAMILY,
});

Notify.init({
  position: 'right-bottom',
  fontFamily: FONT_FAMILY,
});

export default {
  api,
  Loading,
  Notify,
  createMovieCardId,
  getMovieIdFromMovieCardElement,
  getMovieByID,
  getMoviesByKeyWord,
  getMoviesTodayTrends,
  MOVIE_WINDOW_BACKDROP_DIV_ELEMENT_ID,
  ABOUT_WINDOW_BACKDROP_DIV_ELEMENT_ID,
  ABOUT_WINDOW_CLOSE_BTN_ELEMENT_ID,
  ABOUT_LINK_A_ELEMENT_ID,
  SEARCH_FORM_ELEMENT_ID,
  WATCHED_BUTTON_ELEMENT_ID,
  QUEUE_BUTTON_ELEMENT_ID,
  MOVIE_CARDS_PARENT_ELEMENT_ID,
  MOVIE_CARD_ELEMENTS_CSS_CLASS,
  LOCAL_STORAGE_QUEUE_KEY,
  LOCAL_STORAGE_WATCH_KEY,
  NUM_OF_MOVIES_PER_PAGE,
  currentPage,
  totalPages,
  currentWebPage,
  currentLibraryPage,
  currentKeyword,
  setPage,
  setWebPage,
  setLibraryPage,
  setKeyword,
  getPage,
  getTotalPages,
  getWebPage,
  getLibraryPage,
  getKeyword,
  renderMovieCardHTML,
  showMovieCards,
  onSearchFailed,
  onSearchSuccess,
  setPaginationButtons,
  addMovieToLibrary,
  showMoviesFromLocalStorage,
};
