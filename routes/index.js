const express = require("express");
const router = express.Router();
const adsController = require("../controllers/adsController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const apiController = require("../controllers/apiController");

const { catchErrors } = require("../handlers/errorHandlers");

router.get("/", catchErrors(adsController.homePage));
router.get("/table", catchErrors(adsController.getAdsTable));
router.get("/ads", catchErrors(adsController.getAds));
router.get("/ads/page/:page", catchErrors(adsController.getAds));
router.get("/tags", catchErrors(adsController.getTags));
router.get("/tags/:tag", catchErrors(adsController.getTags));
router.get("/ads/en", catchErrors(adsController.english));
router.get("/ads/es", catchErrors(adsController.spanish));
router.get("/api/ads", authController.isLoggedIn, catchErrors(apiController.apiAds));
router.get(
  "/api/users",
  authController.isLoggedIn,
  catchErrors(apiController.apiUsers)
);
router.get("/add", authController.isLoggedIn, adsController.addAd);
router.post( 
  "/add",
  adsController.upload,
  catchErrors(adsController.resize),
  catchErrors(adsController.createAd)
);
router.get("/register", userController.registerForm);
router.post("/register", userController.validateRegister, catchErrors(userController.register), catchErrors(authController.login));
router.get('/logout', authController.logout);
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get("/test/", userController.test);
module.exports = router;
