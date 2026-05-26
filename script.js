// ===== TYPING EFFECT =====

const typingText = document.querySelector(".typing");

const words = [
    "Frontend Developer",
    "C++ Programmer",
    "DSA Learner",
    "React Developer",
    "Problem Solver"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect(){

    const currentWord = words[wordIndex];

    if(!isDeleting){

        typingText.textContent =
        currentWord.substring(0,charIndex + 1);

        charIndex++;

        if(charIndex === currentWord.length){

            isDeleting = true;

            setTimeout(typeEffect,1500);

            return;
        }

    }else{

        typingText.textContent =
        currentWord.substring(0,charIndex - 1);

        charIndex--;

        if(charIndex === 0){

            isDeleting = false;

            wordIndex =
            (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect,isDeleting ? 70 : 120);
}

typeEffect();


// ===== STICKY HEADER =====

const header = document.querySelector(".header");

window.addEventListener("scroll",()=>{

    header.classList.toggle(
        "sticky",
        window.scrollY > 50
    );

});


// ===== CARD ANIMATION =====

const cards = document.querySelectorAll(".card");

cards.forEach((card)=>{

    card.addEventListener("mousemove",(e)=>{

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background = `
        radial-gradient(
            circle at ${x}px ${y}px,
            rgba(0,229,255,0.18),
            #111827
        )
        `;
    });

    card.addEventListener("mouseleave",()=>{

        card.style.background = "#111827";

    });

});


// ===== ACTIVE NAV LINK =====

const navLinks =
document.querySelectorAll(".navbar a");

navLinks.forEach((link)=>{

    link.addEventListener("click",()=>{

        navLinks.forEach((item)=>{
            item.classList.remove("active");
        });

        link.classList.add("active");

    });

});


// ===== SCROLL REVEAL =====

const revealElements =
document.querySelectorAll(".home-content, .card");

window.addEventListener("scroll",reveal);

function reveal(){

    revealElements.forEach((el)=>{

        const windowHeight =
        window.innerHeight;

        const revealTop =
        el.getBoundingClientRect().top;

        if(revealTop < windowHeight - 100){

            el.style.opacity = "1";
            el.style.transform =
            "translateY(0)";
        }

    });

}

reveal();


// ===== INITIAL STYLE =====

revealElements.forEach((el)=>{

    el.style.opacity = "0";
    el.style.transform =
    "translateY(40px)";
    el.style.transition =
    "all 0.8s ease";

});


// ===== CONSOLE MESSAGE =====

console.log(
    "Sunny Raj Portfolio Loaded Successfully 🚀"
);