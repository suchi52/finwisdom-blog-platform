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
// LOAD CATEGORIES
// ========================================

async function loadCategories() {

    const categorySelect =
        document.getElementById("category");


    try {

        const response =
            await fetch(
                `${API_URL}/api/categories`
            );


        const categories =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Failed to load categories"
            );

        }


        categorySelect.innerHTML = `
            <option value="">
                Select a category
            </option>
        `;


        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value =
                category.id;

            option.textContent =
                category.name;

            categorySelect.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(error);

        categorySelect.innerHTML = `
            <option value="">
                Unable to load categories
            </option>
        `;

    }

}


// ========================================
// CREATE POST
// ========================================

const createPostForm =
    document.getElementById(
        "createPostForm"
    );


createPostForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "title"
            ).value.trim();


        const categoryId =
            document.getElementById(
                "category"
            ).value;


        const content =
            document.getElementById(
                "content"
            ).value.trim();


        const message =
            document.getElementById(
                "postMessage"
            );


        if (!title || !categoryId || !content) {

            message.textContent =
                "Please fill in all fields.";

            return;

        }


        message.textContent =
            "Publishing article...";


        try {

            const response =
                await fetch(
                    `${API_URL}/api/posts`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            title: title,

                            content: content,

                            category_id:
                                Number(categoryId)

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Unable to publish article.";

                return;

            }


            message.textContent =
                "Article published successfully!";


            createPostForm.reset();


            setTimeout(() => {

                window.location.href =
                    "index.html";

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

loadCategories();