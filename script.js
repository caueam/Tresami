class ImageCarousel {
  constructor() {
    this.carousel = document.getElementById("carousel")
    this.leftArrow = document.getElementById("leftArrow")
    this.rightArrow = document.getElementById("rightArrow")
    this.indicators = document.getElementById("indicators")
    this.items = this.carousel.querySelectorAll(".carousel-item")
    this.currentIndex = 0
    this.itemsVisible = 3.2
    this.isScrolling = false
    this.startX = 0
    this.currentX = 0
    this.isDragging = false

    this.init()
  }

  init() {
    this.createIndicators()
    this.updateArrows()
    this.bindEvents()
    this.enableCarouselScroll()
  }

  enableCarouselScroll() {
    this.carousel.style.overflowX = "auto"
    this.carousel.style.scrollBehavior = "smooth"

    // Eventos de touch para swipe
    this.carousel.addEventListener("touchstart", (e) => this.handleTouchStart(e), { passive: true })
    this.carousel.addEventListener("touchmove", (e) => this.handleTouchMove(e), { passive: true })
    this.carousel.addEventListener("touchend", (e) => this.handleTouchEnd(e), { passive: true })

    // Evento de scroll para atualizar indicadores
    this.carousel.addEventListener("scroll", () => this.handleScroll())
  }

  handleTouchStart(e) {
    this.startX = e.touches[0].clientX
    this.isDragging = true
  }

  handleTouchMove(e) {
    if (!this.isDragging) return
    this.currentX = e.touches[0].clientX
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return
    this.isDragging = false

    const diffX = this.startX - this.currentX
    const threshold = 50

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        this.slideToNext()
      } else {
        this.slideToPrev()
      }
    }
  }

  handleScroll() {
    const scrollLeft = this.carousel.scrollLeft
    const itemWidth = this.carousel.clientWidth / this.itemsVisible
    const newIndex = Math.round(scrollLeft / itemWidth)

    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex
      this.updateIndicators()
      this.updateArrows()
    }
  }

  createIndicators() {
    // Limpa indicadores existentes para evitar duplicação
    this.indicators.innerHTML = ""

    const totalIndicators = this.items.length

    for (let i = 0; i < totalIndicators; i++) {
      const indicator = document.createElement("button")
      indicator.className = "indicator"
      indicator.addEventListener("click", () => this.goToSlide(i))
      this.indicators.appendChild(indicator)
    }

    this.updateIndicators()
  }

  bindEvents() {
    this.leftArrow.addEventListener("click", () => this.slide("left"))
    this.rightArrow.addEventListener("click", () => this.slide("right"))
  }

  slide(direction) {
    if (direction === "left") {
      this.slideToPrev()
    } else {
      this.slideToNext()
    }
  }

  slideToNext() {
    if (this.currentIndex < this.items.length - 1) {
      this.goToSlide(this.currentIndex + 1)
    }
  }

  slideToPrev() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1)
    }
  }

  goToSlide(index) {
    if (this.isScrolling) return
    this.isScrolling = true

    this.currentIndex = Math.max(0, Math.min(index, this.items.length - 1))
    const itemWidth = this.carousel.clientWidth / this.itemsVisible

    this.carousel.scrollTo({
      left: this.currentIndex * itemWidth,
      behavior: "smooth",
    })

    this.updateIndicators()
    this.updateArrows()

    setTimeout(() => {
      this.isScrolling = false
    }, 300)
  }

  updateArrows() {
    this.leftArrow.classList.toggle("visible", this.currentIndex > 0)
    this.rightArrow.classList.toggle("visible", this.currentIndex < this.items.length - 1)
  }

  updateIndicators() {
    const indicators = this.indicators.querySelectorAll(".indicator")
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex)
    })
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.carouselInstance = new ImageCarousel()
  adjustCarouselForMobile()
})
document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName === "IMG") e.preventDefault()
})
let currentOpenIndex = -1

function toggleFAQ(index) {
  const faqItems = document.querySelectorAll(".faq-item")
  const clickedQuestion = faqItems[index].querySelector(".faq-question")
  const clickedAnswer = faqItems[index].querySelector(".faq-answer")
  const clickedIcon = faqItems[index].querySelector(".faq-icon")

  // Se clicou no mesmo item que já está aberto, fecha ele
  if (currentOpenIndex === index) {
    closeItem(clickedQuestion, clickedAnswer, clickedIcon)
    currentOpenIndex = -1
    return
  }

  // Fecha o item anteriormente aberto (se houver)
  if (currentOpenIndex !== -1) {
    const prevQuestion = faqItems[currentOpenIndex].querySelector(".faq-question")
    const prevAnswer = faqItems[currentOpenIndex].querySelector(".faq-answer")
    const prevIcon = faqItems[currentOpenIndex].querySelector(".faq-icon")
    closeItem(prevQuestion, prevAnswer, prevIcon)
  }

  // Abre o novo item
  openItem(clickedQuestion, clickedAnswer, clickedIcon)
  currentOpenIndex = index
}

function openItem(question, answer, icon) {
  question.classList.add("active")
  answer.classList.add("active")
  icon.classList.add("rotated")
}

function closeItem(question, answer, icon) {
  question.classList.remove("active")
  answer.classList.remove("active")
  icon.classList.remove("rotated")
}

// Adiciona suporte para navegação por teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && currentOpenIndex !== -1) {
    const faqItems = document.querySelectorAll(".faq-item")
    const openQuestion = faqItems[currentOpenIndex].querySelector(".faq-question")
    const openAnswer = faqItems[currentOpenIndex].querySelector(".faq-answer")
    const openIcon = faqItems[currentOpenIndex].querySelector(".faq-icon")
    closeItem(openQuestion, openAnswer, openIcon)
    currentOpenIndex = -1
  }
})
document.getElementById("ano").textContent = new Date().getFullYear()

function adjustCarouselForMobile() {
  const carousel = document.getElementById("carousel")
  const items = carousel.querySelectorAll(".carousel-item")
  let resizeTimeout

  function updateItemsVisible() {
    const width = window.innerWidth
    let itemsVisible

    if (width <= 480) {
      itemsVisible = 1.1
    } else if (width <= 768) {
      itemsVisible = 1.8
    } else if (width <= 1024) {
      itemsVisible = 2.5
    } else {
      itemsVisible = 3.2
    }

    if (window.carouselInstance) {
      window.carouselInstance.itemsVisible = itemsVisible
      window.carouselInstance.createIndicators()
    }
  }

  updateItemsVisible()

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(updateItemsVisible, 150)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const carouselBtns = document.querySelectorAll(".carousel-btn")

  carouselBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.blur() // Remove focus imediatamente
    })

    // Remove focus ao tocar (mobile)
    btn.addEventListener("touchend", function () {
      this.blur()
    })
  })
})

// Intersection Observer para animações de scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in")
      // Remove o observer após a animação para que só aconteça uma vez
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Aplicar animação às sócias quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  const sociaItems = document.querySelectorAll(".socia-item")

  sociaItems.forEach((item) => {
    item.classList.add("scroll-animate")
    observer.observe(item)
  })
  const servicoItems = document.querySelectorAll(".servico-item")

  servicoItems.forEach((item) => {
    observer.observe(item)
  })
})