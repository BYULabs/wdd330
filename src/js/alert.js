export default class Alert {
  constructor(jsonPath = '/json/alerts.json') {
    this.jsonPath = jsonPath;
  }

  async init() {
    try {
      const response = await fetch(this.jsonPath);
      if (!response.ok) return;

      const alerts = await response.json();

      if (alerts && alerts.length > 0) {
        this.renderAlerts(alerts);
      }
    } catch (error) {
      console.error('Erro ao carregar os alertas:', error);
    }
  }

  renderAlerts(alerts) {
    const alertSection = document.createElement('section');
    alertSection.classList.add('alert-list');

    alerts.forEach((alert) => {
      // 1. Create container for the alert item
      const alertDiv = document.createElement('div');
      alertDiv.classList.add('alert-item');
      
      // Override background and color dynamically if specified in JSON
      if (alert.background) alertDiv.style.backgroundColor = alert.background;
      if (alert.color) alertDiv.style.color = alert.color;

      // 2. Create message text
      const alertParagraph = document.createElement('p');
      alertParagraph.textContent = alert.message;

      // 3. Create close button (X)
      const closeBtn = document.createElement('span');
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', () => alertDiv.remove());

      // 4. Assemble element
      alertDiv.appendChild(alertParagraph);
      alertDiv.appendChild(closeBtn);
      alertSection.appendChild(alertDiv);
    });

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.prepend(alertSection);
    }
  }
}