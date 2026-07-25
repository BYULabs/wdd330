export default class Alert {
  constructor(jsonPath = '/json/alerts.json') {
    this.jsonPath = jsonPath;
  }

  async init() {
    try {
      const response = await fetch(this.jsonPath);
      if (!response.ok) return;

      const alerts = await response.json();

      // If there are alerts in the JSON, render them on the page
      if (alerts && alerts.length > 0) {
        this.renderAlerts(alerts);
      }
    } catch (error) {
      console.error('Erro ao carregar os alertas:', error);
    }
  }

  renderAlerts(alerts) {
    // 1. Create the <section class="alert-list"> tag
    const alertSection = document.createElement('section');
    alertSection.classList.add('alert-list');

    // 2. Creates a <p> for each alert and applies the colors
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