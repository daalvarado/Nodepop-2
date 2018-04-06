const express = require("express");
const router = express.Router();
const adsController = require("../controllers/adsController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const apiController = require("../controllers/apiController");
const photoClient = require("../lib/photoClient");

const { catchErrors } = require("../handlers/errorHandlers");

router.get("/", catchErrors(adsController.homePage));
router.get("/table", catchErrors(adsController.getAdsTable));
router.get("/ads", catchErrors(adsController.getAds));
router.get("/ads/page/:page", catchErrors(adsController.getAds));
router.get("/tags", catchErrors(adsController.getTags));
router.get("/tags/:tag", catchErrors(adsController.getTags));
router.get("/ads/en", catchErrors(adsController.english));
router.get("/ads/es", catchErrors(adsController.spanish));
router.get("/ads/:id/edit", catchErrors(adsController.editAd));

// Register - Login - Logout
router.get("/register", userController.registerForm);
router.post(
  "/register",
  userController.validateRegister,
  catchErrors(userController.register),
  catchErrors(authController.loginJWT)
);
router.get("/authenticate", userController.loginForm);
router.post("/authenticate", authController.loginJWT);
router.get("/logout", authController.logout);

// Links that need authorization
router.get("/add", authController.isLoggedIn, adsController.addAd);
router.post(
  "/add",
  adsController.upload,
  catchErrors(photoClient.resize),
  catchErrors(photoClient.thumbnail),
  catchErrors(adsController.createAd)
);
router.post(
  "/add/:id",
  adsController.upload,
  catchErrors(adsController.resize),
  catchErrors(adsController.updateAd)
);
router.get(
  "/api/ads",
  authController.isLoggedIn,
  catchErrors(apiController.apiAds)
);
router.get(
  "/api/users",
  authController.isLoggedIn,
  catchErrors(apiController.apiUsers)
);



module.exports = router;
