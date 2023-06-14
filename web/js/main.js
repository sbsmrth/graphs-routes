import { loadPage, okForm, toOptionList } from "./helpers.js";

window.addEventListener("load", () => {
  window.resizeTo(screen.availWidth, screen.availHeight);
  window.moveTo(0, 0);
});

(async () => {
  const airports = await eel.get_airports()();
  const routes = await eel.get_routes()();
  const iataToName = {};
  airports.forEach((a) => {
    iataToName[a.iata] = a.name;
  });
  localStorage.setItem("iataToName", JSON.stringify(iataToName));
  setRoutes(routes);
  setAirports(airports);
  manageDashboard();
})();

function setRoutes(routes) {
  localStorage.setItem("routes", JSON.stringify(routes));
}

function setAirports(airports) {
  localStorage.setItem("airports", JSON.stringify(airports));
}

function createCards(cardsInfo) {
  let cardsTemplate = "";
  const iataToName = JSON.parse(localStorage.getItem("iataToName"));

  cardsInfo.forEach((c) => {
    const origin = c["origin"];
    const destination = c["destination"];

    cardsTemplate += `
    <div class="job_card">
      <div class="job_details">
          <a class="img pencil_edit" href="#demo-modal">
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
          <h4>${c["time"]} minutes</h4>
          <span>${c["distance"]} km</span>
      </div>
    </div>
    `;
  });

  return cardsTemplate;
}

async function manageDashboard() {
  await loadPage("./html/dashboard.html", "#app-main");

  const data = JSON.parse(localStorage.getItem("airports"));
  const routes = JSON.parse(localStorage.getItem("routes"));
  let filterData = [];
  data.forEach((a) => (a.toString = `${a["name"]} (${a["iata"]})`));

  const originOptions = toOptionList({
    items: data,
    value: "toString",
    text: "toString",
  });

  const originSelect = document.getElementById("search_origin");
  originSelect.innerHTML = originOptions;

  originSelect.addEventListener("change", () => {
    const currentIata = data[originSelect.selectedIndex]["iata"];
    filterData = data.filter((a) => a["iata"] != currentIata);
    const destinationOptions = toOptionList({
      items: filterData,
      value: "toString",
      text: "toString",
    });

    const destinationSelect = document.getElementById("search_destination");
    destinationSelect.innerHTML = destinationOptions;
  });

  originSelect.dispatchEvent(new Event("change"));

  const filterBtn = document.getElementById("filter-route-btn");

  filterBtn.addEventListener("click", async () => {
    const originIata = data[originSelect.selectedIndex]["iata"];
    const destinationSelect = document.getElementById("search_destination");
    const destinationIata = filterData[destinationSelect.selectedIndex]["iata"];
    const filter = document.getElementById("search_kind").value.toLowerCase();

    const newRoutes = routes.filter(
      (route) =>
        route["origin"] == originIata && route["destination"] == destinationIata
    );
    const cardsTemplate = createCards(newRoutes);
    if (cardsTemplate) {
      document.getElementById("routes-cards").innerHTML = cardsTemplate;
    }

    const err = await eel.shortes_path_gph(routes, originIata, destinationIata, filter)();
    if (err) {
      alert('There is no a conection between the airports')
    }
  });

  const cardsTemplate = createCards(routes);
  const routesCards = document.getElementById("routes-cards");
  routesCards.innerHTML = cardsTemplate;

  document.querySelectorAll(".pencil_edit").forEach((c, index) => {
    c.addEventListener("click", () => manageModal(index));
  });
}

