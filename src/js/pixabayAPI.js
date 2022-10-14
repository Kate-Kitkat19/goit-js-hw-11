import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30577317-d75a3c052a473ef5b40d5fa17';
export let page = 1;
const params = `?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

export async function getPictures(query) {
  try {
    const response = await axios.get(`${BASE_URL}${params}&q=${query}&page=${page}`);
    page += 1;
    return response.data;
  } catch (error) {
    console.log(error);
  }
}





