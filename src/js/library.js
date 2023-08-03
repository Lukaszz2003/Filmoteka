import app from './global/app';

const watchedBtn = document.getElementById(app.WATCHED_BUTTON_ELEMENT_ID);
const queueBtn = document.getElementById(app.QUEUE_BUTTON_ELEMENT_ID);

watchedBtn.addEventListener('click', () => {
  app.showMoviesFromLocalStorage(app.LOCAL_STORAGE_WATCH_KEY);
});

queueBtn.addEventListener('click', () => {
  app.showMoviesFromLocalStorage(app.LOCAL_STORAGE_QUEUE_KEY);
});

app.showMoviesFromLocalStorage(app.LOCAL_STORAGE_WATCH_KEY);
