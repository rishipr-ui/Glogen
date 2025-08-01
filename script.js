// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")
})

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll(".nav-link")
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  })
})

// Header scroll effect
const header = document.getElementById("header")
let lastScrollTop = 0
// Comprehensive Search System
const searchInput = document.querySelector(".search-input")
const searchBtn = document.querySelector(".search-btn")
const suggestionTags = document.querySelectorAll(".suggestion-tag")

// Search data - this would typically come from a database or API
const searchData = {
  services: [
    {
      title: "BA/BE Studies",
      description: "Bioavailability and Bioequivalence studies for pharmaceutical development",
      url: "babe.html",
      keywords: ["bioavailability", "bioequivalence", "pharmaceutical", "drug development", "clinical trials"]
    },
    {
      title: "PK Bioanalysis",
      description: "Pharmacokinetic analysis and bioanalytical services",
      url: "#",
      keywords: ["pharmacokinetics", "bioanalysis", "drug metabolism", "analytical chemistry"]
    },
    {
      title: "Clinical Trial Services",
      description: "Comprehensive clinical trial management and execution",
      url: "clinical-trials.html",
      keywords: ["clinical trials", "trial management", "patient recruitment", "data collection"]
    },
    {
      title: "Biostatistics & Data Management",
      description: "Statistical analysis and clinical data management services",
      url: "#",
      keywords: ["biostatistics", "data management", "statistical analysis", "clinical data"]
    }
  ],
  pages: [
    {
      title: "About Us",
      description: "Learn about GloGen's mission, vision, and commitment to advancing global health",
      url: "about-us.html",
      keywords: ["about", "company", "mission", "vision", "team"]
    },
    {
      title: "Vision & Mission",
      description: "Our vision for the future of clinical research and our mission to advance healthcare",
      url: "vision-mission.html",
      keywords: ["vision", "mission", "goals", "objectives", "future"]
    },
    {
      title: "Infrastructure",
      description: "State-of-the-art facilities and equipment for clinical research",
      url: "infrastructure.html",
      keywords: ["facilities", "equipment", "laboratory", "infrastructure", "technology"]
    },
    {
      title: "Careers",
      description: "Join our team of dedicated professionals in clinical research",
      url: "career.html",
      keywords: ["careers", "jobs", "employment", "opportunities", "team"]
    },
    {
      title: "News",
      description: "Latest updates and insights from the world of clinical research",
      url: "news.html",
      keywords: ["news", "updates", "insights", "articles", "blog"]
    },
    {
      title: "Contact Us",
      description: "Get in touch with our team for inquiries and collaborations",
      url: "contactus.html",
      keywords: ["contact", "inquiry", "collaboration", "support", "help"]
    }
  ],
  articles: [
    {
      title: "Elevating Clinical Trials",
      description: "A closer look at GloGen's commitment to global health through innovative clinical trials",
      url: "elevating-clinical-trials.html",
      keywords: ["clinical trials", "innovation", "global health", "research excellence"]
    },
    {
      title: "Patient Safety: Our Unwavering Priority",
      description: "How we ensure patient safety throughout all our clinical research processes",
      url: "patient-safety-our-unwavering-priority.html",
      keywords: ["patient safety", "safety protocols", "clinical research", "patient care"]
    },
    {
      title: "Digital Transformation in Clinical Data Management",
      description: "Exploring the role of digital technology in modern clinical data management",
      url: "digital-transformation-in-clinical-data-management.html",
      keywords: ["digital transformation", "data management", "technology", "clinical data"]
    }
  ]
}

// Search results container
let searchResultsContainer = null

