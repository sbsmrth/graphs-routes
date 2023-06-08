export const loadPage = async (url, container = null) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const html = await response.text();
      const element = document.querySelector(container);
      if (element) {
        element.innerHTML = html;
      }
      return element || html; // para permitir encadenamiento o para retornar el HTML
    } else {
      throw new Error(
        `${response.status} - ${response.statusText}, al intentar acceder al recurso '${response.url}'`
      );
    }
  } catch (e) {
    console.log(e);
  }
};

export const okForm = (formSelector, callBack) => {
  let ok = true;
  const form = document.querySelector(formSelector);
  // si los datos del formulario no son válidos, forzar un submit para que se muestren los errores
  if (!form.checkValidity()) {
    let tmpSubmit = document.createElement("button");
    form.appendChild(tmpSubmit);
    tmpSubmit.click();
    form.removeChild(tmpSubmit);
    ok = false;
  }
  if (typeof callBack === "function") {
    ok = ok && callBack();
  }
  return ok;
};

export const toOptionList = ({
  items = [], // el array de objetos para crear la lista
  value = '', // el nombre del atributo de cada objeto que se usará como value
  text = '', // el nombre del atributo de cada objeto que se usará como text
  selected = '', // el valor que debe marcarse como seleccionado
  firstOption = '', // opcionalmente una opción adicional para iniciar la lista
} = {}) => {
  let options = '';
  if (firstOption) {
    options += `<option value="">${firstOption}</option>`;
  }
  items.forEach((item) => {
    if (item[value] == selected) {
      // comprobación débil adrede
      options += `<option value="${item[value]}" selected>${item[text]}</option>`;
    } else {
      options += `<option value="${item[value]}">${item[text]}</option>`;
    }
  });
  return options;
};
