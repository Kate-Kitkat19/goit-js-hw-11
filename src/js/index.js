import { getPictures, page, query } from './pixabayAPI';
import {
  notifyNoPictures,
  notifyEndOfResults,
  notifyQuantity,
  notifyNoQuery,
  notifyError,
} from './notifications';
import { formRef, inputRef, container, loadMoreBtnRef } from './refs';
import { renderMarkup } from './renderMarkup';

loadMoreBtnRef.disabled = true;
formRef.addEventListener('submit', onSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMore);

async function onSubmit(evt) {
  evt.preventDefault();
  loadMoreBtnRef.disabled = true;
  const currentQuery = evt.target.elements.searchQuery.value.trim();
  if (!currentQuery) {
    notifyNoQuery();
    return;
  }
  try {
    const searchData = await getPictures(currentQuery);
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
    console.log(error);
    notifyError();
  }
}

async function onLoadMore() {
  console.log(page, 'page before fetch in LoadMoreBtn');
  const response = await getPictures(query);
  const { total, hits } = response;
  const markup = hits.map(item => renderMarkup(item)).join('');
  container.insertAdjacentHTML('beforeend', markup);
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
