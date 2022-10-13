import { getPictures } from './pixabayAPI';
import { notifyNoPictures, notifyEndOfResults } from './notifications';
import { submitBtnRef, inputRef, container } from './refs';
import { renderMarkup } from './renderMarkup';

submitBtnRef.addEventListener('click', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();
  const search = inputRef.value;
  try {
    const searchData = await getPictures(search);
    const { total, hits } = searchData;
    console.log('onSubmit   hits', hits);
    console.log('onSubmit   total', total);
    const markup = hits.map(item => renderMarkup(item)).join('');
    console.log('markup', markup);
    container.innerHTML = markup;
  } catch (error) {
    console.log('Что-то пошло не так!', error);
  }
}
