const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

// Secret key
const JWT_SECRET_KEY = "Aditya";


// LOGIN API


app.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Check username and password
    if (username === "Aditya" && password === "qwertyuiop") {

        // Create JWT token
        const token = jwt.sign(
            { username: username },
            JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        // Show token in VS Code terminal
        console.log("Your Token is:", token);

        // Send token to frontend
        res.status(200).json({
            message: "Login Successful",
            token: token
        });

    } else {

        res.status(401).json({
            message: "Invalid Credentials"
        });

    }
});



// JWT MIDDLEWARE


const verifyToken = (req, res, next) => {

    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token is required"
        });
    }

    // Example:
    // Authorization: Bearer eyJhbGci...

    const token = authHeader.split(" ")[1];

    try {

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        // Store decoded information in request
        req.user = decoded;

        // Move to next function
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
};



// PROTECTED HOME API


app.get("/home", verifyToken, (req, res) => {

    res.status(200).json({
        message: "Welcome to Home Page",
        user: req.user
    });

});



// SERVER


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});