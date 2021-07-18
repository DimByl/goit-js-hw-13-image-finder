import './sass/main.scss';
import ApiService from './js/apiService.js';
import createImage from './templates/image-card.hbs';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/mobile/dist/PNotifyMobile.css";
import "@pnotify/countdown/dist/PNotifyCountdown.css";
import { alert } from '@pnotify/core';
import notificationOptions from './js/notificationSettings.js';
import * as basicLightbox from 'basiclightbox';

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('[data-action="load-more"]'),
    body: document.querySelector('body'),
}
const apiService = new ApiService();

hideLoadMoreBtn();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onMakeBigImage)


async function onSearch(e) {
    e.preventDefault();
    
    apiService.query = e.currentTarget.elements.query.value.trim();
    
    apiService.resetPage();
    clearGallery();
    await fetchImages();
    

    const counter = refs.gallery.children.length;

    if (counter === 0) {
        hideLoadMoreBtn()
        return alert(notificationOptions.notFound);
        
    }

    if (counter >= 12) {
        showLoadMoreBtn();
    }

    if (apiService.query === '') {
        hideLoadMoreBtn();
        alert(notificationOptions.notMach);
    }
    if (apiService.query) {
        notificationOptions.found.title =  `Found ${counter} ${apiService.query} images`,
        alert(notificationOptions.found);
    }
}

async function fetchImages() {
    if (apiService.query === '') {
        return;
    }

    const response = await apiService.fetchImages();
    const images = await createGallery(response);
    return images;
}

function createGallery(images) {
    refs.gallery.insertAdjacentHTML('beforeend', createImage(images));
    scrollIntoEnd();
}

function scrollIntoEnd() {
    refs.body.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
    });
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}

async function onLoadMore() {
    await fetchImages();
    const counter = refs.gallery.children.length;
    if (apiService.query) {
        notificationOptions.foundToMany.title =  `Found ${counter} ${apiService.query} images`,
        alert(notificationOptions.foundToMany);
    }
}

function hideLoadMoreBtn() {
    refs.loadMoreBtn.style.display = 'none';
}

function showLoadMoreBtn() {
    refs.loadMoreBtn.style.display = 'block';
}
function onMakeBigImage(e) {
    const largeImagePath = e.target.dataset.large_img;
    const instance = basicLightbox.create(`<img src="${largeImagePath}">`)

    instance.show();
}