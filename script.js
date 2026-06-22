// TYPING EFFECT

const roles = [
    "Frontend Developer",
    "C++ Programmer",
    "DSA Learner",
    "MERN Stack Learner",
    "Problem Solver"
];

const typingElement = document.querySelector(".typing");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {

    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();


// ACTIVE NAVBAR LINK ON SCROLL

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});


// HEADER SHADOW ON SCROLL

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
    } else {
        header.style.boxShadow = "none";
    }
});


// SMOOTH REVEAL ANIMATION

const revealElements = document.querySelectorAll(
    ".card, .project-card, .achievement-box, .skill-box"
);

function reveal() {

    revealElements.forEach(element => {

        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }
    });
}

// Initial styles
revealElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(40px)";
    element.style.transition = "all 0.6s ease";
});

window.addEventListener("scroll", reveal);
reveal();


// BACK TO TOP BUTTON

const topButton = document.createElement("button");

topButton.innerHTML = "↑";
topButton.classList.add("top-btn");

document.body.appendChild(topButton);

topButton.style.position = "fixed";
topButton.style.bottom = "20px";
topButton.style.right = "20px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.borderRadius = "50%";
topButton.style.fontSize = "20px";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.zIndex = "1000";

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
});

topButton.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});