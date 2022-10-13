import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30577317-d75a3c052a473ef5b40d5fa17';
const query = 'flower';
const params = `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

export async function getPictures() {
  try {
    const data = await axios.get(`${BASE_URL}${params}`);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
