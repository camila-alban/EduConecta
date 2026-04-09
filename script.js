const opportunities = [
    {
        id: 2,
        title: "Summit IA Generativa 2026",
        type: "eventos",
        category: "Eventos",
        institution: "TechHub SP",
        instDesc: "O maior ecossistema de inovação da América Latina.",
        date: "15 de Maio, 2026",
        time: "09:00 - 18:00",
        location: "São Paulo, SP",
        description: "O maior encontro sobre Inteligência Artificial Generativa. Palestras com especialistas mundiais e networking de alto nível.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80",
        saved: false
    },
    {
        id: 3,
        title: "Desenvolvedor Frontend Sênior",
        type: "vagas",
        category: "Vagas",
        institution: "Nubank",
        instDesc: "Revolucionando o sistema financeiro com tecnologia.",
        date: "Publicada há 2 dias",
        time: "Full-time / Remoto",
        location: "Brasil",
        description: "Buscamos talentos apaixonados por React e Typescript para construir a próxima geração de serviços financeiros digitais.",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
        saved: false
    },
    {
        id: 4,
        title: "Workshop: Liderança Ágil",
        type: "workshops",
        category: "Workshops",
        institution: "FGV",
        instDesc: "Instituição de excelência em gestão e economia.",
        date: "22 de Abril, 2026",
        time: "19:00 - 22:00",
        location: "Online",
        description: "Desenvolva habilidades de liderança em ambientes de alta incerteza. Foco em frameworks ágeis e gestão de times remotos.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
        saved: false
    },
    {
        id: 5,
        title: "Data Science para Negócios",
        type: "cursos",
        category: "Cursos",
        institution: "Udacity",
        instDesc: "A universidade do futuro, focada em tech.",
        date: "Flexível",
        time: "Duração: 60h",
        location: "Online",
        description: "Transforme dados em decisões estratégicas. Aprenda Python, SQL e técnicas de visualização de dados aplicadas ao business.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
        saved: false
    },
    {
        id: 6,
        title: "Hackathon Sustentabilidade",
        type: "eventos",
        category: "Eventos",
        institution: "GreenTech",
        instDesc: "Focada em soluções tecnológicas para o planeta.",
        date: "05 de Junho, 2026",
        time: "48 horas seguidas",
        location: "Florianópolis, SC",
        description: "Crie soluções para os maiores desafios ambientais do nosso tempo. Prêmios em dinheiro e aceleração para os melhores projetos.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
        saved: false
    }
];

let currentView = 'home';
let currentFilter = 'todas';
let searchQuery = '';
let savedIds = JSON.parse(localStorage.getItem('educonecta_saved')) || [];

const appContent = document.getElementById('content');
const tabButtons = document.querySelectorAll('.tab-item');
const navIndicator = document.querySelector('.nav-indicator');
const searchTrigger = document.getElementById('search-trigger');
const searchBar = document.getElementById('search-bar');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');
const detailOverlay = document.getElementById('detail-view');

function init() {
    renderView('home');
    setupNavigation();
    setupSearch();
    updateSavedCount();
}

function setupNavigation() {
    tabButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (view === currentView) return;

            // Update UI
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Move Indicator
            navIndicator.style.transform = `translateX(${index * 100}%)`;

            // Switch View
            currentView = view;
            renderView(view);
        });
    });
}

function renderView(viewName) {
    const template = document.getElementById(`${viewName}-template`);
    if (!template) return;

    appContent.innerHTML = '';
    const clone = template.content.cloneNode(true);
    appContent.appendChild(clone);

    if (viewName === 'home') {
        setupHomeView();
    } else if (viewName === 'saved') {
        setupSavedView();
    } else if (viewName === 'profile') {
        setupProfileView();
    }
}

function setupHomeView() {
    const filterButtons = document.querySelectorAll('.cat-chip');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderOpportunities();
        });
    });

    renderOpportunities();
}

