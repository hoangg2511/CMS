const mongoose = require("mongoose");
const {
  readItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../config/database");
const { Schema } = mongoose;

const ContactSchema = new Schema({
  mainCampus: {
    address: { type: String, required: true, trim: true },
    phone: { type: String },
    email: { type: String },
    mapUrl: { type: String },
  },
  additionalOffices: [
    {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String },
      email: { type: String },
    },
  ],

  socialMediaLinks: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    youtube: { type: String },
  },

  contactFormSettings: {
    enabled: { type: Boolean, default: true },
    recipientEmail: { type: String },
    autoReplyEnabled: { type: Boolean, default: false },
    autoReplyMessage: { type: String },
  },

  businessHours: {
    weekdays: { type: String },
    weekends: { type: String },
  },

  tracking: {
    lastModified: { type: Date, default: Date.now },
  },
});
ContactSchema.pre("save", function (next) {
  this.tracking.lastModified = Date.now();
  next();
});

const ContactModel =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

class ContactService {
  constructor(model = ContactModel) {
    this.model = model;
  }

  async getContact() {
    try {
      const result = await readItem(this.model);
      return {
        success: true,
        data: result,
        message: "Contact retrieved successfully",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getAdminContact() {
    try {
      const result = await readItem(this.model);
      return {
        success: true,
        data: result,
        message: "Contact retrieved successfully",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateContact(data) {
    try {
      const result = await updateItem(this.model, data, {}, { new: true });
      return { success: true, data: result, message: "Update successful" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = { ContactService };
