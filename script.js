import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Contador de Estadísticas
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
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
    const bars = document.querySelectorAll('.progress-fill');
    
    const barsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                barsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    bars.forEach(bar => barsObserver.observe(bar));
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
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        heroTitle.style.animation = 'slideInLeft 0.8s ease-out';
    }
    if (heroDescription) {
        heroDescription.style.animation = 'slideInLeft 0.8s ease-out 0.2s both';
    }
    if (heroButtons) {
        heroButtons.style.animation = 'slideInLeft 0.8s ease-out 0.4s both';
    }
}

// Observar elementos para animación
function observeElements() {
    const elementsToObserve = document.querySelectorAll(
        '.about-card, .project-card, .skill-category, .info-card'
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
            this.style.boxShadow = '0 25px 50px rgba(99, 102, 241, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 0 rgba(99, 102, 241, 0)';
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
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
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
// LOGIN BACKGROUND ANIMATION
// ============================================
function createLoginParticles() {
    const overlay = document.getElementById('login-overlay');
    const particleCount = 100; // Aumentamos el número de partículas
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 4 + 1}px`; // Hacemos las partículas un poco más grandes
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        const isPrimary = Math.random() > 0.5;
        particle.style.background = isPrimary ? 'var(--primary)' : 'var(--secondary)';
        particle.style.opacity = Math.random() * 0.6 + 0.3; // Aumentamos la opacidad
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        
        particle.animate([
            { transform: `translate(0, 0)` },
            { transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px)` },
            { transform: `translate(0, 0)` }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        overlay.prepend(particle);
    }
}

// ============================================
// LOGIN & ADMIN LOGIC
// ============================================

function setupLogin() {
    const loginOverlay = document.getElementById('login-overlay');
    const mainContent = document.querySelector('main');
    const adminBtn = document.getElementById('admin-login-btn');
    const navbar = document.querySelector('.navbar');
    const guestBtn = document.getElementById('guest-login-btn');
    const modeSwitchBtn = document.getElementById('mode-switch-btn');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');

    createLoginParticles();

    // Check if already logged in as admin
    if (sessionStorage.getItem('isAdmin') === 'true') {
        enterAdminMode();
        return;
    } else if (sessionStorage.getItem('isAdmin') === 'false') {
        enterGuestMode();
        return;
    }

    guestBtn.addEventListener('click', () => {
        sessionStorage.setItem('isAdmin', 'false');
        enterGuestMode();
    });
 
    adminBtn.addEventListener('click', () => {
        passwordForm.classList.toggle('visible');
    });

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (passwordInput.value === '1101261349') {
            sessionStorage.setItem('isAdmin', 'true');
            enterAdminMode();
        } else {
            alert('Contraseña incorrecta.');
        }
    });

    modeSwitchBtn.addEventListener('click', () => {
        if (sessionStorage.getItem('isAdmin') === 'true') {
            if (confirm('¿Estás seguro de que quieres cambiar a modo invitado?')) {
                sessionStorage.setItem('isAdmin', 'false');
                enterGuestMode();
            }
        } else {
            // Vuelve a mostrar el login para re-autenticar
            loginOverlay.style.display = 'flex';
            mainContent.style.display = 'none';
            navbar.style.display = 'none';
        }
    });

    function enterAdminMode() {
        loginOverlay.style.display = 'none';
        mainContent.style.display = 'block';
        navbar.style.display = 'flex';
        document.body.classList.add('admin-mode');
        document.querySelectorAll('.admin-controls').forEach(el => el.style.display = 'block');
        loadProjects();
        loadSkills(); // Asegurarse de que las skills se rendericen con los botones de admin
        updateModeSwitchButton();
    }

    function enterGuestMode() {
        loginOverlay.style.display = 'none';
        mainContent.style.display = 'block';
        navbar.style.display = 'flex';
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
}

// ============================================
// SKILLS CRUD LOGIC
// ============================================

