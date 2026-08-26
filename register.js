const API_URL = "http://localhost:5000";


// ========================================
// REGISTER
// ========================================

const registerForm =
    document.getElementById("registerForm");


registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value.trim();

        const email =
            document.getElementById("email")
                .value.trim();

        const password =
            document.getElementById("password")
                .value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        const message =
            document.getElementById(
                "registerMessage"
            );


        // ================================
        // CHECK PASSWORD
        // ================================

        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        if (password.length < 6) {

            message.textContent =
                "Password must be at least 6 characters.";

            return;
        }


        message.textContent =
            "Creating your account...";


        try {

            const response =
                await fetch(
                    `${API_URL}/api/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
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
                    "Registration failed.";

                return;
            }


            message.textContent =
                "Registration successful!";


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";

        }

    }
);