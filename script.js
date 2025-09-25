class ImageCarousel {
  constructor() {
    this.carousel = document.getElementById("carousel")
    this.indicators = document.getElementById("indicators")
    this.leftArrow = document.getElementById("leftArrow")
    this.rightArrow = document.getElementById("rightArrow")
    this.items = this.carousel.querySelectorAll(".carousel-item")
    this.currentIndex = 0
    this.totalItems = this.items.length
    this.activeDescriptionIndex = -1
    this.isMobile = window.innerWidth <= 768

    this.init()
  }

  init() {
    this.createIndicators()
    this.bindImageEvents()
    this.hideAllDescriptions()
    this.setupResponsive()

    if (this.isMobile) {
      this.bindScrollEvent()
      this.bindTouchEvents() // Added touch events for mobile loop
      this.hideArrows()
    } else {
      this.bindArrowEvents()
      this.showArrows()
    }
  }

  hideArrows() {
    if (this.leftArrow) this.leftArrow.style.display = "none"
    if (this.rightArrow) this.rightArrow.style.display = "none"
  }

  showArrows() {
    if (this.leftArrow) this.leftArrow.style.display = "block"
    if (this.rightArrow) this.rightArrow.style.display = "block"
  }

  bindArrowEvents() {
    if (this.leftArrow) {
      this.leftArrow.addEventListener("click", () => this.previousSlide())
    }
    if (this.rightArrow) {
      this.rightArrow.addEventListener("click", () => this.nextSlide())
    }
  }

  nextSlide() {
    if (this.isMobile) return

    const maxIndex = this.getMaxIndex()
    if (this.currentIndex < maxIndex) {
      this.currentIndex++
    } else {
      this.currentIndex = 0
    }
    this.goToSlideDesktop(this.currentIndex)
  }

  previousSlide() {
    if (this.isMobile) return

    if (this.currentIndex > 0) {
      this.currentIndex--
    } else {
      this.currentIndex = this.getMaxIndex()
    }
    this.goToSlideDesktop(this.currentIndex)
  }

  bindTouchEvents() {
    if (!this.isMobile) return

    let startX = 0
    let startScrollLeft = 0
    let isDragging = false

    this.carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      startScrollLeft = this.carousel.scrollLeft
      isDragging = true
    })

    this.carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return
      e.preventDefault()
    })

    this.carousel.addEventListener("touchend", (e) => {
      if (!isDragging) return
      isDragging = false

      const endX = e.changedTouches[0].clientX
      const diffX = startX - endX
      const threshold = 50 // minimum swipe distance

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // Swiped left (next)
          if (this.currentIndex >= this.totalItems - 1) {
            this.goToSlide(0)
          } else {
            this.goToSlide(this.currentIndex + 1)
          }
        } else {
          // Swiped right (previous)
          if (this.currentIndex <= 0) {
            this.goToSlide(this.totalItems - 1)
          } else {
            this.goToSlide(this.currentIndex - 1)
          }
        }
      }
    })
  }

  getItemsPerView() {
    return window.innerWidth >= 1024 ? 3.2 : window.innerWidth >= 768 ? 2.5 : 1.2
  }

  getMaxIndex() {
    if (this.isMobile) return this.totalItems - 1
    const itemsPerView = this.getItemsPerView()
    return Math.max(0, this.totalItems - Math.ceil(itemsPerView))
  }

  getIndicatorCount() {
    if (this.isMobile) return this.totalItems
    return 12
  }

  createIndicators() {
    this.indicators.innerHTML = ""
    const indicatorCount = this.getIndicatorCount()

    for (let i = 0; i < indicatorCount; i++) {
      const indicator = document.createElement("button")
      indicator.className = "indicator"
      indicator.addEventListener("click", () => {
        if (this.isMobile) {
          this.goToSlide(i)
        } else {
          this.goToSlideDesktop(i)
        }
      })
      this.indicators.appendChild(indicator)
    }

    this.updateIndicators()
  }

  bindImageEvents() {
    this.items.forEach((item, index) => {
      const img = item.querySelector("img")
      if (img) {
        img.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          this.toggleDescription(index)
        })
        img.style.cursor = "pointer"
      }
    })
  }

  toggleDescription(index) {
    const item = this.items[index]
    const overlay = item.querySelector(".overlay")

    if (!overlay) return

    if (this.activeDescriptionIndex === index) {
      // Hide current description
      overlay.classList.remove("active", "show")
      item.classList.remove("active")
      this.activeDescriptionIndex = -1
    } else {
      // Hide all other descriptions first
      this.hideAllDescriptions()

      // Show selected description
      overlay.classList.add("active", "show")
      item.classList.add("active")
      this.activeDescriptionIndex = index
    }
  }

  hideAllDescriptions() {
    this.items.forEach((item) => {
      const overlay = item.querySelector(".overlay")
      if (overlay) {
        overlay.classList.remove("active", "show")
        item.classList.remove("active")
      }
    })
    this.activeDescriptionIndex = -1
  }

  // Mobile navigation (unchanged)
  goToSlide(index) {
    if (!this.isMobile) return

    this.currentIndex = Math.max(0, Math.min(index, this.totalItems - 1))

    const targetItem = this.items[this.currentIndex]
    if (!targetItem) return

    this.hideAllDescriptions()

    const itemLeft = targetItem.offsetLeft
    const itemWidth = targetItem.offsetWidth
    const containerWidth = this.carousel.offsetWidth
    const scrollPosition = itemLeft - containerWidth / 2 + itemWidth / 2

    this.carousel.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: "smooth",
    })

    setTimeout(() => {
      this.updateIndicators()
    }, 50)
  }

  goToSlideDesktop(index) {
    if (this.isMobile) return

    this.currentIndex = Math.max(0, Math.min(index, this.getMaxIndex()))
    this.hideAllDescriptions()

    const containerWidth = this.carousel.clientWidth
    const itemsPerView = this.getItemsPerView()
    const itemWidth = containerWidth / itemsPerView
    const scrollPosition = this.currentIndex * itemWidth

    this.carousel.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    })

    setTimeout(() => {
      this.updateIndicators()
    }, 50)
  }

  updateIndicators() {
    const indicators = this.indicators.querySelectorAll(".indicator")
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex)
    })
  }

  setupResponsive() {
    let resizeTimeout
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const wasMobile = this.isMobile
        this.isMobile = window.innerWidth <= 768

        if (wasMobile !== this.isMobile) {
          this.init()
        } else {
          this.createIndicators()
          if (this.isMobile) {
            this.updateCurrentIndexFromScroll()
          }
        }
      }, 150)
    })
  }

  bindScrollEvent() {
    if (!this.isMobile) return

    let scrollTimeout
    this.carousel.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        this.updateCurrentIndexFromScroll()
      }, 50)
    })
  }

  updateCurrentIndexFromScroll() {
    if (!this.isMobile) return

    const containerRect = this.carousel.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    this.items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect()
      const itemCenter = itemRect.left + itemRect.width / 2
      const distance = Math.abs(containerCenter - itemCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    this.currentIndex = closestIndex
    this.updateIndicators()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.carouselInstance = new ImageCarousel()
})

let currentOpenIndex = -1

function toggleFAQ(index) {
  const faqItems = document.querySelectorAll(".faq-item")
  const clickedQuestion = faqItems[index].querySelector(".faq-question")
  const clickedAnswer = faqItems[index].querySelector(".faq-answer")
  const clickedIcon = faqItems[index].querySelector(".faq-icon")

  if (currentOpenIndex === index) {
    closeItem(clickedQuestion, clickedAnswer, clickedIcon)
    currentOpenIndex = -1
    return
  }

  if (currentOpenIndex !== -1) {
    const prevQuestion = faqItems[currentOpenIndex].querySelector(".faq-question")
    const prevAnswer = faqItems[currentOpenIndex].querySelector(".faq-answer")
    const prevIcon = faqItems[currentOpenIndex].querySelector(".faq-icon")
    closeItem(prevQuestion, prevAnswer, prevIcon)
  }

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

document.addEventListener("DOMContentLoaded", () => {
  const carouselBtns = document.querySelectorAll(".carousel-btn")

  carouselBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.blur()
    })

    btn.addEventListener("touchend", function () {
      this.blur()
    })
  })
})

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

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
