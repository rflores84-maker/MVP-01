const demoCredentials = {
  username: 'admin',
  password: '1234',
};

const categories = {
  ingreso: ['Salario', 'Ventas', 'Intereses', 'Otros ingresos'],
  gasto: [
    'Vivienda',
    'Servicios',
    'Alimentación',
    'Transporte',
    'Entretenimiento',
    'Salud',
  ],
  cuenta: ['Caja de ahorro', 'Cuenta corriente', 'Inversiones'],
  tarjeta1: ['Compras del mes', 'Suscripciones', 'Viajes'],
  tarjeta2: ['Compras online', 'Educación', 'Familia'],
  tarjeta3: ['Negocio', 'Gastos médicos', 'Otros'],
};

const entries = [];

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const loginError = document.getElementById('login-error');
const userNameLabel = document.getElementById('user-name');
const fillDemoButton = document.getElementById('fill-demo');

const entryForm = document.getElementById('entry-form');
const entryType = document.getElementById('entry-type');
const entryDate = document.getElementById('entry-date');
const entryCategory = document.getElementById('entry-category');
const entryDescription = document.getElementById('entry-description');
const entryAmount = document.getElementById('entry-amount');
const entryTableBody = document.getElementById('entry-table-body');

const visualizationContent = document.getElementById('visualization-content');

const configTypeSelect = document.getElementById('config-type');
const newCategoryInput = document.getElementById('new-category');
const addCategoryButton = document.getElementById('add-category');
const categoryItems = document.getElementById('category-items');

const sidebarButtons = document.querySelectorAll('.sidebar-btn');
const panels = document.querySelectorAll('[data-panel]');

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
}

function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  entryDate.value = today;
}

function populateCategoryOptions(type) {
  entryCategory.innerHTML = '';
  const options = categories[type] || [];
  options.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    entryCategory.appendChild(option);
  });
}

function renderEntries() {
  entryTableBody.innerHTML = '';

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedEntries.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.typeLabel}</td>
      <td>${entry.category}</td>
      <td>${entry.description}</td>
      <td class="align-right">${formatCurrency(entry.amount)}</td>
    `;
    entryTableBody.appendChild(row);
  });
}

function getTypeLabel(type) {
  switch (type) {
    case 'ingreso':
      return 'Ingreso';
    case 'gasto':
      return 'Gasto';
    case 'cuenta':
      return 'Cuenta';
    case 'tarjeta1':
      return 'Tarjeta de crédito 1';
    case 'tarjeta2':
      return 'Tarjeta de crédito 2';
    case 'tarjeta3':
      return 'Tarjeta de crédito 3';
    default:
      return type;
  }
}

function groupEntriesByMonth() {
  const grouped = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;

    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }

    grouped[monthKey].push(entry);
  });

  return grouped;
}

function renderVisualization() {
  const grouped = groupEntriesByMonth();
  visualizationContent.innerHTML = '';

  const months = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  if (months.length === 0) {
    visualizationContent.innerHTML = '<p>No hay movimientos registrados todavía.</p>';
    return;
  }

  months.forEach((monthKey) => {
    const [year, month] = monthKey.split('-');
    const monthName = new Date(`${monthKey}-01`).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });

    const monthEntries = grouped[monthKey];
    const sections = {
      ingreso: [],
      gasto: [],
      cuenta: [],
      tarjeta1: [],
      tarjeta2: [],
      tarjeta3: [],
    };

    monthEntries.forEach((entry) => {
      sections[entry.type].push(entry);
    });

    const card = document.createElement('div');
    card.className = 'month-card';
    card.innerHTML = `<h3>${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</h3>`;

    Object.entries(sections).forEach(([type, list]) => {
      if (list.length === 0) return;
      const section = document.createElement('div');
      section.className = 'month-section';
      const total = list.reduce((sum, item) => sum + item.amount, 0);
      section.innerHTML = `
        <h4>${getTypeLabel(type)} — Total: <strong>${formatCurrency(total)}</strong></h4>
        <div class="month-list">
          ${list
            .map(
              (item) => `
                <div class="list-item">
                  <span>${item.date} · ${item.category} · ${item.description}</span>
                  <strong>${formatCurrency(item.amount)}</strong>
                </div>
              `
            )
            .join('')}
        </div>
      `;
      card.appendChild(section);
    });

    visualizationContent.appendChild(card);
  });
}

function renderCategoryList(type) {
  categoryItems.innerHTML = '';
  const items = categories[type] || [];

  if (items.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No hay categorías disponibles.';
    categoryItems.appendChild(empty);
    return;
  }

  items.forEach((category) => {
    const li = document.createElement('li');
    li.className = 'category-pill';
    const button = document.createElement('button');
    button.className = 'remove-btn';
    button.type = 'button';
    button.textContent = '×';
    button.addEventListener('click', () => {
      categories[type] = categories[type].filter((item) => item !== category);
      renderCategoryList(type);
      if (entryType.value === type) {
        populateCategoryOptions(type);
      }
    });

    li.innerHTML = `<span>${category}</span>`;
    li.appendChild(button);
    categoryItems.appendChild(li);
  });
}

function switchPanel(targetId) {
  panels.forEach((panel) => {
    panel.classList.toggle('hidden', panel.id !== targetId);
  });

  sidebarButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.target === targetId);
  });

  if (targetId === 'visualization') {
    renderVisualization();
  } else if (targetId === 'configuration') {
    renderCategoryList(configTypeSelect.value);
  }
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === demoCredentials.username && password === demoCredentials.password) {
    loginSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    userNameLabel.textContent = username;
    loginError.textContent = '';
    loginForm.reset();
  } else {
    loginError.textContent = 'Usuario o contraseña incorrectos. Intenta nuevamente.';
    usernameInput.focus();
  }
});

loginForm.addEventListener('input', () => {
  if (loginError.textContent) {
    loginError.textContent = '';
  }
});

fillDemoButton?.addEventListener('click', () => {
  usernameInput.value = demoCredentials.username;
  passwordInput.value = demoCredentials.password;
  loginError.textContent = '';
  if (typeof loginForm.requestSubmit === 'function') {
    loginForm.requestSubmit();
  } else {
    loginForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
});

entryType.addEventListener('change', (event) => {
  populateCategoryOptions(event.target.value);
});

entryForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const type = entryType.value;
  const date = entryDate.value;
  const category = entryCategory.value;
  const description = entryDescription.value.trim();
  const amount = parseFloat(entryAmount.value);

  if (!date || Number.isNaN(amount)) {
    return;
  }

  entries.push({
    type,
    typeLabel: getTypeLabel(type),
    date,
    category,
    description,
    amount,
  });

  entryDescription.value = '';
  entryAmount.value = '';
  setTodayDate();

  renderEntries();
});

configTypeSelect.addEventListener('change', (event) => {
  const type = event.target.value;
  renderCategoryList(type);
});

addCategoryButton.addEventListener('click', () => {
  const type = configTypeSelect.value;
  const newCategory = newCategoryInput.value.trim();

  if (!newCategory) return;
  if (!categories[type].includes(newCategory)) {
    categories[type].push(newCategory);
    newCategoryInput.value = '';
    renderCategoryList(type);
    if (entryType.value === type) {
      populateCategoryOptions(type);
    }
  }
});

sidebarButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    switchPanel(target);
  });
});

if (usernameInput) {
  usernameInput.focus();
}

setTodayDate();
populateCategoryOptions(entryType.value);
renderEntries();
renderCategoryList(configTypeSelect.value);