function manageModal(index) {
  const iataToName = JSON.parse(localStorage.getItem("iataToName"));
  const routes = JSON.parse(localStorage.getItem("routes"));
  const route = routes[index];
  const str_origin = iataToName[route["origin"]];
  const str_destination = iataToName[route["destination"]];

  const origin_input = document.getElementById("m-airportorg");
  origin_input.value = str_origin;
  origin_input.disabled = true;
  const destination_input = document.getElementById("m-airportdest");
  destination_input.value = str_destination;
  destination_input.disabled = true;

  const form = document.getElementById("m-edit-routes");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!okForm("#m-edit-routes")) {
      return;
    }

    const time = document.getElementById("m-airporttime").value;
    const distance = document.getElementById("m-airportdist").value;

    const row = [route["origin"], route["destination"], time, distance];
    eel.edit_route(row)(setRoutes);
    manageDashboard();
  });
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
    eel.add_airport("airports.csv", rows)(setAirports);

    form.reset();
  });
}

async function manageRoutes() {
  await loadPage("./html/routes-form.html", "#app-main");

  const form = document.getElementById("reg-f-routes");
  const data = JSON.parse(localStorage.getItem("airports"));
  const routes = JSON.parse(localStorage.getItem('routes'))
  let filterData = [];
  data.forEach((a) => (a.toString = `${a["name"]} (${a["iata"]})`));

  const originSelect = document.getElementById("routes-f-origin");
  const distanceSelect = document.getElementById('routes-f-distance')
  const originOptions = toOptionList({
    items: data,
    value: "toString",
    text: "toString",
  });

  originSelect.innerHTML = originOptions;

  originSelect.addEventListener("change", () => {
    const currentIata = data[originSelect.selectedIndex]["iata"];
    filterData = data.filter((a) => a["iata"] != currentIata);
    const destinationOptions = toOptionList({
      items: filterData,
      value: "toString",
      text: "toString",
    });

    const destinationSelect = document.getElementById("routes-f-destination");
    destinationSelect.innerHTML = destinationOptions;    
  });

  originSelect.dispatchEvent(new Event("change"));

  const destSelect = document.getElementById('routes-f-destination')
  destSelect.addEventListener('change', () => {
    const orgSelectedIata = data[originSelect.selectedIndex]["iata"];
    const desSelectedIata = filterData[destSelect.selectedIndex]["iata"]

    routes.forEach(route => {
      
      if (route["origin"] == desSelectedIata && route["destination"] == orgSelectedIata) {
        console.log("inside")
        distanceSelect.value = route["distance"]
        distanceSelect.disabled = true
      } 
    })
  })

  destSelect.dispatchEvent(new Event("change"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!okForm("#reg-f-routes")) {
      return;
    }

    const originIata = data[originSelect.selectedIndex]["iata"];
    const destinationSelect = document.getElementById("routes-f-destination");
    const destinationIata = filterData[destinationSelect.selectedIndex]["iata"];
    const time = document.getElementById("routes-f-time").value;
    const distance = document.getElementById("routes-f-distance").value;

    const rows = [[originIata, destinationIata, time, distance]];
    eel.add_route("routes.csv", rows)(setRoutes);

    form.reset();
    originSelect.dispatchEvent(new Event("change"));
  });
}

async function showAirports() {
  await loadPage("./html/airports.html", "#app-main");
  const airports = JSON.parse(localStorage.getItem("airports"));

  const fragment = new DocumentFragment();
  airports.forEach((a) => {
    const div = document.createElement("div");
    div.className = "airport_card";
    const iataSpan = document.createElement("span");
    iataSpan.textContent = a["iata"];
    const nameSpan = document.createElement("span");
    nameSpan.className = "span_name";
    nameSpan.textContent = a["name"];

    div.appendChild(iataSpan);
    div.appendChild(nameSpan);

    fragment.appendChild(div);
  });

  const wrapper = document.querySelector(".all_airport");
  wrapper.appendChild(fragment);
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

const allAiports = document.getElementById("airports-btn");

allAiports.addEventListener("click", showAirports);

const graphTime = document.getElementById("graph-time");
const graphDistance = document.getElementById("graph-distance");
const logoutBtn = document.getElementById("logout-btn");

graphTime.addEventListener("click", () => {
  eel.full_graph("time");
});

graphDistance.addEventListener("click", () => {
  eel.full_graph("distance");
});

logoutBtn.addEventListener("click", () => {
  window.close();
});
