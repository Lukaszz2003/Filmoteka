import app from './global/app';

const searchForm = document.getElementById(app.SEARCH_FORM_ELEMENT_ID);

async function onSubmit(event) {
  const keyword = event.target.elements.keyword.value;

  event.preventDefault();
  await app.getMoviesByKeyWord(keyword);
}

searchForm.addEventListener('submit', onSubmit);
