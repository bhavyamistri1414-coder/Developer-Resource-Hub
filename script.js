// ========================================
// GET HTML ELEMENTS
// ========================================

const searchInput = document.getElementById("searchInput");
const resourceForm = document.getElementById("resourceForm");
const themeToggle = document.getElementById("themeToggle");


// ========================================
// CURRENT FILTER
// ========================================

let currentCategory = "All";


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", function () {
    filterResources();
});


// ========================================
// CATEGORY FILTER
// ========================================

const filterButtons = document.querySelectorAll(
    "button[data-category]"
);

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentCategory =
            button.getAttribute("data-category");

        filterResources();
    });
});


// ========================================
// FILTER RESOURCES
// ========================================

function filterResources() {

    const cards =
        document.querySelectorAll(".resource-card");

    const searchText =
        searchInput.value.toLowerCase().trim();

    cards.forEach(function (card) {

        const cardText =
            card.innerText.toLowerCase();

        const cardCategory =
            card.getAttribute("data-category");

        const matchesSearch =
            cardText.includes(searchText);

        const matchesCategory =
            currentCategory === "All" ||
            cardCategory === currentCategory;

        if (matchesSearch && matchesCategory) {

            card.style.display = "block";

        } else {

            card.style.display = "none";
        }
    });
}


// ========================================
// PREPARE HTML CARDS
// ========================================

function prepareExistingCards() {

    const cards =
        document.querySelectorAll(".resource-card");

    cards.forEach(function (card) {

        // Get category
        if (!card.getAttribute("data-category")) {

            const category =
                card.querySelector("span");

            if (category) {

                card.setAttribute(
                    "data-category",
                    category.textContent.trim()
                );
            }
        }


        // Add upvote button
        if (!card.querySelector(".upvote-btn")) {

            const name =
                card.querySelector("h2")
                    .textContent
                    .trim();

            const upvoteButton =
                document.createElement("button");

            upvoteButton.className =
                "upvote-btn";

            upvoteButton.innerHTML =
                '👍 Upvote <span>0</span>';

            card.appendChild(upvoteButton);

            setupUpvote(
                card,
                name,
                upvoteButton
            );
        }
    });
}


// ========================================
// ADD RESOURCE
// ========================================

resourceForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            document
                .getElementById("resourceName")
                .value
                .trim();

        const description =
            document
                .getElementById("resourceDescription")
                .value
                .trim();

        const category =
            document
                .getElementById("resourceCategory")
                .value;

        const link =
            document
                .getElementById("resourceLink")
                .value
                .trim();


        const resource = {
            name: name,
            description: description,
            category: category,
            link: link
        };


        // Check duplicate
        if (resourceAlreadyExists(resource.name)) {

            alert("This resource already exists!");

            return;
        }


        // Save resource
        saveResource(resource);


        // Show resource
        addResourceCard(resource);


        // Clear form
        resourceForm.reset();
    }
);


// ========================================
// CHECK DUPLICATE RESOURCE
// ========================================

function resourceAlreadyExists(name) {

    const existingCards =
        document.querySelectorAll(".resource-card");

    const lowerName =
        name.toLowerCase().trim();

    for (const card of existingCards) {

        const title =
            card.querySelector("h2");

        if (title) {

            if (
                title.textContent
                    .trim()
                    .toLowerCase() === lowerName
            ) {

                return true;
            }
        }
    }

    return false;
}


// ========================================
// SAVE RESOURCE
// ========================================

function saveResource(resource) {

    let resources =
        JSON.parse(
            localStorage.getItem("resources")
        ) || [];


    // Avoid duplicate in localStorage
    const alreadySaved =
        resources.some(function (item) {

            return (
                item.name.toLowerCase().trim() ===
                resource.name.toLowerCase().trim()
            );
        });


    if (!alreadySaved) {

        resources.push(resource);

        localStorage.setItem(
            "resources",
            JSON.stringify(resources)
        );
    }
}


// ========================================
// CREATE RESOURCE CARD
// ========================================

function addResourceCard(resource) {

    // Prevent duplicate card
    if (resourceAlreadyExists(resource.name)) {
        return;
    }


    const newCard =
        document.createElement("div");

    newCard.className =
        "resource-card";

    newCard.setAttribute(
        "data-category",
        resource.category
    );


    newCard.innerHTML = `

        <h2>${resource.name}</h2>

        <p>${resource.description}</p>

        <span>${resource.category}</span>

        <a
            href="${resource.link}"
            target="_blank"
        >
            Visit Resource
        </a>

    `;


    // Upvote button
    const upvoteButton =
        document.createElement("button");

    upvoteButton.className =
        "upvote-btn";

    upvoteButton.innerHTML =
        '👍 Upvote <span>0</span>';


    newCard.appendChild(upvoteButton);


    setupUpvote(
        newCard,
        resource.name,
        upvoteButton
    );


    document
        .querySelector("main")
        .appendChild(newCard);
}


// ========================================
// SETUP UPVOTE
// ========================================

function setupUpvote(
    card,
    resourceName,
    button
) {

    const countElement =
        button.querySelector("span");


    let votes =
        getUpvotes(resourceName);


    countElement.textContent =
        votes;


    button.addEventListener(
        "click",
        function () {

            votes++;

            countElement.textContent =
                votes;

            saveUpvotes(
                resourceName,
                votes
            );
        }
    );
}


// ========================================
// GET UPVOTES
// ========================================

function getUpvotes(resourceName) {

    const upvotes =
        JSON.parse(
            localStorage.getItem("upvotes")
        ) || {};


    return upvotes[resourceName] || 0;
}


// ========================================
// SAVE UPVOTES
// ========================================

function saveUpvotes(
    resourceName,
    count
) {

    const upvotes =
        JSON.parse(
            localStorage.getItem("upvotes")
        ) || {};


    upvotes[resourceName] =
        count;


    localStorage.setItem(
        "upvotes",
        JSON.stringify(upvotes)
    );
}


// ========================================
// LOAD SAVED RESOURCES
// ========================================

function loadResources() {

    const resources =
        JSON.parse(
            localStorage.getItem("resources")
        ) || [];


    resources.forEach(function (resource) {

        // Only add if not already in HTML
        if (!resourceAlreadyExists(resource.name)) {

            addResourceCard(resource);
        }
    });
}


// ========================================
// DARK / LIGHT MODE
// ========================================

if (themeToggle) {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent =
            "☀️ Light Mode";
    }


    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            if (
                document.body.classList.contains(
                    "dark-mode"
                )
            ) {

                localStorage.setItem(
                    "theme",
                    "dark"
                );

                themeToggle.textContent =
                    "☀️ Light Mode";

            } else {

                localStorage.setItem(
                    "theme",
                    "light"
                );

                themeToggle.textContent =
                    "🌙 Dark Mode";
            }
        }
    );
}


// ========================================
// START
// ========================================

// Prepare HTML cards
prepareExistingCards();

// Load only unique saved resources