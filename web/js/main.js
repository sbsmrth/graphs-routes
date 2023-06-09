import { loadPage, okForm, toOptionList } from "./helpers.js";

(async () => {
  const airports = await eel.get_airports()()
  const routes = await eel.get_routes()()
  const iataToName = {}
  airports.forEach(a => {
    iataToName[a.iata] = a.name
  })
  localStorage.setItem('iataToName', JSON.stringify(iataToName))
  localStorage.setItem('routes', JSON.stringify(routes))
  localStorage.setItem('airports', JSON.stringify(airports))
  manageDashboard();
})();

function createCards(cardsInfo) {
  let cardsTemplate = ''
  const iataToName = JSON.parse(localStorage.getItem('iataToName'))

  cardsInfo.forEach(c => {
    const origin = c['origin']
    const destination = c['destination']

    cardsTemplate += `
    <div class="job_card">
      <div class="job_details">
          <a class="img" href="#demo-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                  class="bi bi-pencil-square route-card" viewBox="0 0 16 16" style="margin-left: 20px;"">
                  <path
                      d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>
          </a>
          <div class="text">
              <h2>${origin} - ${destination}</h2>
              <span>${iataToName[origin]} - ${iataToName[destination]}</span>
          </div>
      </div>
      <div class="job_salary">
          <h4>${c['time']} minutes</h4>
          <span>${c['distance']} km</span>
      </div>
    </div>
    `;
  })

  return cardsTemplate
}



async function manageDashboard() {
  await loadPage("./html/dashboard.html", "#app-main");

  const routes = JSON.parse(localStorage.getItem('routes'))
  const cardsTemplate = createCards(routes);
  const routesMain = document.getElementById('routes-main')
  const wrapper = document.createElement('div')
  wrapper.innerHTML = cardsTemplate
  routesMain.appendChild(wrapper)

  document.querySelectorAll('route-card').forEach(c => {
    c.addEventListener('click', manageModal)
  })
}

function manageModal() {
  
  // SIN TERMINAR, POSIBLE ERROR
  const time = document.getElementById('time-input').value
  const distance = document.getElementById('distance-input').value
  
  
}

async function manageAirports() {
  await loadPage("./html/airports-form.html", "#app-main");

  const form = document.getElementById("reg-f-airports");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!okForm("#reg-f-airports")) {
      return;
    }

    const name = document.getElementById("airport-f-name").value;
    const location = document.getElementById("airport-f-location").value;
    const iata = document.getElementById("airport-f-iata").value;

    const rows = [[name, iata, location]];
    eel.add_airport("airports.csv", rows);

    form.reset();
  });
}

async function manageRoutes() {
  await loadPage("./html/routes-form.html", "#app-main");

  const form = document.getElementById("reg-f-routes");
  const data = await eel.get_airports()();
  data.forEach((a) => (a.toString = `${a["name"]} (${a["iata"]})`));

  const originSelect = document.getElementById("routes-f-origin");
  const originOptions = toOptionList({
    items: data,
    value: "toString",
    text: "toString",
  });

  originSelect.innerHTML = originOptions;

  originSelect.addEventListener("change", () => {
    const currentText = data[originSelect.selectedIndex]["iata"];
    const newData = data.filter((a) => a["iata"] != currentText);
    const destinationOptions = toOptionList({
      items: newData,
      value: "toString",
      text: "toString",
    });

    const destinationSelect = document.getElementById("routes-f-destination");
    destinationSelect.innerHTML = destinationOptions;
  });

  originSelect.dispatchEvent(new Event("change"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!okForm("#reg-f-routes")) {
      return;
    }

    const originIata = data[originSelect.selectedIndex]["iata"];
    const destinationSelect = document.getElementById("routes-f-destination");
    const destinationIata = data[destinationSelect.selectedIndex]["iata"];
    const time = document.getElementById("routes-f-time").value;
    const distance = document.getElementById("routes-f-distance").value;

    const rows = [[originIata, destinationIata, time, distance]];
    eel.add_route("routes.csv", rows);

    form.reset();
    originSelect.dispatchEvent(new Event("change"));
  });
}

const dashboard_btn = document.getElementById("dashboard-btn");

dashboard_btn.addEventListener("click", () => {
  manageDashboard();
});

const reg_airports = document.getElementById("reg-airports");

reg_airports.addEventListener("click", async () => {
  manageAirports();
});

const reg_routes = document.getElementById("reg-routes");

reg_routes.addEventListener("click", async () => {
  manageRoutes();
});
