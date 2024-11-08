const express = require("express");
const router = express.Router();

const {
  registerUser,
  requestCart,
  postReqProduct,
  userLogin,
  userProfile,
  logout,
  fetchPopulars,
  fetchChemicals,
  fetchChemicalDetails,
  fetchSeeds,
  search,
  fetchMachine,
  contact,
} = require("../RoutesController/controller");

router.post("/request", postReqProduct);
router.get("/requestcart/:userID", requestCart);
router.get("/profile", userProfile);
router.get("/fetchPopulars", fetchPopulars);
router.get("/fetchChemicals", fetchChemicals);
router.get("/fetchSeeds", fetchSeeds);
router.get("/search", search);
router.get("/fetchMachine", fetchMachine);
router.get("/fetchChemicalDetails/:id", fetchChemicalDetails);
router.post("/contact", contact);

module.exports = router;
