class ImageCarousel {
    constructor() {
        this.carousel = document.getElementById('carousel');
        this.leftArrow = document.getElementById('leftArrow');
        this.rightArrow = document.getElementById('rightArrow');
        this.indicators = document.getElementById('indicators');
        this.items = this.carousel.querySelectorAll('.carousel-item');
        this.currentIndex = 0;
        this.itemsVisible = 3.2; // 3 completos + 0.2 parcial

        this.init();
    }

    init() {
        this.createIndicators();
        this.updateArrows();
        this.bindEvents();
    }

    createIndicators() {
        // <CHANGE> Limpa indicadores existentes para evitar duplicação
        this.indicators.innerHTML = '';
        
        // <CHANGE> Calcula corretamente: 15 itens - 3 visíveis = 12 posições máximas
        const totalSlides = Math.max(1, this.items.length - Math.floor(this.itemsVisible));

        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(indicator);
        }

        this.updateIndicators();
    }
    
    bindEvents() {
        this.leftArrow.addEventListener('click', () => this.slide('left'));
        this.rightArrow.addEventListener('click', () => this.slide('right'));
        this.carousel.addEventListener('scroll', () => this.updateArrows());

        // Suporte touch
        let startX = 0;
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.slide('right');
                } else {
                    this.slide('left');
                }
            }
        });
    }

    slide(direction) {
        const itemWidth = this.carousel.clientWidth / this.itemsVisible;
        const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;

        this.carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });

        if (direction === 'left' && this.currentIndex > 0) {
            this.currentIndex--;
        } else if (direction === 'right' && this.currentIndex < this.items.length - 3) {
            this.currentIndex++;
        }

        this.updateIndicators();
    }

    goToSlide(index) {
        this.currentIndex = index;
        const itemWidth = this.carousel.clientWidth / this.itemsVisible;

        this.carousel.scrollTo({
            left: index * itemWidth,
            behavior: 'smooth'
        });

        this.updateIndicators();
    }

    updateArrows() {
        const canScrollLeft = this.carousel.scrollLeft > 10;
        const canScrollRight =
            this.carousel.scrollWidth - this.carousel.clientWidth - this.carousel.scrollLeft > 10;

        this.leftArrow.classList.toggle('visible', canScrollLeft);
        this.rightArrow.classList.toggle('visible', canScrollRight);
    }

    updateIndicators() {
        const indicators = this.indicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageCarousel();
});
document.addEventListener("contextmenu", e => {
    if (e.target.tagName === "IMG") e.preventDefault();
});
let currentOpenIndex = -1;

function toggleFAQ(index) {
    const faqItems = document.querySelectorAll('.faq-item');
    const clickedQuestion = faqItems[index].querySelector('.faq-question');
    const clickedAnswer = faqItems[index].querySelector('.faq-answer');
    const clickedIcon = faqItems[index].querySelector('.faq-icon');

    // Se clicou no mesmo item que já está aberto, fecha ele
    if (currentOpenIndex === index) {
        closeItem(clickedQuestion, clickedAnswer, clickedIcon);
        currentOpenIndex = -1;
        return;
    }

    // Fecha o item anteriormente aberto (se houver)
    if (currentOpenIndex !== -1) {
        const prevQuestion = faqItems[currentOpenIndex].querySelector('.faq-question');
        const prevAnswer = faqItems[currentOpenIndex].querySelector('.faq-answer');
        const prevIcon = faqItems[currentOpenIndex].querySelector('.faq-icon');
        closeItem(prevQuestion, prevAnswer, prevIcon);
    }

    // Abre o novo item
    openItem(clickedQuestion, clickedAnswer, clickedIcon);
    currentOpenIndex = index;
}

function openItem(question, answer, icon) {
    question.classList.add('active');
    answer.classList.add('active');
    icon.classList.add('rotated');
}

function closeItem(question, answer, icon) {
    question.classList.remove('active');
    answer.classList.remove('active');
    icon.classList.remove('rotated');
}

// Adiciona suporte para navegação por teclado
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && currentOpenIndex !== -1) {
        const faqItems = document.querySelectorAll('.faq-item');
        const openQuestion = faqItems[currentOpenIndex].querySelector('.faq-question');
        const openAnswer = faqItems[currentOpenIndex].querySelector('.faq-answer');
        const openIcon = faqItems[currentOpenIndex].querySelector('.faq-icon');
        closeItem(openQuestion, openAnswer, openIcon);
        currentOpenIndex = -1;
    }
});
document.getElementById("ano").textContent = new Date().getFullYear();
// Função para ajustar carousel no mobile
function adjustCarouselForMobile() {
    const carousel = document.getElementById('carousel');
    const items = carousel.querySelectorAll('.carousel-item');

    function updateItemsVisible() {
        const width = window.innerWidth;
        let itemsVisible;

        if (width <= 480) {
            itemsVisible = 1.1; // 1 item + pequena parte do próximo
        } else if (width <= 768) {
            itemsVisible = 1.8; // 1 item completo + parte do próximo
        } else if (width <= 1024) {
            itemsVisible = 2.5; // 2 itens + parte do terceiro
        } else {
            itemsVisible = 3.2; // Desktop original
        }

        // Atualiza a instância do carousel se existir
        if (window.carouselInstance) {
            window.carouselInstance.itemsVisible = itemsVisible;
        }
    }

    updateItemsVisible();
    window.addEventListener('resize', updateItemsVisible);
}

// Modifique a inicialização do carousel
document.addEventListener('DOMContentLoaded', () => {
    window.carouselInstance = new ImageCarousel();
    adjustCarouselForMobile();
});
document.addEventListener('DOMContentLoaded', function() {
    const carouselBtns = document.querySelectorAll('.carousel-btn');
    
    carouselBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.blur(); // Remove focus imediatamente
        });
        
        // Remove focus ao tocar (mobile)
        btn.addEventListener('touchend', function() {
            this.blur();
        });
    });
});