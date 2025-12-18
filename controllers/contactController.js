const { ContactService } = require("../models/Contact");
const contactService = new ContactService();

class ContactController {
  async contact(req, res) {
    res.render("admin/contact", {
      pageTitle: "Contact Us",
    });
  }
  async getContact(req, res) {
    try {
      const result = await contactService.getContact();
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

  async getAdminContact(req, res) {
    try {
      const result = await contactService.getAdminContact();
      return res.render("admin/contact", {
        pageTitle: "Contact Management",
        contact: result.data || {},
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateContact(req, res) {
    try {
      const data = req.body;
      const result = await contactService.updateContact(data);
      return res.status(200).json({
        success: true,
        data: result.data,
        message: "Contact updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ContactController();
