
"use strict";

/* =================================
   1. SELECT HTML ELEMENTS
================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navigationLinks = document.querySelectorAll(".nav-link");
const revealElements = document.querySelectorAll(".reveal");
const currentYear = document.getElementById("currentYear");


/* =================================
   2. MOBILE NAVIGATION
================================= */

function closeMenu() {
    navLinks.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

// Close the mobile menu after selecting a navigation link.

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        closeMenu();
    });
});

// Close the menu when Escape is pressed.

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});


/* =================================
   3. SCROLL REVEAL ANIMATIONS
================================= */

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });

} else {

    // Fallback for browsers without IntersectionObserver.

    revealElements.forEach(function (element) {
        element.classList.add("visible");
    });

}


/* =================================
   4. ACTIVE NAVIGATION LINK
================================= */

const pageSections = document.querySelectorAll(
    "main section[id]"
);

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    const currentId = entry.target.id;

                    navigationLinks.forEach(function (link) {

                        const linkTarget = link.getAttribute("href");

                        link.classList.toggle(
                            "active",
                            linkTarget === "#" + currentId
                        );

                    });

                }

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    pageSections.forEach(function (section) {
        sectionObserver.observe(section);
    });

}


/* =================================
   5. AUTOMATIC FOOTER YEAR
================================= */

currentYear.textContent = new Date().getFullYear();


/* =================================
   6. INITIALIZE WEBSITE
================================= */

closeMenu();
