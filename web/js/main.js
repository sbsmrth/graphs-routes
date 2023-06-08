import { loadPage, okForm, toOptionList } from './helpers.js';


(async () => {
  await loadPage('./html/dashboard.html', '#app-main');
})();


async function manageAirports() {
  await loadPage('./html/airports-form.html', '#app-main');

  const form = document.getElementById('reg-f-airports');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!okForm('#reg-f-airports')) {
      return;
    }

    const name = document.getElementById('airport-f-name').value;
    const location = document.getElementById('airport-f-location').value;
    const iata = document.getElementById('airport-f-iata').value;

    const rows = [[name, iata, location]];
    eel.add_airport('airports.csv', rows);

    form.reset();
  });
}

async function manageRoutes() {
  await loadPage('./html/routes-form.html', '#app-main');


  const form = document.getElementById('reg-f-routes');
  const data = await eel.get_airports()()
  data.forEach( a =>
  (a.toString = `${a['name']} (${a['iata']})`)
)  
  
  const originSelect = document.getElementById('routes-f-origin');
  const originOptions = toOptionList({
    items: data,
    value: 'toString',
    text: 'toString',
  })

  originSelect.innerHTML = originOptions

  originSelect.addEventListener('change', () => {
    const currentText = data[originSelect.selectedIndex]['iata']
    const newData = data.filter(a => a['iata'] != currentText)
    const destinationOptions = toOptionList({
      items: newData,
      value: 'toString',
      text: 'toString',
    })

    const destinationSelect = document.getElementById('routes-f-destination')
    destinationSelect.innerHTML = destinationOptions
  })

  originSelect.dispatchEvent(new Event('change'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!okForm('#reg-f-routes')) {
      return;
    }

    const originIata = data[originSelect.selectedIndex]['iata']
    const destinationSelect = document.getElementById('routes-f-destination')
    const destinationIata = data[destinationSelect.selectedIndex]['iata']
    const time = document.getElementById('routes-f-time').value;
    const distance = document.getElementById('routes-f-distance').value;

    const rows = [[originIata, destinationIata, time, distance]];
    eel.add_route('routes.csv', rows);

    form.reset();
    originSelect.dispatchEvent(new Event('change'));
  });
}

const dashboard_btn = document.getElementById('dashboard-btn');

dashboard_btn.addEventListener('click', async () => {
  await loadPage('./html/dashboard.html', '#app-main');
});

const reg_airports = document.getElementById('reg-airports');

reg_airports.addEventListener('click', async () => {
  manageAirports();
});

const reg_routes = document.getElementById('reg-routes');

reg_routes.addEventListener('click', async () => {
  manageRoutes();
});
