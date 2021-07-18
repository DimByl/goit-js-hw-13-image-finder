const API_KEY = '22552656-a52d92f58f7bf96e8efb5df9f';
const BASE_URL = 'https://pixabay.com/api';


export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;

      const response = await fetch(url);
      const images = await response.json();
      const hits = await images.hits;
        this.incrementPage();
        return hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}