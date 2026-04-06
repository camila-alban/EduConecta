const opportunities = [
    {
        id: 1,
        title: "Feira de Oportunidades Jovem 2026",
        category: "eventos",
        tag: "EVENTO",
        image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "Sábado, 11 de Abril de 2026",
        time: "10:00 - 18:00",
        location: "Parque da cidade, Salvador - BA",
        description: "Você está convidado para uma oportunidade única 🚀. Participe de um evento tech pensado para conectar ideias, pessoas e o futuro. Será um momento para explorar tendências, trocar experiências e descobrir novas possibilidades no mundo da tecnologia. Se você é apaixonado por inovação ou quer dar o próximo passo na sua jornada digital, esse encontro é o lugar certo para estar. Não fique de fora — o futuro começa aqui.",
        institution: "Prefeitura de Salvador",
        instDesc: "Este evento está sendo ofertado pela Secretaria Municipal de Salvador, com o objetivo de incentivar a inovação."
    },
    {
        id: 2,
        title: "Oportunidade de Carreira Jovem 2026",
        category: "vagas",
        tag: "VAGAS",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "Quinta-feira, 16 de Abril de 2026",
        time: "09:00 - 17:00",
        location: "Parque da cidade, Salvador - BA",
        description: "Uma oportunidade real de entrar no mercado e mostrar seu talento 💼. Aqui, você poderá se conectar com empresas, conhecer novas possibilidades e dar um passo importante na sua trajetória profissional. Se você quer crescer, aprender na prática e abrir portas para o futuro, este é o momento certo para agir. As melhores oportunidades começam com uma decisão — a sua pode ser hoje.",
        institution: "Prefeitura de Salvador",
        instDesc: "Iniciativa da Secretaria Municipal de Salvador para fortalecer a empregabilidade jovem."
    },
    {
        id: 3,
        title: "Workshop Jovem de Inovação",
        category: "eventos",
        tag: "WORKSHOP",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "Terça-feira, 21 de Abril de 2026",
        time: "14:00 - 18:00",
        location: "Parque da cidade, Salvador - BA",
        description: "Participe de uma experiência prática e dinâmica, onde conhecimento e ação caminham juntos. Coloque a mão na massa e desenvolva novas habilidades ✨. Este workshop foi pensado para quem quer aprender de forma prática, explorar ideias e criar soluções inovadoras em um ambiente colaborativo. Uma experiência dinâmica, com troca de conhecimento e muita experimentação. Aprender nunca foi tão envolvente — venha viver isso de perto.",
        institution: "Prefeitura de Salvador",
        instDesc: "Ação da Secretaria Municipal de Salvador voltada ao estímulo da criatividade e inovação."
    },
    {
        id: 4,
        title: "Programa de Capacitação Jovem 2026",
        category: "cursos",
        tag: "CURSOS",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "Segunda-feira, 27 de Abril de 2026",
        time: "10:00 - 18:00",
        location: "Parque da cidade, Salvador - BA",
        description: "Descubra novos conhecimentos e amplie suas possibilidades com um curso pensado para quem deseja evoluir e se destacar. Amplie seus horizontes com conhecimento que faz diferença 📚. Este curso oferece conteúdos atualizados para quem deseja se qualificar e acompanhar as transformações do mundo digital. Ideal para quem quer começar algo novo ou se destacar ainda mais na sua área. Invista em você — o aprendizado é o primeiro passo para grandes conquistas.",
        institution: "Prefeitura de Salvador",
        instDesc: "Programa da Secretaria Municipal de Salvador focado na educação e qualificação profissional."
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
    const clone = homeTemplate.content.cloneNode(true);
    appContent.innerHTML = '';
    appContent.appendChild(clone);

    const listContainer = document.getElementById('opportunities-list');
    renderCards(opportunities, listContainer);

    const filters = document.querySelectorAll('.filter-chip');
    filters.forEach(chip => {
        chip.addEventListener('click', (e) => {
            filters.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            
            const filtered = currentFilter === 'todas' 
                ? opportunities 
                : opportunities.filter(o => o.category === currentFilter);
            
            renderCards(filtered, listContainer);
        });
    });
}

function renderCards(data, container) {
    container.innerHTML = '';
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
                    <div class="footer-item"><span>📅</span> ${item.date.split(',')[1].trim()}</div>
                    <div class="footer-item"><span>📍</span> Salvador - BA</div>
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

    document.getElementById('back-btn').addEventListener('click', () => {
        renderHome();
    });

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
        alert('Saindo da conta...');
        location.reload();
    });
}

init();
