import {
  login,
  clearToken,
  hasToken,
  fetchSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkillItem,
  updateSkillItem,
  deleteSkillItem,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "./api.js";
// ============================================
// PORTAFOLIO PROFESIONAL - SCRIPT AVANZADO
// ============================================

// Scroll Progress Bar
function updateScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

// Animaciones en Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationMap = {
    'about-card': 'fadeInUp',
    'stat-item': 'bounceIn',
    'skill-category': 'flipInX',
    'project-card': 'zoomIn',
    'info-card': 'fadeInUp',
    'proficiency-item': 'slideInLeft',
    'section-header': 'fadeInDown' // Animación para los títulos de sección
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Lógica general para todos los elementos
            const animationClass = Array.from(entry.target.classList).find(cls => animationMap[cls]);
            const animation = animationClass ? animationMap[animationClass] : 'fadeIn';
            entry.target.style.animation = `${animation} 1s ease-out forwards`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Contador de Estadísticas
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    // Excluir el contador de proyectos, ya que se maneja por separado
    const filteredCounters = Array.from(counters).filter(c => c.id !== 'projects-counter');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 30;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Iniciar cuando se vea el elemento
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                counterObserver.unobserve(counter);
            }
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter);
    });
}

// Smooth Scroll para links de navegación
function setupSmoothScroll() {
    // Aplicar solo a los links de navegación para no interferir con los modales
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetId = href.substring(1);
            if (href !== '#' && document.getElementById(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar Active Link
function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-btn)');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.opacity = '0.7';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.opacity = '1';
                link.style.color = 'var(--primary)';
            } else {
                link.style.color = 'var(--text-light)';
            }
        });
    });
}

// Animar barras de progreso
function animateProgressBars() {
    // Esta función ahora se activa después de renderizar las barras dinámicamente.
    // El IntersectionObserver se crea dentro de renderProficiencyBars.
}

// Efecto hover en skill items
function enhanceSkillItems() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Cerrar modal de proyecto con ESC
function setupProjectModalClosing() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.location.hash = '';
        }
    });
}

// Click fuera del modal cierra
function setupClickOutsideModalClosing() {
    document.querySelectorAll('.project-detail').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.location.hash = '';
            }
        });
    });
}

// Parallax efecto sutil
function setupParallaxEffect() {
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroImage.style.transform = `translateY(${scrollY * 0.3}px)`;
        });
    }
}

// Animación inicial del Hero
function setupHeroAnimation() {
    const heroGreeting = document.querySelector('.hero-greeting');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroGreeting) {
        heroGreeting.style.animation = 'zoomInUp 0.8s ease-out 0.2s both';
    }
    if (heroTitle) {
        heroTitle.style.animation = 'zoomInUp 0.8s ease-out 0.4s both';
    }
    if (heroSubtitle) {
        heroSubtitle.style.animation = 'zoomInUp 0.8s ease-out 0.6s both';
    }
    if (heroDescription) {
        heroDescription.style.animation = 'zoomInUp 0.8s ease-out 0.8s both';
    }
    if (heroButtons) {
        heroButtons.style.animation = 'zoomInUp 0.8s ease-out 1s both';
    }
}

// Observar elementos para animación
function observeElements() {
    const elementsToObserve = document.querySelectorAll(
        '.section-header, .about-card, .stat-item, .skill-category, .project-card, .info-card, .proficiency-item'
    );
    
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// Efecto hover mejorado en project cards
function enhanceProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 25px 50px rgba(95, 227, 160, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 0 rgba(95, 227, 160, 0)';
        });
    });
}

// Validación de formulario y submit
function setupFormHandling() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Animación de envío
            const button = form.querySelector('button');
            const originalText = button.textContent;
            button.textContent = '✓ Mensaje enviado';
            button.style.background = 'linear-gradient(135deg, #5FE3A0, #35B87A)';
            
            // Limpiar formulario
            form.reset();
            
            // Restaurar botón después de 3 segundos
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 3000);
        });
    }
}