let skillsData = [];
async function loadSkills() {
    try {
        const querySnapshot = await getDocs(collection(db, "skillCategories"));
        skillsData = [];
        querySnapshot.forEach((doc) => {
            skillsData.push({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error("Error cargando skills desde Firestore:", error);
    }
    renderSkills();
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
    enhanceSkillItems(); // Re-apply hover effects
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
            await deleteDoc(doc(db, "skillCategories", categoryId));
            loadSkills();
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
            const category = skillsData.find(c => c.id === categoryId);
            if (category) {
                category.skills = category.skills.filter(s => s.id !== skillId);
                const categoryDocRef = doc(db, "skillCategories", categoryId);
                await updateDoc(categoryDocRef, {
                    skills: category.skills
                });
                loadSkills();
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
    } else {
        title.textContent = 'Añadir Skill';
        form.reset();
        form['skill-item-category-id'].value = categoryId;
    }
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
                const categoryDocRef = doc(db, "skillCategories", categoryId);
                await updateDoc(categoryDocRef, { name: categoryName });
            } else {
                await addDoc(collection(db, "skillCategories"), { name: categoryName, skills: [] });
            }
        } catch (error) {
            console.error("Error guardando categoría:", error);
        }
        loadSkills();
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
            id: skillId || `skill${Date.now()}`, // ID se mantiene para la lógica interna del array
            name: form['skill-item-name'].value,
            imageUrl: form['skill-item-image-url'].value
        };
        const category = skillsData.find(c => c.id === categoryId);
        if (category) {
            const newSkills = [...category.skills];
            if (skillId) { // Editar
                const index = newSkills.findIndex(s => s.id === skillId);
                if (index > -1) newSkills[index] = skillData;
            } else { // Añadir
                newSkills.push(skillData);
            }
            const categoryDocRef = doc(db, "skillCategories", categoryId);
            await updateDoc(categoryDocRef, { skills: newSkills });
            loadSkills();
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
        const querySnapshot = await getDocs(collection(db, "proyectos"));
        projectsData = [];
        querySnapshot.forEach((doc) => {
            projectsData.push({ id: doc.id, ...doc.data() });
        });
        renderProjects();
        updateProjectsCounter();
    } catch (error) {
        console.error("No se pudieron cargar los proyectos desde Firebase:", error);
    }
}

function updateProjectsCounter() {
    const projectsCounter = document.getElementById('projects-counter');
    if (projectsCounter) {
        const currentCount = projectsData.length;
        projectsCounter.setAttribute('data-target', currentCount);
        projectsCounter.textContent = currentCount; // Actualiza el número visible inmediatamente
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
                    await deleteDoc(doc(db, "proyectos", projectId));
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
        const projectData = { // No incluimos el ID aquí, Firestore lo maneja
            title: form['project-title'].value,
            tag: form['project-tag'].value,
            description: form['project-description'].value,
            imageUrl: form['project-image-url'].value,
            tech: form['project-tech'].value,
            detailLink: form['project-detail-link'].value,
            detailDescription: form['project-detail-description'].value,
        };

        try {
            let response;
            if (projectId) { // Editando
                const projectDocRef = doc(db, "proyectos", projectId);
                await updateDoc(projectDocRef, projectData);
            } else { // Añadiendo
                await addDoc(collection(db, "proyectos"), projectData);
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

function setupLoginPasswordForm() {
    const passwordForm = document.getElementById('password-form');
    if (passwordForm.classList.contains('hidden')) {
        passwordForm.classList.remove('hidden');
    }
}

function updateTrainingMonths() {
    const startDate = new Date('2024-01-01');
    const currentDate = new Date();
    const yearDiff = currentDate.getFullYear() - startDate.getFullYear();
    const monthDiff = currentDate.getMonth() - startDate.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff + 1;

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
    animateCounters();
    updateTrainingMonths();
    observeElements();
    enhanceSkillItems();
    enhanceProjectCards();
    setupProjectModalClosing();
    setupClickOutsideModalClosing();
    animateProgressBars();
    setupFormHandling();
    setupProjectModal();
    setupProjectCrudListeners();
    setupLoginPasswordForm();
    setupHamburgerMenu();
    loadProjects(); // Cargar proyectos al inicio
    loadSkills();
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

    if (isProjectDetailOpen) {
        navbar.style.display = 'none';
    } else if (document.getElementById('login-overlay').style.display !== 'flex') {
        navbar.style.display = 'flex';
    }
});
