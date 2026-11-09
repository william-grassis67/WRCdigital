/**
 * WRC DIGITAL - script principal
 * Header, menu mobile, animação do hero, linha do processo,
 * máscara de telefone, validação e envio do formulário via WhatsApp.
 */
const WHATSAPP_WRC = "5527997230221";
const $ = (s, r = document) => r.querySelector(s);

document.addEventListener("DOMContentLoaded", () => {
  initHeroTitle();
  initHeader();
  initMobileMenu();
  initProcessLine();
  initPhoneMask();
  initForm();
  initBackToTop();
});

// Hero: separa o título em palavras para a entrada escalonada (única animação de abertura)
function initHeroTitle() {
  const h1 = $("#heroTitle");
  if (!h1) return;
  const text = h1.textContent.trim();
  h1.setAttribute("aria-label", text);
  h1.textContent = "";
  text.split(" ").forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "w";
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--i", i);
    span.textContent = word;
    h1.append(span, " ");
  });
}

// Header translúcido ao rolar e link ativo na navegação
function initHeader() {
  const header = $("#header");
  const links = [...document.querySelectorAll(".nav ul a")];
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) io.observe(s); });
}

// Menu mobile acessível
function initMobileMenu() {
  const burger = $("#burger");
  const nav = $("#nav");
  const set = (open) => {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => set(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", () => set(false));
}

// Linha dourada do processo acompanha a rolagem
function initProcessLine() {
  const steps = $("#steps");
  if (!steps) return;
  const update = () => {
    const r = steps.getBoundingClientRect();
    const p = (window.innerHeight * 0.6 - r.top) / r.height;
    steps.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

// Máscara (99) 99999-9999
function initPhoneMask() {
  const input = $("#whatsapp");
  input.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    e.target.value = v;
  });
}

// Validação e envio para o WhatsApp
function initForm() {
  const form = $("#whatsappForm");
  const setError = (el, bad) => {
    el.closest(".field").classList.toggle("error", bad);
    el.setAttribute("aria-invalid", String(bad));
    return bad;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = (id) => document.getElementById(id);
    const nome = f("nome"), empresa = f("empresa"), fone = f("whatsapp"),
          email = f("email"), servico = f("servico"), msg = f("mensagem");

    const emailOk = !email.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const errors = [
      setError(nome, !nome.value.trim()),
      setError(fone, fone.value.replace(/\D/g, "").length < 10),
      setError(email, !emailOk),
      setError(servico, !servico.value),
      setError(msg, !msg.value.trim()),
    ];
    if (errors.some(Boolean)) {
      const first = form.querySelector(".error input, .error select, .error textarea");
      if (first) first.focus();
      return;
    }

    const texto = [
      "*NOVO CONTATO — WRC DIGITAL*", "",
      `*Nome:* ${nome.value.trim()}`,
      `*Empresa:* ${empresa.value.trim() || "Não informada"}`,
      `*WhatsApp:* ${fone.value.trim()}`,
      `*E-mail:* ${email.value.trim() || "Não informado"}`,
      `*Interesse:* ${servico.value}`,
      `*Mensagem:* ${msg.value.trim()}`, "",
      "_Enviado pelo site da WRC Digital._",
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP_WRC}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });
}

// Botão voltar ao topo
function initBackToTop() {
  const btn = $("#top");
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 600), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
