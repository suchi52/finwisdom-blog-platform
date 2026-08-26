const API_URL = "http://localhost:5000";


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        const message =
            document.getElementById("loginMessage");


        message.textContent = "Logging in...";


        try {

            const response =
                await fetch(
                    `${API_URL}/api/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Login failed.";

                return;
            }


            // SAVE JWT TOKEN

            localStorage.setItem(
                "token",
                data.token
            );


            message.textContent =
                "Login successful!";


            // GO TO HOMEPAGE

            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 800);


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";

        }

    }
);