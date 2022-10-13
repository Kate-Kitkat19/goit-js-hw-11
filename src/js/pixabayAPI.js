import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30577317-d75a3c052a473ef5b40d5fa17';
const params = `?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

export async function getPictures(query) {
  console.log(query);
  try {
    const response = await axios.get(`${BASE_URL}${params}&q=${query}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
