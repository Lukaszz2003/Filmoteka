import app from './global/app';

const MOVIE_WINDOW_ID = 'movie-window';
const CLOSE_BUTTON_ID = 'close-btn';

function onGalleryUlClick(event) {
  const element = event.target;

  if (element.nodeName === 'LI') {
    const movieId = app.getMovieIdFromMovieCardElement(element);

    app.getMovieByID(movieId).then(movie => {
      createMovieWindow(movie);
    });
  }
}

function onKeyPressed(event) {
  if (event.key === 'Escape' && addToWatchedBtn) {
    destroyMovieWindow();
  }
}

function createMovieWindow(movieObject) {
  const backdrop = document.getElementById(
    app.MOVIE_WINDOW_BACKDROP_DIV_ELEMENT_ID
  );
  const movieWindow = document.getElementById(MOVIE_WINDOW_ID);

  const moviePoster =
    'https://image.tmdb.org/t/p/w500' + movieObject.poster_path;
  const movieTitle = movieObject.original_title;
  const movieVote = movieObject.vote_average;
  const movieNumOfVotes = movieObject.vote_count;
  const moviePopularity = movieObject.popularity;
  const movieOrigTitle = movieObject.original_title;
  const movieGenre = movieObject.genres[0].name;
  const movieOverview = movieObject.overview;

  const markup = `
    <button id="${CLOSE_BUTTON_ID}" class="movie-window__close-btn button" type="button">&#9587;</button>
    <div class="movie-window__poster">
      <img src="${moviePoster}" alt="'${movieTitle}' movie poster." />
    </div>
    <div class="movie-window__details">
      <h1 class="movie-window__title">${movieTitle}</h1>
      <div class="movie-window__stats">
        <ul class="stats-subtitles">
          <li class="stats-list">Vote / Votes</li>
          <li class="stats-list">Popularity</li>
          <li class="stats-list">Original Title</li>
          <li class="stats-list">Genre</li>
        </ul>
        <ul>
          <li class="stats-result">
            <span class="stats-color">${movieVote}</span> /
            <span class="stats-color2">${movieNumOfVotes}</span>
          </li>
          <li class="stats-result"><span>${moviePopularity}</span></li>
          <li class="stats-result">${movieOrigTitle}</li>
          <li class="stats-result">${movieGenre}</li>
        </ul>
      </div>
      <div class="movie-window__description">
        <h2 class="description-header">ABOUT</h2>
        <p>${movieOverview}</p>
      </div>
      <div class="movie-window__modal-buttons">
        <button 
          id="add-to-watched-btn" 
          class="button" type="button" 
          data-movie="${movieObject.id}"
          data-name="${movieTitle}">ADD TO WATCHED</button>
        <button 
          id="add-to-queue-btn" 
          class="button" 
          type="button" 
          data-movie="${movieObject.id}"
          data-name="${movieTitle}">ADD TO QUEUE</button>
      </div>
    </div>`;

  movieWindow.innerHTML = markup;

  const closeBtn = document.getElementById(CLOSE_BUTTON_ID);

  addToWatchedBtn = document.getElementById('add-to-watched-btn');
  addToQueueBtn = document.getElementById('add-to-queue-btn');

  window.addEventListener('keydown', onKeyPressed);

  backdrop.addEventListener('click', destroyMovieWindow);
  closeBtn.addEventListener('click', destroyMovieWindow);

  addToWatchedBtn.addEventListener('click', onAddMovieToLibrary);
  addToQueueBtn.addEventListener('click', onAddMovieToLibrary);

  backdrop.classList.remove('hidden');
}

function destroyMovieWindow(event = null) {
  if (event) {
    if (
      event.target.id != CLOSE_BUTTON_ID &&
      event.target.id != app.MOVIE_WINDOW_BACKDROP_DIV_ELEMENT_ID
    ) {
      return;
    }
  }

  const backdrop = document.getElementById(
    app.MOVIE_WINDOW_BACKDROP_DIV_ELEMENT_ID
  );
  const movieWindow = document.getElementById(MOVIE_WINDOW_ID);

  console.log('Zamykanie okna Movie');
  console.dir(event);

  const closeBtn = document.getElementById(CLOSE_BUTTON_ID);

  addToWatchedBtn.removeEventListener('click', onAddMovieToLibrary);
  addToQueueBtn.removeEventListener('click', onAddMovieToLibrary);

  addToWatchedBtn = null;
  addToQueueBtn = null;

  window.removeEventListener('keydown', destroyMovieWindow);

  backdrop.removeEventListener('click', destroyMovieWindow);
  closeBtn.removeEventListener('click', destroyMovieWindow);

  movieWindow.innerHTML = '';
  backdrop.classList.add('hidden');
}

function onAddMovieToLibrary(event) {
  if (event.target.nodeName === 'BUTTON') {
    const btnId = event.target.id;
    const movieId = event.target.dataset.movie;
    const movieName = event.target.dataset.name;

    if (btnId === 'add-to-watched-btn') {
      if (app.addMovieToLibrary(movieId, app.LOCAL_STORAGE_WATCH_KEY)) {
        app.Notify.success(
          `Movie '${movieName}' was added to your WATCHED library!`
        );
      } else {
        app.Notify.failure(
          `Movie '${movieName}' exist in your WATCHED library!`
        );
      }
    } else if (btnId === 'add-to-queue-btn') {
      if (app.addMovieToLibrary(movieId, app.LOCAL_STORAGE_QUEUE_KEY)) {
        app.Notify.success(
          `Movie '${movieName}' was added to your QUEUED library!`
        );
      } else {
        app.Notify.failure(
          `Movie '${movieName}' exist in your QUEUED library!`
        );
      }
    }
  }
}

const galleryDiv = document.getElementById(app.MOVIE_CARDS_PARENT_ELEMENT_ID);

let addToWatchedBtn = null;
let addToQueueBtn = null;

galleryDiv.addEventListener('click', onGalleryUlClick);
