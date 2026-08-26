const API_URL = "http://localhost:5000";


// ========================================
// CHECK LOGIN
// ========================================

const token =
    localStorage.getItem("token");


if (!token) {

    alert("Please login first.");

    window.location.href =
        "login.html";

}


// ========================================
// GET POST ID
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const postId =
    params.get("id");


if (!postId) {

    alert("Post ID is missing.");

    window.location.href =
        "my-posts.html";

}


// ========================================
// LOAD POST
// ========================================

async function loadPost() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/posts/${postId}`
            );


        const post =
            await response.json();


        if (!response.ok) {

            alert(
                post.message ||
                "Unable to load post."
            );

            window.location.href =
                "my-posts.html";

            return;
        }


        document.getElementById("title").value =
            post.title;


        document.getElementById("content").value =
            post.content;


        /*
         * Your backend returns category
         * as the category name.
         */

        if (post.category) {

            const categorySelect =
                document.getElementById(
                    "category"
                );


            const option =
                Array.from(
                    categorySelect.options
                ).find(
                    option =>
                        option.text === post.category
                );


            if (option) {

                categorySelect.value =
                    option.value;

            }

        }


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}


// ========================================
// UPDATE POST
// ========================================

const editPostForm =
    document.getElementById(
        "editPostForm"
    );


editPostForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "title"
            ).value.trim();


        const category =
            document.getElementById(
                "category"
            ).value;


        const content =
            document.getElementById(
                "content"
            ).value.trim();


        const message =
            document.getElementById(
                "editMessage"
            );


        if (!title || !category || !content) {

            message.textContent =
                "Please fill in all fields.";

            return;

        }


        message.textContent =
            "Updating article...";


        /*
         * IMPORTANT:
         *
         * Your backend expects category_id,
         * not the category name.
         *
         * For now we won't send category_id
         * from this form until we connect
         * the category table properly.
         */

        try {

            const response =
                await fetch(
                    `${API_URL}/api/posts/${postId}`,
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            title: title,

                            content: content

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Failed to update article.";

                return;

            }


            message.textContent =
                "Article updated successfully!";


            setTimeout(() => {

                window.location.href =
                    `post.html?id=${postId}`;

            }, 1000);


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";

        }

    }
);


// ========================================
// START
// ========================================

loadPost();