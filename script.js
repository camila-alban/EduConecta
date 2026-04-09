document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const homeTemplate = document.getElementById('home-template');
    const detailsTemplate = document.getElementById('details-template');
    const profileTemplate = document.getElementById('profile-template');

    // Mock Data
    const opportunities = [
        {
            id: 1,
            title: "Introdução ao React & Next.js",
            type: "cursos",
            tag: "🎓 Curso",
            date: "15 de Abril, 2026",
            time: "19:00 - 21:00",
            location: "Online via Zoom",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
            description: "Aprenda as bases do desenvolvimento web moderno com as tecnologias mais requisitadas do mercado. Este curso abrange desde o básico do React até as novas funcionalidades do Next.js.",
            institution: "Tech Academy Brasil",
            instDesc: "Uma instituição dedicada a formar novos talentos na área de tecnologia com cursos práticos e gratuitos."
        },
        {
            id: 2,
            title: "Workshop de Design UX/UI",
            type: "workshops",
            tag: "🔧 Workshop",
            date: "22 de Abril, 2026",
            time: "14:00 - 18:00",
            location: "Espaço Co-working, Centro",
            image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&auto=format&fit=crop&q=60",
            description: "Um workshop prático focado em princípios de design, prototipagem e testes de usabilidade para quem quer entrar no mundo do design de produtos digitais.",
            institution: "Design Hub",
            instDesc: "Comunidade de designers focada em compartilhar conhecimento e fomentar a inovação no Brasil."
        },
        {
            id: 3,
            title: "Desenvolvedor Front-end Júnior",
            type: "vagas",
            tag: "💼 Vaga",
            date: "Inscrições até 30 de Abril",
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
            date: "05 de Maio, 2026",
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
            date: "Toda Terça e Quinta",
            time: "18:30 - 20:00",
            location: "Escola de Idiomas Global",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
            description: "Aprimore seu vocabulário profissional e ganhe confiança para reuniões e apresentações internacionais.",
            institution: "Global Languages",
            instDesc: "Especialistas em ensino de idiomas para fins profissionais com metodologia acelerada."
        }
    ];

    let currentFilter = 'todas';
    let savedIds = JSON.parse(localStorage.getItem('savedIds')) || [1];

    function saveState() {
        localStorage.setItem('savedIds', JSON.stringify(savedIds));
    }

    // Navigation
    function showHome() {
        content.innerHTML = '';
        const clone = homeTemplate.content.cloneNode(true);
        content.appendChild(clone);
        
        setupFilters();
        renderOpportunities();
    }

    function showDetails(id) {
        const opp = opportunities.find(o => o.id === id);
        if (!opp) return;

        content.innerHTML = '';
        const clone = detailsTemplate.content.cloneNode(true);
        
        const detailsImage = clone.querySelector('#details-image');
        detailsImage.src = opp.image;
        detailsImage.alt = opp.title;

        clone.querySelector('#details-title').textContent = opp.title;
        clone.querySelector('#details-tag').textContent = opp.tag;
        clone.querySelector('#details-date').textContent = opp.date;
        clone.querySelector('#details-time').textContent = opp.time;
        clone.querySelector('#details-location').textContent = opp.location;
        clone.querySelector('#details-text').textContent = opp.description;
        clone.querySelector('#details-inst-name').textContent = opp.institution;
        clone.querySelector('#details-inst-desc').textContent = opp.instDesc;

        clone.querySelector('#back-btn').addEventListener('click', showHome);

        const enrollBtn = clone.querySelector('#enroll-btn');
        enrollBtn.addEventListener('click', () => {
            enrollBtn.textContent = 'Inscrito! ✅';
            enrollBtn.style.background = 'var(--secondary)';
            enrollBtn.disabled = true;
            
            // Add to activity logic could go here
            setTimeout(() => {
                alert(`Inscrição confirmada para: ${opp.title}! Confira seu e-mail.`);
            }, 300);
        });

        const saveBtn = clone.querySelector('.btn-secondary');
        const isSaved = savedIds.includes(opp.id);
        saveBtn.textContent = isSaved ? 'Remover' : 'Salvar';
        
        saveBtn.addEventListener('click', () => {
            if (savedIds.includes(opp.id)) {
                savedIds = savedIds.filter(sid => sid !== opp.id);
                saveBtn.textContent = 'Salvar';
            } else {
                savedIds.push(opp.id);
                saveBtn.textContent = 'Remover';
            }
            saveState();
        });
        
        content.appendChild(clone);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showProfile() {
        content.innerHTML = '';
        const clone = profileTemplate.content.cloneNode(true);
        
        const savedList = clone.querySelector('#saved-list');
        const savedOpps = opportunities.filter(o => savedIds.includes(o.id));
        
        if (savedOpps.length === 0) {
            savedList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhuma oportunidade salva ainda.</p>';
        } else {
            savedOpps.forEach(opp => {
                const card = createOpportunityCard(opp);
                savedList.appendChild(card);
            });
        }

        clone.querySelector('.act-count').textContent = savedIds.length;

        content.appendChild(clone);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Search Logic
    function setupSearch() {
        const searchBtn = document.getElementById('search-btn');
        searchBtn.addEventListener('click', () => {
            const query = prompt('O que você está procurando?');
            if (query) {
                const results = opportunities.filter(o => 
                    o.title.toLowerCase().includes(query.toLowerCase()) || 
                    o.description.toLowerCase().includes(query.toLowerCase())
                );
                renderFilteredOpportunities(results);
            }
        });
    }

    function renderFilteredOpportunities(filtered) {
        const list = document.getElementById('opportunities-list');
        if (!list) return;

        list.innerHTML = '';
        if (filtered.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">Nenhuma oportunidade encontrada.</p>';
            return;
        }

        filtered.forEach(opp => {
            list.appendChild(createOpportunityCard(opp));
        });
    }

    // Helpers
    function createOpportunityCard(opp) {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${opp.image}" alt="${opp.title}">
                <span class="card-tag">${opp.tag}</span>
            </div>
            <div class="card-content">
                <h3>${opp.title}</h3>
                <div class="card-info">
                    <span>📅 ${opp.date}</span>
                    <span>📍 ${opp.location}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => showDetails(opp.id));
        return card;
    }

    function renderOpportunities() {
        const list = document.getElementById('opportunities-list');
        if (!list) return;

        list.innerHTML = '';
        const filtered = currentFilter === 'todas' 
            ? opportunities 
            : opportunities.filter(o => o.type === currentFilter);

        filtered.forEach(opp => {
            list.appendChild(createOpportunityCard(opp));
        });
    }

    function setupFilters() {
        const filters = document.querySelectorAll('.filter-chip');
        filters.forEach(chip => {
            chip.addEventListener('click', () => {
                filters.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentFilter = chip.dataset.filter;
                renderOpportunities();
            });
        });
    }

    // Event Listeners
    document.getElementById('profile-btn').addEventListener('click', showProfile);
    document.querySelector('.logo').addEventListener('click', showHome);
    setupSearch();

    // Initial View
    showHome();
});
