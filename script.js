const opportunities = [
    {
        id: 1,
        title: "Feira de Oportunidades Jovem 2026",
        category: "eventos",
        tag: "EVENTO",
        image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=800&q=80",
        date: "Sábado, 11 de Abril de 2026",
        time: "10:00 - 18:00",
        location: "Parque da cidade, Salvador - BA",
        description: "Evento tech para conectar ideias e pessoas 🚀.",
        institution: "Prefeitura de Salvador",
        instDesc: "Evento da Secretaria Municipal."
    },
    {
        id: 2,
        title: "Oportunidade de Carreira Jovem 2026",
        category: "vagas",
        tag: "VAGAS",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
        date: "Quinta-feira, 16 de Abril de 2026",
        time: "09:00 - 17:00",
        location: "Parque da cidade, Salvador - BA",
        description: "Entre no mercado de trabalho 💼.",
        institution: "Prefeitura de Salvador",
        instDesc: "Empregabilidade jovem."
    },
    {
        id: 3,
        title: "Workshop Jovem de Inovação",
        category: "workshops", 
        tag: "WORKSHOP",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        date: "Terça-feira, 21 de Abril de 2026",
        time: "14:00 - 18:00",
        location: "Parque da cidade, Salvador - BA",
        description: "Aprendizado prático e inovação ✨.",
        institution: "Prefeitura de Salvador",
        instDesc: "Foco em criatividade."
    },
    {
        id: 4,
        title: "Programa de Capacitação Jovem 2026",
        category: "cursos",
        tag: "CURSOS",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        date: "Segunda-feira, 27 de Abril de 2026",
        time: "10:00 - 18:00",
        location: "Parque da cidade, Salvador - BA",
        description: "Curso para evolução profissional 📚.",
        institution: "Prefeitura de Salvador",
        instDesc: "Qualificação profissional."
    }
];

let currentView = 'home';
let currentFilter = 'todas';

const appContent = document.getElementById('content');
const homeTemplate = document.getElementById('home-template');
const detailsTemplate = document.getElementById('details-template');
const profileTemplate = document.getElementById('profile-template');

function init() {
    renderHome();
    setupHeaderActions();
}

function setupHeaderActions() {
    document.getElementById('profile-btn').addEventListener('click', () => {
        renderProfile();
    });

    document.querySelector('.logo').addEventListener('click', () => {
        renderHome();
    });
}

function renderHome() {
    currentView = 'home';

    appContent.innerHTML = '';
    const clone = homeTemplate.content.cloneNode(true);
    appContent.appendChild(clone);

    const listContainer = document.getElementById('opportunities-list');
    renderCards(opportunities, listContainer);

    const filters = appContent.querySelectorAll('.filter-chip');

    filters.forEach(chip => {
        chip.addEventListener('click', () => {
            filters.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.getAttribute('data-filter');

            let filtered;

            if (filter === 'todas') {
                filtered = opportunities;
            } else {
                filtered = opportunities.filter(item => item.category === filter);
            }

            renderCards(filtered, listContainer);
        });
    });
}

function renderCards(data, container) {
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = "<p>Nenhuma oportunidade encontrada 😢</p>";
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${item.image}" alt="${item.title}">
                <span class="card-tag ${item.category}">${item.tag}</span>
            </div>
            <div class="card-content">
                <h4>${item.title}</h4>
                <p>${item.description.substring(0, 100)}...</p>
                <div class="card-footer">
                    <div class="footer-item">📅 ${item.date.split(',')[1].trim()}</div>
                    <div class="footer-item">📍 Salvador - BA</div>
                </div>
            </div>
        `;
        card.addEventListener('click', () => renderDetails(item));
        container.appendChild(card);
    });
}

function renderDetails(item) {
    currentView = 'details';
    const clone = detailsTemplate.content.cloneNode(true);
    appContent.innerHTML = '';
    appContent.appendChild(clone);

    document.getElementById('details-image').src = item.image;
    document.getElementById('details-title').innerText = item.title;
    document.getElementById('details-tag').innerText = item.tag;
    document.getElementById('details-tag').className = `tag ${item.category}`;
    document.getElementById('details-date').innerText = item.date;
    document.getElementById('details-time').innerText = item.time;
    document.getElementById('details-location').innerText = item.location;
    document.getElementById('details-text').innerText = item.description;
    document.getElementById('details-inst-name').innerText = item.institution;
    document.getElementById('details-inst-desc').innerText = item.instDesc;

    document.getElementById('back-btn').addEventListener('click', renderHome);

    document.getElementById('enroll-btn').addEventListener('click', () => {
        alert('Inscrição realizada com sucesso! 🎉');
    });
}

function renderProfile() {
    currentView = 'profile';
    const clone = profileTemplate.content.cloneNode(true);
    appContent.innerHTML = '';
    appContent.appendChild(clone);

    const savedList = document.getElementById('saved-list');
    renderCards([opportunities[2]], savedList);

    document.querySelector('.btn-logout').addEventListener('click', () => {
        alert('Saindo...');
        location.reload();
    });
}

init();