function renderOpportunities() {
    const list = document.getElementById('opportunities-list');
    if (!list) return;

    let filtered = opportunities.filter(item => {
        const matchesFilter = currentFilter === 'todas' || item.type === currentFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.institution.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const heroCount = document.getElementById('hero-count');
    if (heroCount) heroCount.textContent = `${filtered.length} novas`;

    list.innerHTML = filtered.length ? '' : '<p class="empty-msg">Nenhuma oportunidade encontrada.</p>';

    filtered.forEach(item => {
        const isSaved = savedIds.includes(item.id);
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="card-tag">${item.category}</div>
                <button class="card-save-btn ${isSaved ? 'saved' : ''}" data-id="${item.id}">
                    ${isSaved ? '🔖' : '🔖'}
                </button>
            </div>
            <div class="card-body">
                <h4>${item.title}</h4>
                <div class="card-footer">
                    <span class="inst-name">${item.institution}</span>
                    <span>${item.date}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.card-save-btn')) {
                toggleSave(item.id);
                renderOpportunities(); // Refresh list to show saved state
                return;
            }
            openDetail(item);
        });

        list.appendChild(card);
    });
}

function setupSavedView() {
    const savedList = document.getElementById('saved-list');
    if (!savedList) return;

    const savedOpportunities = opportunities.filter(item => savedIds.includes(item.id));
    
    savedList.innerHTML = savedOpportunities.length ? '' : `
        <div class="empty-state">
            <span class="empty-icon">🔖</span>
            <p>Você ainda não salvou nada.</p>
        </div>
    `;

    savedOpportunities.forEach(item => {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.title}">
                <div class="card-tag">${item.category}</div>
                <button class="card-save-btn saved" data-id="${item.id}">🔖</button>
            </div>
            <div class="card-body">
                <h4>${item.title}</h4>
                <div class="card-footer">
                    <span class="inst-name">${item.institution}</span>
                    <span>${item.date}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.card-save-btn')) {
                toggleSave(item.id);
                setupSavedView(); // Refresh saved list
                return;
            }
            openDetail(item);
        });

        savedList.appendChild(card);
    });
}

function setupProfileView() {
    const savedCount = document.getElementById('profile-saved-count');
    if (savedCount) savedCount.textContent = savedIds.length;

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            alert('Funcionalidade de Logout (Simulação)');
        });
    }
}

function openDetail(item) {
    const template = document.getElementById('detail-page-template');
    const content = document.getElementById('detail-content');
    
    content.innerHTML = '';
    const clone = template.content.cloneNode(true);
    content.appendChild(clone);

    // Populate data
    document.getElementById('d-image').src = item.image;
    document.getElementById('d-title').textContent = item.title;
    document.getElementById('d-tag').textContent = item.category;
    document.getElementById('d-date').textContent = item.date;
    document.getElementById('d-time').textContent = item.time;
    document.getElementById('d-location').textContent = item.location;
    document.getElementById('d-desc').textContent = item.description;
    document.getElementById('d-inst-name').textContent = item.institution;
    document.getElementById('d-inst-desc').textContent = item.instDesc;

    const saveBtn = document.getElementById('d-save-btn');
    const isSaved = savedIds.includes(item.id);
    updateDetailSaveBtn(saveBtn, isSaved);

    saveBtn.addEventListener('click', () => {
        const newState = toggleSave(item.id);
        updateDetailSaveBtn(saveBtn, newState);
    });

    document.getElementById('d-close-btn').addEventListener('click', closeDetail);
    document.getElementById('d-enroll-btn').addEventListener('click', () => {
        alert(`Inscrição solicitada para: ${item.title}`);
    });

    detailOverlay.classList.add('active');
}

function closeDetail() {
    detailOverlay.classList.remove('active');
    renderView(currentView);
}

function updateDetailSaveBtn(btn, isSaved) {
    btn.textContent = isSaved ? 'Salvo' : 'Salvar';
    btn.classList.toggle('saved', isSaved);
}

function setupSearch() {
    searchTrigger.addEventListener('click', () => {
        searchBar.classList.add('active');
        searchInput.focus();
    });

    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('active');
        searchInput.value = '';
        searchQuery = '';
        if (currentView === 'home') renderOpportunities();
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (currentView === 'home') renderOpportunities();
    });
}

function toggleSave(id) {
    const index = savedIds.indexOf(id);
    let isSavedNow = false;
    
    if (index === -1) {
        savedIds.push(id);
        isSavedNow = true;
    } else {
        savedIds.splice(index, 1);
        isSavedNow = false;
    }

    localStorage.setItem('educonecta_saved', JSON.stringify(savedIds));
    updateSavedCount();
    return isSavedNow;
}

function updateSavedCount() {
}

init();
