// 1. Efeito de Digitação Automatizada
const textElement = document.getElementById("typing-effect");
let nameText = "Laís Moura";
let index = 0;

function typeEffect() {
    if (textElement && index < nameText.length) {
        textElement.textContent += nameText.charAt(index);
        index++;
        setTimeout(typeEffect, 120);
    }
}

// 2. Mecanismo de Alternação de Idioma (Movido para cima para garantir inicialização)
let currentLang = localStorage.getItem("lang") || "pt";

function aplicarIdioma(lang) {
    const elements = document.querySelectorAll("[data-pt]");
    
    elements.forEach(el => {
        if (lang === "en") {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = el.getAttribute("data-en");
            } else {
                el.innerHTML = el.getAttribute("data-en");
            }
        } else {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = el.getAttribute("data-pt");
            } else {
                el.innerHTML = el.getAttribute("data-pt");
            }
        }
    });

    // Atualiza o texto de TODOS os botões de idioma que encontrar na página
    const langToggleBtn = document.getElementById("lang-toggle");
    if (langToggleBtn) {
        langToggleBtn.textContent = lang === "pt" ? "EN" : "PT";
    }
    
    // Atualiza a saudação dinamicamente
    aplicarSaudacao(lang);
}

// 3. Saudação Dinâmica por Horário
function aplicarSaudacao(lang = "pt") {
    const saudacaoElement = document.getElementById("saudacao");
    if (saudacaoElement) {
        const hora = new Date().getHours();
        let textoSaudacao = "";

        if (lang === "pt") {
            if (hora >= 5 && hora < 12) textoSaudacao = "Bom dia!";
            else if (hora >= 12 && hora < 18) textoSaudacao = "Boa tarde!";
            else textoSaudacao = "Boa noite!";
        } else {
            if (hora >= 5 && hora < 12) textoSaudacao = "Good morning!";
            else if (hora >= 12 && hora < 18) textoSaudacao = "Good afternoon!";
            else textoSaudacao = "Good evening!";
        }
        
        saudacaoElement.textContent = textoSaudacao;
    }
}

// 4. Mecanismo do Alternador de Tema
function inicializarTema() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const bodyElement = document.body;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        bodyElement.classList.add("light-theme");
        if (themeToggleBtn) themeToggleBtn.textContent = "🌙";
    }

    if (themeToggleBtn) {
        themeToggleBtn.onclick = () => {
            bodyElement.classList.toggle("light-theme");
            if (bodyElement.classList.contains("light-theme")) {
                themeToggleBtn.textContent = "🌙";
                localStorage.setItem("theme", "light");
            } else {
                themeToggleBtn.textContent = "☀️";
                localStorage.setItem("theme", "dark");
            }
        };
    }
}

// 5. Validação e Envio do Formulário de Contato
function inicializarFormulario() {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("form-feedback");

    if (form) {
        form.onsubmit = async function(event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                feedback.textContent = currentLang === "pt" ? "Por favor, preencha todos os campos corretamente." : "Please fill in all fields correctly.";
                feedback.style.color = "#f74040";
                return;
            }

            feedback.textContent = currentLang === "pt" ? "Enviando sua mensagem..." : "Sending your message...";
            feedback.style.color = "var(--text-color)"; 

            const data = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    feedback.textContent = currentLang === "pt" ? `Obrigado, ${name}! Sua mensagem foi enviada com sucesso.` : `Thank you, ${name}! Your message has been sent successfully.`;
                    feedback.style.color = "#04d361";
                    form.reset(); 
                } else {
                    feedback.textContent = currentLang === "pt" ? "Ops! Ocorreu um erro no servidor ao tentar enviar." : "Oops! A server error occurred while trying to send.";
                    feedback.style.color = "#f74040";
                }
            } catch (error) {
                feedback.textContent = currentLang === "pt" ? "Erro de conexão. Verifique sua internet." : "Connection error. Please check your internet.";
                feedback.style.color = "#f74040";
            }
        };
    }
}

// 6. Inicialização Geral (Garante que todo o HTML foi lido antes de ativar os botões)
document.addEventListener("DOMContentLoaded", () => {
    // Aplica o idioma salvo ou o padrão (PT)
    aplicarIdioma(currentLang);
    
    // Ativa o clique do botão de idioma
    const langToggleBtn = document.getElementById("lang-toggle");
    if (langToggleBtn) {
        langToggleBtn.onclick = () => {
            currentLang = currentLang === "pt" ? "en" : "pt";
            localStorage.setItem("lang", currentLang);
            aplicarIdioma(currentLang);
            console.log("Idioma alterado para:", currentLang); // Para você testar no inspecionar página
        };
    }

    // Inicializa as outras funções
    inicializarTema();
    inicializarFormulario();
    typeEffect();
});