import { getPictures, page } from './pixabayAPI';
import {
  notifyNoPictures,
  notifyEndOfResults,
  notifyQuantity,
  notifyNoQuery,
} from './notifications';
import { formRef, inputRef, container, loadMoreBtnRef } from './refs';
import { renderMarkup } from './renderMarkup';

let query = null;
loadMoreBtnRef.disabled = true;
formRef.addEventListener('submit', onSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMore);

async function onSubmit(evt) {
  evt.preventDefault();
  console.log(page, 'page before fetch');
  const currentQuery = evt.target.elements.searchQuery.value.trim();
  if (query !== currentQuery) {
    console.log('onSubmit   query', query);
    console.log('onSubmit   currentQuery', currentQuery);
    page = 1;
    console.log('onSubmit   page', page)
    query = currentQuery;
  }
  if (!query) {
    notifyNoQuery();
    return;
  }
  try {
    const searchData = await getPictures(query);
    console.log('onSubmit   searchData', searchData);
    const { hits, totalHits } = searchData;
    if (hits.length === 0) {
      notifyNoPictures();
      return;
    }
    notifyQuantity(totalHits);
    const markup = hits.map(item => renderMarkup(item)).join('');
    container.innerHTML = markup;
    if (totalHits > 40) {
      loadMoreBtnRef.disabled = false;
      page += 1;
    }
  } catch (error) {
    console.log('Щось пішло не так!', error);
  }
}

async function onLoadMore() {
  console.log(page, 'page before fetch in LoadMoreBtn');
  const response = await getPictures(query);
  const { total, hits } = response;
  const markup = hits.map(item => renderMarkup(item)).join('');
  container.insertAdjacentHTML('beforeend', markup);
  page += 1;
  console.log(page, 'page after fetch in LoadMoreBtn');
  const totalPagesLeft = total / 40 - page;
  checkIfMorePics(totalPagesLeft);
}

function checkIfMorePics(pages) {
  if (pages <= 0) {
    loadMoreBtnRef.disabled = true;
    notifyEndOfResults();
  }
}
