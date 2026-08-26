const API_URL = "http://localhost:5000";


// ========================================
// LOAD ARTICLES
// ========================================

async function loadArticles() {

    const articleContainer =
        document.getElementById("articleContainer");

    try {

        const response = await fetch(
            `${API_URL}/api/posts`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch articles");
        }

        const posts = await response.json();

        articleContainer.innerHTML = "";

        if (posts.length === 0) {

            articleContainer.innerHTML = `
                <p class="loading">
                    No articles available yet.
                </p>
            `;

            return;
        }


        posts.slice(0, 6).forEach(post => {

            const articleCard =
                document.createElement("article");

            articleCard.className = "article-card";

            articleCard.innerHTML = `

                <div class="article-image">
                    ₹
                </div>

                <div class="article-content">

                    <span class="article-category">
                        ${post.category || "Finance"}
                    </span>

                    <h3>
                        ${post.title}
                    </h3>

                    <p>
                        ${post.content}
                    </p>

                    <div class="article-meta">

                        <span>
                            By ${post.author}
                        </span>

                        <a href="post.html?id=${post.id}">
                            Read →
                        </a>

                    </div>

                </div>
            `;

            articleContainer.appendChild(articleCard);

        });

    } catch (error) {

        console.error(
            "Error loading articles:",
            error
        );

        articleContainer.innerHTML = `
            <p class="loading">
                Unable to load articles.
                Please make sure the server is running.
            </p>
        `;
    }
}


// ========================================
// START
// ========================================

loadArticles();

// ========================================
// UPDATE NAVIGATION
// ========================================

function updateNavbar() {

    const navButtons =
        document.getElementById("navButtons");

    if (!navButtons) {
        return;
    }

    const token =
        localStorage.getItem("token");


    if (token) {

        navButtons.innerHTML = `

            <a
                href="create-post.html"
                class="write-blog-btn"
            >
                Write a Blog
            </a>

            <button
                id="logoutButton"
                class="logout-btn"
            >
                Logout
            </button>

        `;


        document
            .getElementById("logoutButton")
            .addEventListener(
                "click",
                logout
            );

    } else {

        navButtons.innerHTML = `

            <a
                href="login.html"
                class="login-btn"
            >
                Login
            </a>

            <a
                href="register.html"
                class="signup-btn"
            >
                Sign Up
            </a>

        `;

    }

}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem("token");

    window.location.href =
        "login.html";

}


updateNavbar();