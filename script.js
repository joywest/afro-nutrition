/**
 * Logique de la Landing Page - Nutrition Sportive Africaine
 * Version Finale : Paiement Direct WhatsApp + Slider + Animations 3D
 */
// 1. Empêche le navigateur de mémoriser la position du défilement
// On force le mode manuel pour le défilement
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// On remonte tout en haut immédiatement
window.scrollTo(0, 0);

// On nettoie l'URL pour supprimer l'ancre (#prix) AVANT que la page ne se recharge complètement
if (window.location.hash) {
    window.history.replaceState('', document.title, window.location.pathname);
}

// Sécurité supplémentaire : au chargement complet, on confirme la position 0
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
// --- 1. GESTION DU PAIEMENT (Mobile Money & International) ---
let selectedMethod = "";

function togglePaymentInfo(method) {
    const detailsBox = document.getElementById('payment-details');
    const title = document.getElementById('method-title');
    const phone = document.getElementById('phone-number');
    const name = document.getElementById('account-name');
    const finalStepText = document.querySelector('.final-step');

    selectedMethod = method.toUpperCase();
    detailsBox.style.display = 'block';

    // Configuration de vos informations réelles
    if (method === 'mtn') {
        title.innerHTML = "<strong>Instructions MTN Mobile Money :</strong>";
        phone.innerText = "06 574 93 58";
        name.innerText = "Balleya Joy Ephraim";
        if(finalStepText) finalStepText.innerText = "Une fois le transfert effectué, cliquez sur le bouton ci-dessous pour m'envoyer la preuve et recevoir le livre.";
    } 
    else if (method === 'airtel') {
        title.innerHTML = "<strong>Instructions Airtel Money :</strong>";
        phone.innerText = "05 669 19 19"; 
        name.innerText = "Balleya Joy Ephraim";
        if(finalStepText) finalStepText.innerText = "Une fois le transfert effectué, cliquez sur le bouton ci-dessous pour m'envoyer la preuve et recevoir le livre.";
    }
    else if (method === 'inter') {
        title.innerHTML = "<strong>Paiement International (Hors Congo) :</strong>";
        phone.innerText = "‪+242 06 574 93 58‬";
        name.innerText = "Balleya Joy Ephraim";
        if(finalStepText) finalStepText.innerText = "Utilisez Sendwave, WorldRemit ou TapTap Send vers mon numéro MTN Congo, puis envoyez la capture d'écran.";
    }
    
    // Scroll fluide vers les détails
    detailsBox.scrollIntoView({ behavior: 'smooth' });
}

function sendWhatsAppConfirmation() {
    // Format international strict pour le Congo : 242 + numéro sans le +
    const monNumero = "242065749358"; 
    
    // On s'assure d'avoir une méthode de paiement définie
    const methodeAffichee = selectedMethod || "Mobile Money";

    // Message personnalisé
    const message = `Bonjour Ephraim, je viens de payer 3 500 F par ${methodeAffichee} pour l'ebook. Voici ma capture d'écran pour recevoir mon livre.`;
    
    // Lien wa.me universel (évite l'erreur 404)
    const url = "https://wa.me/" + monNumero + "?text=" + encodeURIComponent(message);
    
    window.open(url, '_blank');
}

// Compatibilité avec vos anciens boutons HTML
const processRealPayment = (method) => {
    if (method.toLowerCase().includes('mtn')) togglePaymentInfo('mtn');
    else if (method.toLowerCase().includes('airtel')) togglePaymentInfo('airtel');
    else togglePaymentInfo('inter');
};


// --- 2. GESTION DU SLIDER (FEUILLETAGE DU LIVRE) ---
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    if (slides.length === 0) return;
    
    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    if(slides[currentSlideIndex]) slides[currentSlideIndex].classList.add('active');
    if(dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
}

document.querySelector('.next-btn')?.addEventListener('click', () => showSlide(currentSlideIndex + 1));
document.querySelector('.prev-btn')?.addEventListener('click', () => showSlide(currentSlideIndex - 1));

function currentSlide(index) {
    showSlide(index);
}

let autoSlideInterval = setInterval(() => showSlide(currentSlideIndex + 1), 5000);

const sliderArea = document.querySelector('.slider-container');
sliderArea?.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
sliderArea?.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => showSlide(currentSlideIndex + 1), 5000);
});


// --- 3. ANIMATION AU DÉFILEMENT (REVEAL EFFECT) ---
const observerOptions = { threshold: 0.1 };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .pricing-card, .section-title, .hero-text').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    revealObserver.observe(el);
});


// --- 4. EFFET 3D SUR LA COUVERTURE ---
const bookCover = document.querySelector('.book-3d');
if (bookCover) {
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 30;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 30;
        bookCover.style.transform = `rotateY(${xAxis - 20}deg) rotateX(${yAxis}deg)`;
    });

    document.querySelector('.hero').addEventListener('mouseleave', () => {
        bookCover.style.transform = `rotateY(-25deg) rotateX(5deg)`;
});
}// Compte à rebours fictif (se réinitialise à chaque visite ou tourne en boucle)
function startCountdown() {
    let time = 14 * 3600 + 22 * 60 + 5;
    setInterval(() => {
        time--;
        if (time <= 0) time = 14 * 3600 + 22 * 60 + 5; // Relance le cycle
        
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        let clock = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        document.getElementById("countdown").innerHTML = clock;
        document.getElementById("countdown2").innerHTML = clock;
    }, 1000);
}
startCountdown();