// ============================================
// LOGIN & ADMIN LOGIC
// ============================================
// El portafolio ahora es visible de inmediato para cualquier visitante
// (modo invitado por defecto). El modo administrador se activa desde
// un enlace discreto en el footer, sin bloquear la primera visita.

function setupLogin() {
    const loginOverlay = document.getElementById('login-overlay');
    const openAdminLoginBtn = document.getElementById('open-admin-login');
    const adminLoginClose = document.getElementById('admin-login-close');
    const modeSwitchBtn = document.getElementById('mode-switch-btn');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const adminLoginContent = document.querySelector('.admin-login-content');

    function enterAdminMode() {
        document.body.classList.add('admin-mode');
        document.querySelectorAll('.admin-controls').forEach(el => el.style.display = 'block');
        loadProjects();
        loadSkills(); // Asegurarse de que las skills se rendericen con los botones de admin
        updateModeSwitchButton();
    }

    function enterGuestMode() {
        document.body.classList.remove('admin-mode');
        document.querySelectorAll('.admin-controls').forEach(el => el.style.display = 'none');
        // Forzar la recarga de proyectos para ocultar los botones de admin
        loadProjects();
        loadSkills(); // Asegurarse de que las skills se rendericen sin los botones de admin
        updateModeSwitchButton();
    }

    function updateModeSwitchButton() {
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        modeSwitchBtn.textContent = isAdmin ? 'Salir al modo Invitado' : 'Modo Administrador';
    }

    function openLoginModal() {
        loginOverlay.style.display = 'flex';
        passwordInput.focus();
    }

    function closeLoginModal() {
        loginOverlay.style.display = 'none';
        passwordForm.reset();
        passwordInput.placeholder = 'Contraseña';
    }

    // Estado inicial: invitado por defecto, admin solo si ya se autenticó en esta sesión
    if (sessionStorage.getItem('isAdmin') === 'true' && hasToken()) {
        enterAdminMode();
    } else {
        sessionStorage.setItem('isAdmin', 'false');
        enterGuestMode();
    }

    openAdminLoginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
    });

    adminLoginClose?.addEventListener('click', (e) => {
        e.preventDefault();
        closeLoginModal();
    });

    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await login(passwordInput.value);
            sessionStorage.setItem('isAdmin', 'true');
            closeLoginModal();
            enterAdminMode();
        } catch (error) {
            // Animación de error (se conserva del diseño original)
            adminLoginContent.classList.add('shake');
            passwordInput.value = '';
            passwordInput.placeholder = 'Contraseña incorrecta, intenta de nuevo';

            setTimeout(() => {
                adminLoginContent.classList.remove('shake');
            }, 600);
        }
    });

    modeSwitchBtn?.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres salir del modo administrador?')) {
            sessionStorage.setItem('isAdmin', 'false');
            clearToken();
            enterGuestMode();
        }
    });
}

// ============================================
// SKILLS CRUD LOGIC
// ============================================

let skillsData = [];
async function loadSkills() {
    try {
        const data = await fetchSkills();
        skillsData = data.categories || [];
    } catch (error) {
        console.error("Error cargando skills desde el backend:", error);
    }
    renderSkills();
    renderProficiencyBars();
}

function updateLanguagesCounter() {
    const languagesCounter = document.querySelector('.stat-item:nth-child(2) .stat-number');
    if (languagesCounter) {
        let languageCount = 0;
        skillsData.forEach(category => {
            category.skills.forEach(skill => {
                if (skill.isLanguage) {
                    languageCount++;
                }
            });
        });
        languagesCounter.textContent = languageCount;
    }
}

function renderSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    skillsData.forEach(category => {
        const categoryEl = document.createElement('div');
        categoryEl.className = 'skill-category';
        categoryEl.dataset.id = category.id;

        let adminButtons = '';
        if (isAdmin) {
            adminButtons = `
                <div class="skill-category-admin-buttons">
                    <button class="edit-skill-category">Editar</button>
                    <button class="delete-skill-category">Eliminar</button>
                    <button class="add-skill-item">Añadir Skill</button>
                </div>
            `;
        }

        categoryEl.innerHTML = `
            ${adminButtons}
            <h3>${category.name}</h3>
            <div class="skill-items">
                ${category.skills.map(skill => `
                    <div class="skill-item" data-id="${skill.id}" data-category-id="${category.id}">
                        ${isAdmin ? `
                        <div class="skill-item-admin-buttons">
                            <button class="edit-skill-item">E</button>
                            <button class="delete-skill-item">X</button>
                        </div>` : ''}
                        <img src="${skill.imageUrl}" alt="${skill.name}">
                        <span>${skill.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        grid.appendChild(categoryEl);
    });

    setupSkillCrudListeners();
    updateLanguagesCounter();
    enhanceSkillItems(); // Re-apply hover effects
}

function renderProficiencyBars() {
    const container = document.querySelector('.proficiency-bars');
    if (!container) return;
    container.innerHTML = '';

    const allSkills = skillsData.flatMap(category => category.skills);

    allSkills.forEach(skill => {
        const proficiency = skill.proficiency || 0;
        const item = document.createElement('div');
        item.className = 'proficiency-item';
        item.innerHTML = `
            <div class="proficiency-header">
                <span>${skill.name}</span>
                <span class="percentage">${proficiency}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${proficiency}%"></div>
            </div>
        `;
        container.appendChild(item);
    });

    // Re-aplicar la animación de las barras
    const bars = document.querySelectorAll('.progress-fill');
    const barsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInLeft 1s ease-out forwards';
                barsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    bars.forEach(bar => barsObserver.observe(bar));
}

function setupSkillCrudListeners() {
    // Category CRUD
    document.getElementById('add-skill-category-btn')?.addEventListener('click', () => openSkillCategoryModal());
    document.querySelectorAll('.edit-skill-category').forEach(btn => btn.addEventListener('click', e => {
        const categoryId = e.target.closest('.skill-category').dataset.id;
        const category = skillsData.find(c => c.id === categoryId);
        openSkillCategoryModal(category);
    }));
    document.querySelectorAll('.delete-skill-category').forEach(btn => btn.addEventListener('click', async e => {
        if (confirm('¿Seguro que quieres eliminar esta categoría y todas sus skills?')) {
            const categoryId = e.target.closest('.skill-category').dataset.id;
            try {
                await deleteSkillCategory(categoryId);
                loadSkills();
            } catch (error) {
                console.error("Error eliminando categoría:", error);
                alert("Hubo un error al eliminar la categoría.");
            }
        }
    }));

    // Skill Item CRUD
    document.querySelectorAll('.add-skill-item').forEach(btn => btn.addEventListener('click', e => {
        const categoryId = e.target.closest('.skill-category').dataset.id;
        openSkillItemModal(categoryId);
    }));
    document.querySelectorAll('.edit-skill-item').forEach(btn => btn.addEventListener('click', e => {
        const skillEl = e.target.closest('.skill-item');
        const skillId = skillEl.dataset.id;
        const categoryId = skillEl.dataset.categoryId;
        const category = skillsData.find(c => c.id === categoryId);
        const skill = category.skills.find(s => s.id === skillId);
        openSkillItemModal(categoryId, skill);
    }));
    document.querySelectorAll('.delete-skill-item').forEach(btn => btn.addEventListener('click', async e => {
        if (confirm('¿Seguro que quieres eliminar esta skill?')) {
            const skillEl = e.target.closest('.skill-item');
            const skillId = skillEl.dataset.id;
            const categoryId = skillEl.dataset.categoryId;
            try {
                await deleteSkillItem(categoryId, skillId);
                loadSkills();
            } catch (error) {
                console.error("Error eliminando skill:", error);
                alert("Hubo un error al eliminar la skill.");
            }
        }
    }));
}

