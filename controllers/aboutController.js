const { AboutUsService } = require("../models/AboutUs");
const aboutUsService = new AboutUsService();

class AboutController {
  async getAboutUs(req, res) {
    try {
      const result = await aboutUsService.getAbout();
      return res.status(200).json({
        success: true,
        data: result.data,
        message: "Contact fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAdminAboutUs(req, res) {
    try {
      const result = await aboutUsService.getAdminAbout();

      return res.render("admin/about", {
        pageTitle: "About Us Management",
        aboutUs: result.data,
      });
    } catch (error) {
      console.error("Fetch data Error: ", error.message);
      return res.redirect("/admin/dashboard");
    }
  }
  async updateAboutUs(req, res) {
    try {
      const data = req.body;
      const result = await aboutUsService.updateAbout(data);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message || "Update failed",
        });
      } else {
        return res.status(200).json({
          success: true,
          data: result,
          message: result.message || "About Us updated successfully",
        });
      }
    } catch (error) {
      console.error("Update AboutUs Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
}

module.exports = new AboutController();
