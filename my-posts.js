const API_URL = "http://localhost:5000";

const token =
    localStorage.getItem("token");


// ========================================
// CHECK LOGIN
// ========================================

if (!token) {

    alert("Please login first.");

    window.location.href =
        "login.html";

}


// ========================================
// LOAD MY POSTS
// ========================================

async function loadMyPosts() {

    const container =
        document.getElementById(
            "myPostsContainer"
        );


    try {

        /*
         * We use the existing GET /api/posts
         * endpoint and filter the posts using
         * the logged-in user's ID.
         */

        const response =
            await fetch(
                `${API_URL}/api/posts`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load posts"
            );

        }


        const posts =
            await response.json();


        /*
         * Decode the JWT to get the user ID.
         */

        const payload =
            JSON.parse(
                atob(
                    token.split(".")[1]
                )
            );


        const userId =
            payload.id;


        const myPosts =
            posts.filter(
                post =>
                    post.user_id == userId
            );


        container.innerHTML = "";


        if (myPosts.length === 0) {

            container.innerHTML = `

                <div class="empty-posts">

                    <h3>
                        You haven't published any posts yet.
                    </h3>

                    <a
                        href="create-post.html"
                        class="write-blog-btn"
                    >
                        Write Your First Blog
                    </a>

                </div>

            `;

            return;
        }


        myPosts.forEach(post => {

            const card =
                document.createElement("article");

            card.className =
                "my-post-card";


            card.innerHTML = `

                <div class="my-post-content">

                    <span class="article-category">
                        ${post.category || "Finance"}
                    </span>

                    <h2>
                        ${post.title}
                    </h2>

                    <p>
                        ${post.content}
                    </p>

                    <small>
                        Published:
                        ${formatDate(post.created_at)}
                    </small>

                </div>


                <div class="my-post-actions">

                    <a
                        href="edit-post.html?id=${post.id}"
                        class="edit-btn"
                    >
                        Edit
                    </a>

                    <button
                        class="delete-btn"
                        onclick="deletePost(${post.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(error);

        container.innerHTML = `

            <p class="loading">
                Unable to load your posts.
            </p>

        `;

    }

}


// ========================================
// DELETE POST
// ========================================

async function deletePost(postId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/posts/${postId}`,
                {
                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete post."
            );

            return;
        }


        alert(
            "Post deleted successfully."
        );


        loadMyPosts();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}


// ========================================
// DATE
// ========================================

function formatDate(dateString) {

    return new Date(dateString)
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


// ========================================
// START
// ========================================

loadMyPosts();