  // Referencias a elementos
  const notificationBtn = document.getElementById('notification-btn');
  const notificationPanel = document.getElementById('notification-panel');
  const notificationList = document.getElementById('notification-list');
  const notificationCount = document.getElementById('notification-count');
  const clearAllBtn = document.getElementById('clear-all');

  // Estado de visibilidad del panel
  let isPanelVisible = false;

  // Función para alternar la visibilidad del panel
  function toggleNotificationPanel() {
      isPanelVisible = !isPanelVisible;
      notificationPanel.style.display = isPanelVisible ? 'block' : 'none';
  }

  // Evento para alternar la visibilidad al hacer clic en el icono de campanita
  notificationBtn.addEventListener('click', toggleNotificationPanel);

  // Función para agregar notificaciones
  function addNotification(message, type = 'info') {
      const notificationItem = document.createElement('li');
      notificationItem.className = `list-group-item list-group-item-${type} d-flex justify-content-between align-items-center`;
      notificationItem.innerHTML = `
          ${message}
          <button type="button" class="btn-close" aria-label="Close"></button>
      `;

      // Evento para eliminar la notificación individual
      notificationItem.querySelector('.btn-close').addEventListener('click', () => {
          notificationList.removeChild(notificationItem);
          updateNotificationCount();
      });

      // Agregar la notificación a la lista
      notificationList.appendChild(notificationItem);
      updateNotificationCount();
  }

  // Función para actualizar el contador de notificaciones
  function updateNotificationCount() {
      const count = notificationList.childElementCount;
      notificationCount.textContent = count;
  }

  // Evento para borrar todas las notificaciones
  clearAllBtn.addEventListener('click', () => {
      notificationList.innerHTML = '';
      updateNotificationCount();
  });

  // Ejemplo: Agregar algunas notificaciones al cargar la página
  addNotification('Bienvenido a la aplicación.', 'success');
  addNotification('Tienes una nueva alerta.', 'warning');
  addNotification('Se ha producido un error inesperado.', 'danger');