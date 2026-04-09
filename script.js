document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Elements ---
    const content = document.getElementById('content');
    const homeTemplate = document.getElementById('home-template');
    const savedTemplate = document.getElementById('saved-template');
    const profileTemplate = document.getElementById('profile-template');
    const detailView = document.getElementById('detail-view');
    const detailContent = document.getElementById('detail-content');
    const detailPageTemplate = document.getElementById('detail-page-template');
    
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    const searchTrigger = document.getElementById('search-trigger');
    const searchClose = document.getElementById('search-close');
    const tabItems = document.querySelectorAll('.tab-item');
    const navIndicator = document.querySelector('.nav-indicator');

    // --- State Management ---
    const opportunities = [
        {
            id: 1,
            title: "Introdução ao React & Next.js",
            type: "cursos",
            tag: "🎓 Curso",
            date: "15 Abr, 2026",
            time: "19:00 - 21:00",
            location: "Online via Zoom",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
            description: "Aprenda as bases do desenvolvimento web moderno com as tecnologias mais requisitadas do mercado. Este curso abrange desde o básico do React até as novas funcionalidades do Next.js.",
            institution: "Tech Academy Brasil",
            instDesc: "Uma instituição dedicada a formar novos talentos na área de tecnologia com cursos práticos e gratuitos."
        },
        {
            id: 3,
            title: "Desenvolvedor Front-end Júnior",
            type: "vagas",
            tag: "💼 Vaga",
            date: "Até 30 Abr",
            time: "Horário Comercial",
            location: "Remoto ou Híbrido (SP)",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
            description: "Estamos em busca de novos talentos para integrar nosso time de desenvolvimento. Se você tem paixão por código e quer aprender, essa vaga é para você!",
            institution: "Inova Soft",
            instDesc: "Startup em rápido crescimento no setor de fintechs, buscando inovação constante."
        },
        {
            id: 4,
            title: "Feira de Profissões 2026",
            type: "eventos",
            tag: "📅 Evento",
            date: "05 Mai, 2026",
            time: "09:00 - 17:00",
            location: "Centro de Convenções",
            image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&auto=format&fit=crop&q=60",
            description: "Conheça diversas áreas de atuação, converse com profissionais experientes e descubra qual carreira mais combina com você.",
            institution: "Educação Para Todos",
            instDesc: "ONG focada em orientação vocacional e democratização do acesso à educação de qualidade."
        },
        {
            id: 5,
            title: "Curso de Inglês para Negócios",
            type: "cursos",
            tag: "🎓 Curso",
            date: "Ter e Qui",
            time: "18:30 - 20:00",
            location: "Escola Global",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
            description: "Aprimore seu vocabulário profissional e ganhe confiança para reuniões e apresentações internacionais.",
            institution: "Global Languages",
            instDesc: "Especialistas em ensino de idiomas para fins profissionais com metodologia acelerada."
        },
        {
            id: 6,
            title: "Workshop de Python para Dados",
            type: "workshops",
            tag: "🔧 Workshop",
            date: "12 Jun, 2026",
            time: "09:00 - 13:00",
            location: "Lab de Inovação",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
            description: "Inicie sua jornada em Data Science aprendendo as bibliotecas essenciais do Python.",
            institution: "Data Masters",
            instDesc: "Escola focada em inteligência de dados e análise preditiva."
        }
    ];

    let currentView = 'home';
    let currentFilter = 'todas';
    let savedIds = JSON.parse(localStorage.getItem('educonecta_saved')) || [];

    // --- Core Functions ---

    function updateNavIndicator() {
        const activeTab = document.querySelector('.tab-item.active');
        if (activeTab && navIndicator) {
            const rect = activeTab.getBoundingClientRect();
            const parentRect = activeTab.parentElement.getBoundingClientRect();
            navIndicator.style.width = `${rect.width * 0.4}px`;
            navIndicator.style.left = `${rect.left - parentRect.left + (rect.width * 0.3)}px`;
        }
    }

    function switchView(viewName) {
        currentView = viewName;
        content.innerHTML = '';
        
        tabItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });
        updateNavIndicator();

        let clone;
        if (viewName === 'home') {
            clone = homeTemplate.content.cloneNode(true);
            content.appendChild(clone);
            setupHomeView();
        } else if (viewName === 'saved') {
            clone = savedTemplate.content.cloneNode(true);
            content.appendChild(clone);
            renderSavedList();
        } else if (viewName === 'profile') {
            clone = profileTemplate.content.cloneNode(true);
            content.appendChild(clone);
            setupProfileView();
        }
    }

    function setupHomeView() {
        // Filter Chips Logic
        const chips = document.querySelectorAll('.cat-chip');
        chips.forEach(chip => {
            chip.classList.toggle('active', chip.dataset.filter === currentFilter);
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentFilter = chip.dataset.filter;
                renderOpportunitiesList();
            });
        });
        renderOpportunitiesList();
    }

    function renderOpportunitiesList(filteredItems = null) {
        const list = document.getElementById('opportunities-list');
        if (!list) return;

        list.innerHTML = '';
        const items = filteredItems || (currentFilter === 'todas' 
            ? opportunities 
            : opportunities.filter(o => o.type === currentFilter));

        if (items.length === 0) {
            list.innerHTML = `<div class="empty-state">Nenhum resultado encontrado.</div>`;
            return;
        }

        items.forEach((opp, index) => {
            const card = createCard(opp);
            card.style.animationDelay = `${index * 0.1}s`;
            list.appendChild(card);
        });
    }

    function renderSavedList() {
        const list = document.getElementById('saved-list');
        if (!list) return;

        const savedItems = opportunities.filter(o => savedIds.includes(o.id));
        if (savedItems.length === 0) {
            list.innerHTML = `<div class="empty-state">Você ainda não salvou nada.</div>`;
            return;
        }

        savedItems.forEach(opp => list.appendChild(createCard(opp)));
    }

    function createCard(opp) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img-wrap">
                <img src="${opp.image}" alt="${opp.title}" loading="lazy">
                <div class="card-badge">${opp.tag}</div>
            </div>
            <div class="card-body">
                <h4>${opp.title}</h4>
                <div class="card-meta">
                    <span>📅 ${opp.date} • ${opp.time}</span>
                    <span>📍 ${opp.location}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openDetail(opp));
        return card;
    }

    function openDetail(opp) {
        detailContent.innerHTML = '';
        const clone = detailPageTemplate.content.cloneNode(true);
        
        clone.querySelector('#d-image').src = opp.image;
        clone.querySelector('#d-title').textContent = opp.title;
        clone.querySelector('#d-tag').textContent = opp.tag;
        clone.querySelector('#d-date').textContent = opp.date;
        clone.querySelector('#d-time').textContent = opp.time;
        clone.querySelector('#d-location').textContent = opp.location;
        clone.querySelector('#d-desc').textContent = opp.description;
        clone.querySelector('#d-inst-name').textContent = opp.institution;
        clone.querySelector('#d-inst-desc').textContent = opp.instDesc;

        const backBtn = clone.querySelector('.detail-back-btn');
        backBtn.addEventListener('click', () => detailView.classList.remove('active'));

        const saveBtn = clone.querySelector('#d-save-btn');
        const updateSaveUI = () => {
            const isSaved = savedIds.includes(opp.id);
            saveBtn.textContent = isSaved ? 'Remover' : 'Salvar';
            saveBtn.style.background = isSaved ? '#f1f5f9' : 'white';
        };
        updateSaveUI();

        saveBtn.addEventListener('click', () => {
            if (savedIds.includes(opp.id)) {
                savedIds = savedIds.filter(id => id !== opp.id);
            } else {
                savedIds.push(opp.id);
            }
            localStorage.setItem('educonecta_saved', JSON.stringify(savedIds));
            updateSaveUI();
        });

        const enrollBtn = clone.querySelector('#d-enroll-btn');
        enrollBtn.addEventListener('click', () => {
            enrollBtn.textContent = 'Inscrito com Sucesso! ✅';
            enrollBtn.style.background = '#10b981';
            enrollBtn.disabled = true;
            setTimeout(() => alert('Parabéns! Sua inscrição foi enviada para ' + opp.institution), 500);
        });

        detailContent.appendChild(clone);
        detailView.classList.add('active');
    }

    function setupProfileView() {
        document.getElementById('profile-saved-count').textContent = savedIds.length;
        document.querySelector('.logout-btn').addEventListener('click', () => {
            if(confirm('Deseja realmente sair?')) location.reload();
        });
    }

    // --- Search Logic ---

    function toggleSearch() {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
        }
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (currentView !== 'home') switchView('home');
        
        const filtered = opportunities.filter(o => 
            o.title.toLowerCase().includes(query) || 
            o.description.toLowerCase().includes(query)
        );
        renderOpportunitiesList(filtered);
    });

    // --- Event Listeners ---

    searchTrigger.addEventListener('click', toggleSearch);
    searchClose.addEventListener('click', () => {
        toggleSearch();
        searchInput.value = '';
        renderOpportunitiesList();
    });

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => switchView(tab.dataset.view));
    });

    // Initial load
    switchView('home');
    window.addEventListener('resize', updateNavIndicator);
});
