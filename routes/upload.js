const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/image", (req, res) => {
  // 1. Thực thi multer upload
  upload.single("image")(req, res, (err) => {
    // 2. Xử lý lỗi từ Multer (ví dụ: file quá lớn, sai định dạng)
    if (err) {
      console.error("Multer Error:", err);
      return res.status(400).json({
        success: false,
        message: `Lỗi upload: ${err.message}`,
      });
    }

    // 3. Kiểm tra xem file có thực sự tồn tại không
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Bạn chưa chọn file hoặc tên field (key) không phải là 'image'",
      });
    }

    // 4. Trả về thông tin file thành công
    // Gợi ý: Trả về cả đường dẫn tương đối để dễ lưu vào DB
    return res.status(200).json({
      success: true,
      message: "Tải ảnh lên thành công",
      url: req.file.filename, // Chỉ lấy tên file
      fullUrl: `/uploads/${req.file.filename}`, // URL để hiển thị ngay ở frontend
      filename: req.file.filename,
    });
  });
});

router.post("/images", (req, res) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const files = req.files.map((file) => ({
      url: `${file.filename}`,
      filename: file.filename,
    }));

    return res.json({
      success: true,
      message: "Files uploaded successfully",
      files,
    });
  });
});

module.exports = router;