function openSkillCategoryModal(category = null) {
    const modal = document.getElementById('skill-category-modal');
    const form = document.getElementById('skill-category-form');
    const title = document.getElementById('skill-category-modal-title');
    if (category) {
        title.textContent = 'Editar Categoría';
        form['skill-category-id'].value = category.id;
        form['skill-category-name'].value = category.name;
    } else {
        title.textContent = 'Añadir Categoría';
        form.reset();
    }
    modal.style.display = 'flex';
}

function openSkillItemModal(categoryId, skill = null) {
    const modal = document.getElementById('skill-item-modal');
    const form = document.getElementById('skill-item-form');
    const title = document.getElementById('skill-item-modal-title');
    form['skill-item-category-id'].value = categoryId;
    if (skill) {
        title.textContent = 'Editar Skill';
        form['skill-item-id'].value = skill.id;
        form['skill-item-name'].value = skill.name;
        form['skill-item-image-url'].value = skill.imageUrl;
        form['skill-item-is-language'].checked = skill.isLanguage || false;
        form['skill-item-proficiency'].value = skill.proficiency || 0;
    } else {
        title.textContent = 'Añadir Skill';
        form.reset();
        form['skill-item-is-language'].checked = false;
        form['skill-item-proficiency'].value = 0;
        form['skill-item-category-id'].value = categoryId;
    }
    // Actualizar el valor del span de proficiency
    const proficiencyValueSpan = document.getElementById('proficiency-value');
    proficiencyValueSpan.textContent = `${form['skill-item-proficiency'].value}%`;
    form['skill-item-proficiency'].oninput = () => {
        proficiencyValueSpan.textContent = `${form['skill-item-proficiency'].value}%`;
    };

    modal.style.display = 'flex';
}

function setupSkillModals() {
    // Category Modal
    const categoryModal = document.getElementById('skill-category-modal');
    categoryModal.querySelector('.detail-close').addEventListener('click', (e) => { e.preventDefault(); categoryModal.style.display = 'none'; });
    document.getElementById('skill-category-form').addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target;
        const categoryId = form['skill-category-id'].value;
        const categoryName = form['skill-category-name'].value;
        try {
            if (categoryId) {
                await updateSkillCategory(categoryId, categoryName);
            } else {
                await createSkillCategory(categoryName);
            }
            loadSkills();
        } catch (error) {
            console.error("Error guardando categoría:", error);
            alert("Hubo un error al guardar la categoría.");
        }
        categoryModal.style.display = 'none';
    });

    // Skill Item Modal
    const itemModal = document.getElementById('skill-item-modal');
    itemModal.querySelector('.detail-close').addEventListener('click', (e) => { e.preventDefault(); itemModal.style.display = 'none'; });
    document.getElementById('skill-item-form').addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target;
        const categoryId = form['skill-item-category-id'].value;
        const skillId = form['skill-item-id'].value;
        const skillData = {
            name: form['skill-item-name'].value,
            imageUrl: form['skill-item-image-url'].value,
            isLanguage: form['skill-item-is-language'].checked,
            proficiency: parseInt(form['skill-item-proficiency'].value, 10)
        };
        try {
            if (skillId) { // Editar
                await updateSkillItem(categoryId, skillId, skillData);
            } else { // Añadir
                await createSkillItem(categoryId, skillData);
            }
            loadSkills();
        } catch (error) {
            console.error("Error guardando skill:", error);
            alert("Hubo un error al guardar la skill.");
        }
        itemModal.style.display = 'none';
    });
}

// ============================================
// PROJECT CRUD LOGIC
// ============================================

let projectsData = [];

