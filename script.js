/**
 * WRC DIGITAL - MAIN SCRIPT
 * Configurações, Interatividade, Validação de Formulário e Integração WhatsApp
 */

// ==========================================
// CONFIGURAÇÕES
// ==========================================
// IMPORTANTE: Altere o número abaixo para o WhatsApp oficial da WRC Digital (com DDD e DDI)
const WHATSAPP_WRC = "5527999999999"; 

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMobileMenu();
    initFormValidation();
    initScrollAnimations();
    initBackToTop();
    initPhoneMask();
});

// ==========================================
// 1. HEADER & SMOOTH SCROLL
// ==========================================
function initHeader() {
    const header = document.getElementById("header");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

// ==========================================
// 2. MOBILE MENU HAMBURGER
// ==========================================
function initMobileMenu() {
    const hamburger = document.getElementById("hamburger-menu");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    // Fechar menu ao clicar num link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });
}

// ==========================================
// 3. MÁSCARA PARA WHATSAPP
// ==========================================
function initPhoneMask() {
    const phoneInput = document.getElementById("whatsapp");

    phoneInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }

        e.target.value = value;
    });
}

// ==========================================
// 4. VALIDAÇÃO DE FORMULÁRIO E ENVIO WHATSAPP
// ==========================================
function initFormValidation() {
    const form = document.getElementById("whatsappForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Limpar erros prévios
        const groups = form.querySelectorAll(".form-group");
        groups.forEach(g => g.classList.remove("error"));

        let isValid = true;

        // Elementos
        const nomeInput = document.getElementById("nome");
        const empresaInput = document.getElementById("empresa");
        const whatsappInput = document.getElementById("whatsapp");
        const emailInput = document.getElementById("email");
        const servicoSelect = document.getElementById("servico");
        const descricaoTextarea = document.getElementById("descricao");

        // Validação Nome
        if (!nomeInput.value.trim()) {
            showError(nomeInput);
            isValid = false;
        }

        // Validação WhatsApp (mínimo 10 dígitos numéricos)
        const rawPhone = whatsappInput.value.replace(/\D/g, "");
        if (!rawPhone || rawPhone.length < 10) {
            showError(whatsappInput);
            isValid = false;
        }

        // Validação E-mail (se preenchido, deve ser válido)
        if (emailInput.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput);
                isValid = false;
            }
        }

        // Validação Serviço
        if (!servicoSelect.value) {
            showError(servicoSelect);
            isValid = false;
        }

        // Validação Descrição
        if (!descricaoTextarea.value.trim()) {
            showError(descricaoTextarea);
            isValid = false;
        }

        // Se válido, constrói e envia mensagem pelo WhatsApp
        if (isValid) {
            const nome = nomeInput.value.trim();
            const empresa = empresaInput.value.trim() || "Não informada";
            const whatsapp = whatsappInput.value.trim();
            const email = emailInput.value.trim() || "Não informado";
            const servico = servicoSelect.value;
            const descricao = descricaoTextarea.value.trim();

            const mensagem = `🚀 *NOVO CONTATO — WRC DIGITAL*

👤 *Nome:* ${nome}
🏢 *Empresa:* ${empresa}
📱 *WhatsApp:* ${whatsapp}
📧 *E-mail:* ${email}
💻 *Serviço de interesse:* ${servico}
📝 *Projeto:* ${descricao}

_Enviado pelo site da WRC Digital._`;

            const link = `https://wa.me/${WHATSAPP_WRC}?text=${encodeURIComponent(mensagem)}`;
            window.open(link, "_blank");
        }
    });
}

function showError(inputElement) {
    const parent = inputElement.closest(".form-group");
    if (parent) {
        parent.classList.add("error");
    }
}

// ==========================================
// 5. ANIMAÇÕES AO SCROLL (IntersectionObserver)
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos para animar
    const animatedElements = document.querySelectorAll(
        ".service-card, .benefit-card, .step-card, .project-card, .value-item"
    );

    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });
}

// ==========================================
// 6. BOTÃO VOLTAR AO TOPO
// ==========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}