export async function loadPage(url, container = null) {
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
}