async function loadProjects() {
    try {
        const data = await fetchProjects();
        projectsData = data.projects || [];
        renderProjects();
        updateProjectsCounter();
    } catch (error) {
        console.error("No se pudieron cargar los proyectos desde el backend:", error);
    }
}

function updateProjectsCounter() {
    const projectsCounter = document.getElementById('projects-counter');
    if (projectsCounter) {
        const currentCount = projectsData.length;
        projectsCounter.setAttribute('data-target', currentCount);
        
        // Reiniciar y ejecutar la animación para este contador específico
        let current = 0;
        const target = currentCount;
        const increment = target / 50 > 1 ? target / 50 : 1; // Asegura que el incremento sea al menos 1

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) {
                    current = target;
                }
                projectsCounter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                projectsCounter.textContent = target;
            }
        };
        
        updateCounter();
    }
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = ''; // Limpiar la grilla
    projectsData.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.id = project.id;
        card.innerHTML = `
            <div class="project-admin-buttons" style="display: ${sessionStorage.getItem('isAdmin') === 'true' ? 'flex' : 'none'};">
                <button class="edit-project">Editar</button>
                <button class="delete-project">Eliminar</button>
            </div>
            <div class="project-image">
                <img src="${project.imageUrl}" alt="${project.title}">
                <div class="project-overlay">
                    <a href="#detalle-${project.id}" class="project-link">Ver Proyecto</a>
                </div>
            </div>
            <div class="project-content">
                <span class="project-tag">${project.tag}</span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.tech.split(',').map(t => `<span class="tech-badge">${t.trim()}</span>`).join('')}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Renderizar también los modales de detalle
    renderProjectDetails();

    // Re-attach event listeners for new elements
    setupProjectCrudListeners();
}

function renderProjectDetails() {
    // Eliminar modales de detalle existentes para no duplicarlos, excepto el modal de edición
    document.querySelectorAll('.project-detail[id^="detalle-"]:not(#project-modal)').forEach(modal => modal.remove());

    const main = document.querySelector('main');
    projectsData.forEach(project => {
        // Evitar crear un modal para un proyecto sin ID (puede ocurrir en un estado intermedio)
        if (!project.id) return;

        const detailModal = document.createElement('div');
        detailModal.id = `detalle-${project.id}`;
        detailModal.className = 'project-detail';
        detailModal.innerHTML = `
            <div class="detail-content">
                <a href="#projects" class="detail-close">&times;</a>
                <div class="detail-grid">
                    <div class="detail-image">
                        <img src="${project.imageUrl}" alt="${project.title}">
                    </div>
                    <div class="detail-text">
                        <h2>${project.title}</h2>
                        <p class="detail-description">${project.detailDescription}</p>
                        
                        <h4>Tecnologías Utilizadas</h4>
                        <div class="detail-tech">
                             ${project.tech.split(',').map(t => `<span>${t.trim()}</span>`).join('')}
                        </div>
                        
                        <a href="${project.detailLink}" target="_blank" class="detail-link">
                            <span>→ Ver Repositorio en GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        main.appendChild(detailModal);
    });

    // Re-configurar los listeners para los nuevos modales
    setupClickOutsideModalClosing();
    setupProjectModalClosing(); // Asegurar que ESC también funcione en los nuevos modales
}

function setupProjectCrudListeners() {
    document.getElementById('add-project-btn')?.addEventListener('click', () => openProjectModal());

    document.querySelectorAll('.edit-project').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            const projectId = card.dataset.id;
            const project = projectsData.find(p => p.id === projectId);
            openProjectModal(project);
        });
    });

    document.querySelectorAll('.delete-project').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
                const card = e.target.closest('.project-card');
                const projectId = card.dataset.id;
                try {
                    await deleteProject(projectId);
                    await loadProjects(); // Recargar para reflejar la eliminación
                } catch (error) {
                    console.error("Error al eliminar el proyecto:", error);
                    alert("Hubo un error al eliminar el proyecto.");
                }
            }
        });
    });
}

