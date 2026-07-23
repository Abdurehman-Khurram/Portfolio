/* ------------------------------------------------------------------------
   Interaction logic for the portfolio website
------------------------------------------------------------------------ */

const header = document.getElementById('header');
const themeButton = document.getElementById('theme-button');
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const revealItems = document.querySelectorAll('.reveal');
const progressBar = document.querySelector('.progress-bar');
const skillFills = document.querySelectorAll('.skill-fill');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
const sections = document.querySelectorAll('main section[id]');

const isMobileView = () => window.innerWidth < 768;

const closeMobileNav = () => {
  if (mainNav) {
    mainNav.classList.remove('open');
  }

  if (navToggle) {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  document.body.classList.remove('nav-open');
};

/* Theme toggle & persistence */
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') document.body.classList.add('light-theme');
const updateThemeButton = () => {
  themeButton.textContent = document.body.classList.contains('light-theme') ? '☀' : '☾';
};
updateThemeButton();

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  localStorage.setItem('portfolio-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  updateThemeButton();
});

/* Mobile navigation toggle */
navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  navToggle.classList.toggle('open');
  mainNav.classList.toggle('open');

  if (mainNav.classList.contains('open')) {
    document.body.classList.add('nav-open');
  } else {
    document.body.classList.remove('nav-open');
  }
});

document.addEventListener('click', (event) => {
  if (!mainNav.classList.contains('open')) {
    return;
  }

  const target = event.target;
  if (!mainNav.contains(target) && !navToggle.contains(target)) {
    closeMobileNav();
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (isMobileView()) {
      closeMobileNav();
    }
  });
});

window.addEventListener('resize', () => {
  if (!isMobileView()) {
    closeMobileNav();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileNav();
  }
});

/* Smooth scroll and active nav */
const updateActiveLink = () => {
  const scrollY = window.pageYOffset;
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((item) => item.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = pageHeight > 0 ? (scrollPosition / pageHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  header.classList.toggle('scrolled', scrollPosition > 20);
  backToTop.classList.toggle('visible', scrollPosition > 550);
  updateActiveLink();
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Reveal animations */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

/* Skill animation */
const skillsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skillFills.forEach((fill) => {
          fill.style.width = `${fill.dataset.skill}%`;
        });
        observer.disconnect();
      }
    });
  },
  { threshold: 0.3 }
);

const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

/* Project filtering */
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;

    projectCards.forEach((card) => {
      const matches = category === 'all' || card.dataset.category === category;
      card.style.display = matches ? 'grid' : 'none';
    });
  });
});

/* Testimonial slider */
let testimonialIndex = 0;
const testimonialDotsArray = Array.from(testimonialDots);
const updateTestimonials = () => {
  testimonialCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === testimonialIndex);
  });
  testimonialDotsArray.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === testimonialIndex);
  });
};

testimonialDotsArray.forEach((dot) => {
  dot.addEventListener('click', () => {
    testimonialIndex = Number(dot.dataset.index);
    updateTestimonials();
  });
});

setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  updateTestimonials();
}, 5500);

updateTestimonials();

/* Contact form validation */
const isEmailValid = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

if (contactForm && feedback) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const subject = formData.get('subject')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !subject || !message) {
      feedback.textContent = 'Please complete all fields before sending.';
      feedback.style.color = '#ff9aa2';
      return;
    }

    if (!isEmailValid(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.style.color = '#ff9aa2';
      return;
    }

    feedback.textContent = 'Message sent successfully. I will reply soon!';
    feedback.style.color = '#a2f5ce';
    contactForm.reset();
  });
}