// Initialize search functionality
function initializeSearch() {
  // Create search results container
  searchResultsContainer = document.createElement('div')
  searchResultsContainer.className = 'search-results-container'
  searchResultsContainer.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    margin-top: 8px;
  `
  
  // Insert after search box
  const searchBox = document.querySelector('.search-box')
  searchBox.parentNode.insertBefore(searchResultsContainer, searchBox.nextSibling)
  
  // Add search results styles
  const searchStyles = document.createElement('style')
  searchStyles.textContent = `
    .search-result-item {
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .search-result-item:hover {
      background-color: #f8f9fa;
    }
    
    .search-result-item:last-child {
      border-bottom: none;
    }
    
    .search-result-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .search-result-content {
      flex: 1;
    }
    
    .search-result-title {
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
      font-size: 14px;
    }
    
    .search-result-description {
      color: #666;
      font-size: 12px;
      line-height: 1.4;
    }
    
    .search-result-category {
      font-size: 10px;
      color: #2563eb;
      background: #eff6ff;
      padding: 2px 8px;
      border-radius: 12px;
      display: inline-block;
      margin-top: 4px;
    }
    
    .no-results {
      padding: 20px;
      text-align: center;
      color: #666;
      font-style: italic;
    }
    
    .search-highlight {
      background-color: #fef3c7;
      padding: 1px 2px;
      border-radius: 2px;
    }
  `
  document.head.appendChild(searchStyles)
}

// Search function
function performSearch(searchTerm) {
  if (!searchTerm.trim()) {
    hideSearchResults()
    return
  }

  const results = []
  const searchLower = searchTerm.toLowerCase()

  // Search through services
  searchData.services.forEach(service => {
    const relevance = calculateRelevance(service, searchLower)
    if (relevance > 0) {
      results.push({
        ...service,
        category: 'Service',
        relevance,
        icon: '🔬'
      })
    }
  })

  // Search through pages
  searchData.pages.forEach(page => {
    const relevance = calculateRelevance(page, searchLower)
    if (relevance > 0) {
      results.push({
        ...page,
        category: 'Page',
        relevance,
        icon: '📄'
      })
    }
  })

  // Search through articles
  searchData.articles.forEach(article => {
    const relevance = calculateRelevance(article, searchLower)
    if (relevance > 0) {
      results.push({
        ...article,
        category: 'Article',
        relevance,
        icon: '📰'
      })
    }
  })

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance)

  // Display results
  displaySearchResults(results, searchTerm)
}

// Calculate search relevance
function calculateRelevance(item, searchTerm) {
  let score = 0
  
  // Title match (highest weight)
  if (item.title.toLowerCase().includes(searchTerm)) {
    score += 10
  }
  
  // Description match
  if (item.description.toLowerCase().includes(searchTerm)) {
    score += 5
  }
  
  // Keywords match
  if (item.keywords) {
    item.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(searchTerm)) {
        score += 3
      }
    })
  }
  
  // Exact word matches get bonus points
  const words = searchTerm.split(' ')
  words.forEach(word => {
    if (item.title.toLowerCase().includes(word)) score += 2
    if (item.description.toLowerCase().includes(word)) score += 1
  })
  
  return score
}

// Display search results
function displaySearchResults(results, searchTerm) {
  if (!searchResultsContainer) return

  if (results.length === 0) {
    searchResultsContainer.innerHTML = `
      <div class="no-results">
        <p>No results found for "${searchTerm}"</p>
        <p>Try searching for: clinical trials, BA/BE, infrastructure, careers</p>
      </div>
    `
  } else {
    const resultsHTML = results.slice(0, 8).map(result => {
      const highlightedTitle = highlightSearchTerm(result.title, searchTerm)
      const highlightedDescription = highlightSearchTerm(result.description, searchTerm)
      
      return `
        <div class="search-result-item" onclick="navigateToSearchResult('${result.url}')">
          <div class="search-result-icon">${result.icon}</div>
          <div class="search-result-content">
            <div class="search-result-title">${highlightedTitle}</div>
            <div class="search-result-description">${highlightedDescription}</div>
            <div class="search-result-category">${result.category}</div>
          </div>
        </div>
      `
    }).join('')
    
    searchResultsContainer.innerHTML = resultsHTML
  }
  
  searchResultsContainer.style.display = 'block'
}

// Highlight search terms in results
function highlightSearchTerm(text, searchTerm) {
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<span class="search-highlight">$1</span>')
}

// Navigate to search result
function navigateToSearchResult(url) {
  if (url && url !== '#') {
    window.location.href = url
  }
  hideSearchResults()
}

// Make function globally available
window.navigateToSearchResult = navigateToSearchResult

// Hide search results
function hideSearchResults() {
  if (searchResultsContainer) {
    searchResultsContainer.style.display = 'none'
  }
}

// Handle search button click
searchBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim()
  if (searchTerm) {
    performSearch(searchTerm)
  }
})

// Handle Enter key in search input
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const searchTerm = searchInput.value.trim()
    if (searchTerm) {
      performSearch(searchTerm)
    }
  }
})

// Handle suggestion tag clicks
suggestionTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    const searchTerm = tag.textContent
    searchInput.value = searchTerm
    performSearch(searchTerm)
  })
})

// Handle search input focus
searchInput.addEventListener("focus", () => {
  if (searchInput.value.trim()) {
    performSearch(searchInput.value.trim())
  }
})

// Real-time search as user types
let searchTimeout
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim()
  
  // Clear previous timeout
  clearTimeout(searchTimeout)
  
  // Add delay to avoid too many searches while typing
  searchTimeout = setTimeout(() => {
    if (searchTerm.length >= 2) {
      performSearch(searchTerm)
    } else if (searchTerm.length === 0) {
      hideSearchResults()
    }
  }, 300)
})

// Handle clicks outside search to close results
document.addEventListener("click", (e) => {
  const searchContainer = document.querySelector('.search-container')
  if (searchContainer && !searchContainer.contains(e.target)) {
    hideSearchResults()
  }
})

// Initialize search on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeSearch()
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

// Add animation classes to elements
document.addEventListener("DOMContentLoaded", () => {
  // Add fade-in animation to section headers
  const sectionHeaders = document.querySelectorAll(".section-header")
  sectionHeaders.forEach((header) => {
    header.classList.add("fade-in")
  })

  // Add slide-in animations to cards
  const cards = document.querySelectorAll(".service-card, .feature-card, .insight-card")
  cards.forEach((card, index) => {
    card.classList.add("fade-in")
    card.style.transitionDelay = `${index * 0.1}s`
  })

  // Add slide-in animation to about section
  const aboutImage = document.querySelector(".about-image")
  const aboutContent = document.querySelector(".about-content")

  if (aboutImage) aboutImage.classList.add("slide-in-left")
  if (aboutContent) aboutContent.classList.add("slide-in-right")

  // Now observe all animated elements
  const animatedElements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
  animatedElements.forEach((el) => {
    observer.observe(el)
  })
})

// Form validation and interaction enhancements
const forms = document.querySelectorAll("form")
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    // Add form validation logic here
    console.log("Form submitted")
  })
})

// Add loading states to buttons
const buttons = document.querySelectorAll(".btn")
buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    // Add ripple effect
    const ripple = document.createElement("span")
    const rect = this.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    this.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
})

// Add ripple effect CSS
const style = document.createElement("style")
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Lazy loading for images
const images = document.querySelectorAll('img[src*="placeholder.svg"]')
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      // Here you would load the actual image
      // For demo purposes, we'll just add a loaded class
      img.classList.add("loaded")
      imageObserver.unobserve(img)
    }
  })
})

images.forEach((img) => {
  imageObserver.observe(img)
})

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.boxShadow = "none"
  }
}, 10)

window.addEventListener("scroll", debouncedScrollHandler)

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  // ESC key closes mobile menu and search results
  if (e.key === "Escape") {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
    hideSearchResults()
    searchInput.blur()
  }

  // Enter key on search suggestions
  if (e.key === "Enter" && e.target.classList.contains("suggestion-tag")) {
    e.target.click()
  }

  // Arrow keys for search results navigation
  if (searchResultsContainer && searchResultsContainer.style.display !== 'none') {
    const searchResults = searchResultsContainer.querySelectorAll('.search-result-item')
    const currentIndex = Array.from(searchResults).findIndex(item => item.classList.contains('selected'))
    
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = currentIndex < searchResults.length - 1 ? currentIndex + 1 : 0
      selectSearchResult(searchResults, nextIndex)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : searchResults.length - 1
      selectSearchResult(searchResults, prevIndex)
    } else if (e.key === "Enter" && currentIndex >= 0) {
      e.preventDefault()
      searchResults[currentIndex].click()
    }
  }
})

// Select search result for keyboard navigation
function selectSearchResult(searchResults, index) {
  searchResults.forEach((item, i) => {
    item.classList.remove('selected')
    if (i === index) {
      item.classList.add('selected')
      item.scrollIntoView({ block: 'nearest' })
    }
  })
}

// Initialize tooltips and other interactive elements
document.addEventListener("DOMContentLoaded", () => {
  // Add focus styles for accessibility
  const focusableElements = document.querySelectorAll("a, button, input, [tabindex]")
  focusableElements.forEach((element) => {
    element.addEventListener("focus", () => {
      element.style.outline = "2px solid var(--primary-color)"
      element.style.outlineOffset = "2px"
    })

    element.addEventListener("blur", () => {
      element.style.outline = "none"
    })
  })
})

console.log("GloGen Clinical Research website loaded successfully!")
