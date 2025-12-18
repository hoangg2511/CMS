const { AboutUsService } = require("../models/AboutUs");
const aboutUsService = new AboutUsService();

class AboutController {
  async about(req, res) {
    res.render("admin/about", {
      pageTitle: "About Us",
    });
  }

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
        pageTitle: "Quản lý Trang Về Chúng Tôi",
        aboutUsPages: result.data,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu About Us:", error.message);
      return res.redirect("/admin/dashboard");
    }
  }
  async updateAboutUs(req, res) {
    console.log("Dữ liệu nhận được tại Backend:", req.body);
    try {
      const data = req.body;
      const id = data._id;
      console.log("ID nhận được để cập nhật:", id);
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Form Invalid ID",
        });
      }

      const result = await aboutUsService.updateAbout(data, id);
      return res.status(200).json({
        success: true,
        data: result,
        message: result.message || "About Us updated successfully",
      });
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
