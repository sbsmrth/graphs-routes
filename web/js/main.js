import { loadPage } from './helpers.js'

(async () => {
    await loadPage('./html/dashboard.html', '#app-main')
})();

const reg_airports = document.getElementById('reg-airports')

reg_airports.addEventListener('click', async () => {
    await loadPage('./html/airports-form.html', '#app-main')
})