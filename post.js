const API_URL = "http://localhost:5000";


// ========================================
// GET POST ID FROM URL
// ========================================

const params = new URLSearchParams(
    window.location.search
);

const postId = params.get("id");


// ========================================
// LOAD POST
// ========================================

async function loadPost() {

    const postContainer =
        document.getElementById("postContainer");


    if (!postId) {

        postContainer.innerHTML = `
            <p class="loading">
                Article not found.
            </p>
        `;

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/api/posts/${postId}`
        );


        if (!response.ok) {

            throw new Error(
                "Article not found"
            );

        }


        const post = await response.json();


        document.title =
            `${post.title} | FinWisdom`;


        postContainer.innerHTML = `

            <article class="single-post">

                <div class="post-category">

                    ${post.category || "Finance"}

                </div>


                <h1>
                    ${post.title}
                </h1>


                <div class="post-meta">

                    <span>
                        By ${post.author}
                    </span>

                    <span>
                        ${formatDate(post.created_at)}
                    </span>

                </div>


                <div class="post-image">

                    ₹

                </div>


                <div class="post-content">

                    <p>
                        ${post.content}
                    </p>

                </div>

            </article>

        `;


        loadComments();

    } catch (error) {

        console.error(error);

        postContainer.innerHTML = `

            <p class="loading">
                Unable to load this article.
            </p>

        `;

    }

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ========================================
// LOAD COMMENTS
// ========================================

async function loadComments() {

    const commentsContainer =
        document.getElementById(
            "commentsContainer"
        );


    try {

        const response = await fetch(
            `${API_URL}/api/comments/post/${postId}`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load comments"
            );

        }


        const comments =
            await response.json();


        commentsContainer.innerHTML = "";


        if (comments.length === 0) {

            commentsContainer.innerHTML = `

                <p class="no-comments">
                    No comments yet.
                    Be the first to share your thoughts.
                </p>

            `;

            return;
        }


        comments.forEach(comment => {

            const commentElement =
                document.createElement("div");


            commentElement.className =
                "comment-card";


            commentElement.innerHTML = `

                <div class="comment-avatar">
                    ${comment.author
                        .charAt(0)
                        .toUpperCase()}
                </div>


                <div class="comment-body">

                    <div class="comment-top">

                        <strong>
                            ${comment.author}
                        </strong>

                        <span>
                            ${formatDate(
                                comment.created_at
                            )}
                        </span>

                    </div>


                    <p>
                        ${comment.content}
                    </p>

                </div>

            `;


            commentsContainer.appendChild(
                commentElement
            );

        });


    } catch (error) {

        console.error(error);

        commentsContainer.innerHTML = `

            <p class="no-comments">
                Unable to load comments.
            </p>

        `;

    }

}


// ========================================
// ADD COMMENT
// ========================================

document
    .getElementById("commentButton")
    .addEventListener(
        "click",
        async () => {

            const commentInput =
                document.getElementById(
                    "commentInput"
                );

            const message =
                document.getElementById(
                    "commentMessage"
                );


            const content =
                commentInput.value.trim();


            if (!content) {

                message.textContent =
                    "Please write a comment.";

                return;
            }


            const token =
                localStorage.getItem("token");


            if (!token) {

                message.textContent =
                    "Please login to comment.";

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/comments`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                content: content,
                                post_id: postId
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        "Unable to add comment.";

                    return;
                }


                commentInput.value = "";

                message.textContent =
                    "Comment added successfully!";


                loadComments();


            } catch (error) {

                console.error(error);

                message.textContent =
                    "Server error.";

            }

        }
    );


// ========================================
// START
// ========================================

loadPost();