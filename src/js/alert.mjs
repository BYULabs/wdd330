export default class Alert {
  constructor(jsonPath = '/json/alerts.json') {
    this.jsonPath = jsonPath;
  }

  async init() {
    try {
      const response = await fetch(this.jsonPath);
      if (!response.ok) return;

      const alerts = await response.json();

      // Se houver alertas no JSON, renderiza na página
      if (alerts && alerts.length > 0) {
        this.renderAlerts(alerts);
      }
    } catch (error) {
      console.error('Erro ao carregar os alertas:', error);
    }
  }

  renderAlerts(alerts) {
    // 1. Cria a tag <section class="alert-list">
    const alertSection = document.createElement('section');
    alertSection.classList.add('alert-list');

    // 2. Cria um <p> para cada alerta e aplica as cores
    alerts.forEach((alert) => {
      const alertParagraph = document.createElement('p');
      alertParagraph.textContent = alert.message;
      alertParagraph.style.backgroundColor = alert.background;
      alertParagraph.style.color = alert.color;
      
      alertSection.appendChild(alertParagraph);
    });

    // 3. Prepende a section no elemento <main> do index page
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.prepend(alertSection);
    }
  }
}