const { render } = require("ejs");
const { HomepageService } = require("../models/Homepage");

const homePageService = new HomepageService();

class HomePageController {
  async dashboard(req, res) {
    res.render("admin/dashboard", {
      pageTitle: "Dashboard",
    });
  }
  async homepage(req, res) {
    res.render("admin/homepage", {
      pageTitle: "Homepage",
    });
  }

  async getHomepage(req, res) {
    try {
      const result = await homePageService.getPublishedHomepage();

      return res.status(200).json({
        success: true,
        data: result,
        message: "Homepage fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAdminHomepage(req, res) {
    try {
      const result = await homePageService.getHomepage();

      const homepage = result?.data;

      return res.render("admin/homepage", {
        pageTitle: "Homepage Management",
        homepage: homepage || {}, // nếu chưa có document, dùng object rỗng
      });
    } catch (error) {
      console.error("Lỗi khi tải trang chủ admin:", error);
      return res.status(500).render("admin/error", {
        pageTitle: "Lỗi",
        message: "Không thể tải dữ liệu Trang chủ: " + error.message,
      });
    }
  }

  async updateHomepage(req, res) {
    try {
      const body = req.body;

      const homepageData = {
        heroSection: body.heroSection,
        whoWeAreSection: body.whoWeAreSection,
        visionMissionPhilosophySection: body.visionMissionPhilosophySection,
        whyChooseLAMSSection: body.whyChooseLAMSSection,
        accreditationSection: body.accreditationSection,
        featuredNewsSection: body.featuredNewsSection,
        seoMetaTag: body.seoMetaTag,

        lastModified: new Date(),
      };

      const result = await homePageService.updateHomepage(homepageData);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message || "Failed to update homepage",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Homepage updated successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("Update homepage error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async publishHomepage(req, res) {
    try {
      const result = await homePageService.publishHomepage();

      return res.status(200).json({
        success: true,
        message: "Homepage published successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new HomePageController();
