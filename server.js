const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 9898;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the same folder

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/UserDB")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html")); // Adjusted
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html")); // Adjusted
});

// Handle Registration
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          //  return res.send("<h2>Email already exists! <a href='/login'>Login here</a></h2>");

          res.send(`
            <script>
                alert("User Saved Successfully! Please login.");
                window.location.href = "/login";
            </script>
        `);

        }

        const newUser = new User({ name, email, password });
        await newUser.save();
       
        res.send(`
            <script>
                alert("User Saved Successfully! Please login.");
                window.location.href = "/login";
            </script>
        `);

       // res.sendFile(path.join(__dirname, "login.html")); // Adjusted

    } catch (err) {
        res.status(500).send("Error registering user.");
    }
});

// Handle Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.password === password) {
           // res.sendFile(path.join(__dirname, "http://127.0.0.1:5500/iNUTON_BY_NUTAN.HTML")); // Adjusted

            
           res.send(`
            <script>
                
                window.location.href = "http://127.0.0.1:5500/iNUTON_BY_NUTAN.HTML";
            </script>
        `);

        } else {
           // res.send("<h2>Invalid Credentials. <a href='/login'>Try Again</a></h2>");

           res.send(`
            <script>
                alert("Invalid Credentials");
                window.location.href = "/login";
            </script>
        `);
        }
    } catch (err) {
        res.status(500).send("Error logging in.");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