function openProjectModal(project = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const title = document.getElementById('modal-title');
    const navbar = document.querySelector('.navbar');

    if (project) {
        title.textContent = 'Editar Proyecto';
        form['project-id'].value = project.id;
        form['project-title'].value = project.title;
        form['project-tag'].value = project.tag;
        form['project-description'].value = project.description;
        form['project-image-url'].value = project.imageUrl;
        form['project-tech'].value = project.tech;
        form['project-detail-link'].value = project.detailLink;
        form['project-detail-description'].value = project.detailDescription;
    } else {
        title.textContent = 'Añadir Proyecto';
        form.reset();
        form['project-id'].value = '';
    }
    modal.style.display = 'flex';
    navbar.style.display = 'none';
}

function setupProjectModal() {
    const modal = document.getElementById('project-modal');
    const navbar = document.querySelector('.navbar');

    document.getElementById('modal-close').addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'none';
        navbar.style.display = 'flex';
    });

    document.getElementById('project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const projectId = form['project-id'].value;
        const projectData = { // No incluimos el ID aquí, el backend lo maneja
            title: form['project-title'].value,
            tag: form['project-tag'].value,
            description: form['project-description'].value,
            imageUrl: form['project-image-url'].value,
            tech: form['project-tech'].value,
            detailLink: form['project-detail-link'].value,
            detailDescription: form['project-detail-description'].value,
        };

        try {
            if (projectId) { // Editando
                await updateProject(projectId, projectData);
            } else { // Añadiendo
                await createProject(projectData);
            }
            await loadProjects(); // Recargar los proyectos para ver los cambios
        } catch (error) {
            console.error("Error al guardar el proyecto:", error);
            alert("Hubo un error al guardar el proyecto.");
        }
        modal.style.display = 'none';
        navbar.style.display = 'flex';
    });
}

// Calcula los meses de formación transcurridos, sumando un mes nuevo
// justo el día 26 de cada mes (no el día 1).
function updateTrainingMonths() {
    // Ajusta este día si tu fecha real de inicio fue otra.
    const startDate = new Date(2026, 0, 26); // 26 de enero de 2026
    const currentDate = new Date();

    let totalMonths =
        (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
        (currentDate.getMonth() - startDate.getMonth());

    // Si todavía no llega el día 26 del mes actual, ese mes no cuenta como completo.
    if (currentDate.getDate() < startDate.getDate()) {
        totalMonths -= 1;
    }

    totalMonths = Math.max(totalMonths, 0);

    const monthsCounter = document.getElementById('training-months-counter');
    if (monthsCounter) {
        monthsCounter.setAttribute('data-target', totalMonths);
    }
}

function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = navbarMenu.querySelectorAll('.nav-link');

    hamburgerBtn.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });

    // Cierra el menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => navbarMenu.classList.remove('active'));
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupLogin();
    setupHeroAnimation();
    setupSmoothScroll();
    highlightActiveNavLink();
    updateTrainingMonths();
    animateCounters();
    observeElements();
    enhanceSkillItems();
    enhanceProjectCards();
    setupProjectModalClosing();
    setupClickOutsideModalClosing();
    animateProgressBars();
    setupFormHandling();
    setupProjectModal();
    setupProjectCrudListeners();
    setupHamburgerMenu();
    setupSkillModals();
});

// Evento de scroll
window.addEventListener('scroll', () => {
    updateScrollProgress();
    setupParallaxEffect();
});

// Animación al cargar página
window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.8s ease-out';
});

// Asegurar que el navbar se oculte al ver detalles del proyecto
window.addEventListener('hashchange', () => {
    const navbar = document.querySelector('.navbar');
    const isProjectDetailOpen = window.location.hash.startsWith('#detalle-');
    navbar.style.display = isProjectDetailOpen ? 'none' : 'flex';
});