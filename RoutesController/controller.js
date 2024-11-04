require("dotenv").config();
const { mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requestModel = require("../models/request");
const userModel = require("../models/users");
const popularModel = require("../models/popular");
const machineModel = require("../models/machine");
const chemicalModel = require("../models/chemicals");
const seedsModel = require("../models/seeds");
const contactModel = require("../models/contact");

const salt = bcrypt.genSaltSync(10);
const secret = "asdasdasdasds";

//new user registration

const registerUser = async (req, res) => {
  const { fullnames, phonenumber, email, password } = req.body;

  if (!fullnames || !phonenumber || !email || !password) {
    return res.status(422).json({ error: "Check for missing field/fields" });
  }

  try {
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      // res.send({ message: "Username Already Exist !!!" });
      return res.status(422).json({ error: "Email already Exist" });
    }
    const newUser = await userModel.create({
      fullnames,
      phonenumber,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(200).json({
      newUser,
      message: `welcome ${newUser.fullnames}..Please login to proceed`,
    });
  } catch (err) {
    res.status(400).json({ error: "server error" });
  }
};
//login functionality

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "missing email or password" });
  }

  try {
    const logged = await userModel.findOne({ email });

    // Check if the user exists
    if (!logged) {
      return res.status(401).json({ error: "User does not exist" });
    }

    // Compare the password with the hashed password stored in DB
    const passOk = bcrypt.compareSync(password, logged.password);

    if (!passOk) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // Sign the JWT
    jwt.sign(
      { email, fullnames: logged.fullnames, id: logged._id },
      secret,
      {},
      (err, token) => {
        if (err) throw err;

        // Send the token as a cookie and respond with user details
        res.cookie("token", token, { httpOnly: true }).json(logged);
      }
    );
  } catch (error) {
    // Catch any unexpected errors
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userProfile = (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, secret, {}, (err, userInfo) => {
      if (err) throw err;
      res.status(200).json(userInfo);
    });
  } catch (err) {
    res.json(err);
  }
};

//logout functionality

const logout = (req, res) => {
  // Clear the token cookie by setting it to an empty string and expiring it immediately
  res.cookie("token", "", {
    httpOnly: true, // Ensure it's an HTTP-only cookie (not accessible by JavaScript)
    expires: new Date(0), // Expire the cookie immediately
    sameSite: "strict", // Enforce same-site policy (helps with CSRF protection)
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  });

  // Respond with a success message
  res.json({ message: "Logged out successfully" });
};

//product request functionality

const postReqProduct = async (req, res) => {
  const { product, variety, quantity } = req.body;
  if (!product || !variety || !quantity) {
    return res.status(400).json({ error: "missing filled" });
  }
  try {
    const userDoc = await requestModel.create({
      product,
      variety,
      quantity,
    });
    if (!userDoc) {
      res.status(400).json({ error: "Server Error" });
    }

    res.status(200).json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
};

const requestCart = async (req, res) => {
  try {
    const { userID } = req.params;

    // console.log("Received request for userID:", userID);
    const userId = new mongoose.Types.ObjectId(userID);
    // console.log("converted:", userId);

    const posts = await requestModel.find({ _id: userId });

    // console.log(posts);
    if (!posts) {
      return res.status(404).json({ error: "No posts found for this user" });
    }

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchPopulars = async (req, res) => {
  try {
    const data = await popularModel.find({});
    if (!data) {
      res.status(400).json({ error: "Server error" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchChemicals = async (req, res) => {
  try {
    const data = await chemicalModel.find({});
    if (!data) {
      res.status(400).json({ error: "Server error" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchChemicalDetails = async (req, res) => {
  const { id } = req.params;

  // console.log("Chemical ID received:", id);

  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }

  try {
    const product = await chemicalModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "No details found for the provided ID" });
    }

    // Return the product details
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching chemical details:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchMachine = async (req, res) => {
  try {
    const data = await machineModel.find({});

    if (!data) {
      return res.status(400).json({ error: "No data found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const fetchSeeds = async (req, res) => {
  try {
    const data = await seedsModel.find({});
    if (!data) {
      res.status(400).json({ error: "Server error" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

const search = async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ message: "No search term provided" });
  }

  try {
    const results = await chemicalModel.find({
      name: { $regex: searchTerm, $options: "i" },
    });
    const results2 = await seedsModel.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    if (results.length === 0 && results2.length === 0) {
      return res.status(404).json({ message: "No results found" });
    }

    res.status(200).json(results.concat(results2));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const contact = async (req, res) => {
  const { name, userEmail, message } = req.body;

  if (!name || !userEmail || !message) {
    return res.status(400).json({ error: "missing input field" });
  }

  try {
    const mssg = await contactModel.create({
      name,
      userEmail,
      message,
    });

    if (!mssg) {
      return res.status(400).json({ error: "Please try again" });
    }

    res.status(200).json(mssg);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  requestCart,
  postReqProduct,
  userLogin,
  userProfile,
  logout,
  fetchPopulars,
  fetchChemicals,
  fetchChemicalDetails,
  fetchMachine,
  fetchSeeds,
  search,
  contact,
};
