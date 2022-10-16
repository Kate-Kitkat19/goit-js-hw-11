import { getPictures, page, query } from './pixabayAPI';
import {
  notifyNoPictures,
  notifyEndOfResults,
  notifyQuantity,
  notifyNoQuery,
  notifyError,
} from './notifications';
import { formRef, container, loadMoreBtnRef } from './refs';
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
    const { hits, totalHits, total } = await getPictures(currentQuery);
    if (hits.length === 0) {
      notifyNoPictures();
      return;
    }
    notifyQuantity(total);
    const markup = hits.map(renderMarkup).join('');
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
  const { total, hits } = await getPictures(query);
  const markup = hits.map(renderMarkup).join('');
  container.insertAdjacentHTML('beforeend', markup);
  const totalPagesLeft = total / 40 - page;
  checkIfMorePics(totalPagesLeft);
}

function checkIfMorePics(pages) {
  if (pages <= 0) {
    loadMoreBtnRef.disabled = true;
    notifyEndOfResults();
  }
}

