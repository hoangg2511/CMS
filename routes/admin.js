const express = require("express");
const router = express.Router();

const homepageController = require("../controllers/homepageController");
const aboutController = require("../controllers/aboutController");
const newsController = require("../controllers/newsController");
const contactController = require("../controllers/contactController");

// //Admin Routes Homepage
router.get("/", homepageController.dashboard);
router.get("/homepage", homepageController.getAdminHomepage);
router.post("/homepage/update", homepageController.updateHomepage);
router.post("/homepage/publish", homepageController.publishHomepage);

// //Admin Routes About Us
router.get("/about", aboutController.getAdminAboutUs);
router.post("/about/update", aboutController.updateAboutUs);

// //Admin Routes Contact
router.get("/contact", contactController.getAdminContact);
router.post("/contact/update", contactController.updateContact);

// //Admin Routes News
router.get("/news", newsController.getAdminNewsList);
router.get("/news/create", newsController.getNewsForm);
router.get("/news/edit/:id", newsController.getNewsForm);
router.post("/news/create", newsController.createNews);
router.put("/news/update/:id", newsController.updateNews);
router.delete("/news/delete/:id", newsController.deleteNews);

module.exports = router;
