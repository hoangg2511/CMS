const express = require("express");
const router = express.Router();

const homepageController = require("../controllers/homepageController");
const aboutController = require("../controllers/aboutController");
const newsController = require("../controllers/newsController");
const contactController = require("../controllers/contactController");

router.get("/homepage", homepageController.getHomepage);

router.get("/about", aboutController.getAboutUs);

router.get("/news", newsController.getNewsList);

router.get("/news/:slug", newsController.getNewsDetail);

router.get("/contact", contactController.getContact);

module.exports = router;
