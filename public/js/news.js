document.addEventListener("DOMContentLoaded", () => {
  // Lấy dữ liệu từ localStorage nếu window không có
  if (!window.newsList) {
    const savedData = localStorage.getItem("newsList");
    window.newsList = savedData ? JSON.parse(savedData) : [];
  }
  console.log("Dữ liệu newsList hiện tại:", window.newsList);
});

// Hàm thu thập dữ liệu từ Form
function getFormData() {
  const getValue = (n) => document.querySelector(`[name="${n}"]`)?.value || "";
  const getChecked = (n) =>
    document.querySelector(`[name="${n}"]`)?.checked || false;

  return {
    basicInfo: {
      title: getValue("title"),
      featuredImage: getValue("image"),
      teaser: getValue("teaser"),
      content: getValue("content"),
    },
    categorization: {
      category: getValue("category"),
      tags: getValue("tags")
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    },
    author: {
      name: getValue("authorName"),
      email: getValue("authorEmail"),
    },
    status: getValue("status"),
    featured: getChecked("featured"), // Checkbox ghim trang chủ
    seo: {
      metaTitle: getValue("metaTitle"),
      metaDescription: getValue("metaDescription"),
    },
  };
}

// Kiểm tra logic tối đa 3 bài ghim
function validateFeaturedLimit(id = null) {
  const isFeatured = document.querySelector('[name="featured"]')?.checked;
  if (!isFeatured) return true; // Không ghim thì không cần check

  const featuredCount = window.newsList.filter(
    (n) => n.featured === true || n.featured === "true"
  ).length;
  const isAlreadyFeatured = id
    ? window.newsList.some(
        (n) => n._id === id && (n.featured === true || n.featured === "true")
      )
    : false;

  if (featuredCount >= 3 && !isAlreadyFeatured) {
    alert(
      "Đã có 3 bài viết được ghim trên trang chủ. Vui lòng gỡ bài khác trước!"
    );
    return false;
  }
  return true;
}

async function handleSaveNews(btn) {
  const id = btn.dataset.id;
  const form = $("#FormData")[0];

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Check logic 3 bài
  if (!validateFeaturedLimit(id)) return;

  const data = getFormData();
  const url = id ? `/admin/news/update/${id}` : `/admin/news/create`;
  const method = id ? "PUT" : "POST";

  try {
    // 1. Lưu tin tức
    const newsRes = await $.ajax({
      url,
      type: method,
      contentType: "application/json",
      data: JSON.stringify(data),
    });

    if (newsRes.success) {
      const newsId = newsRes.data?._id || id;

      // 2. Nếu có ghim, cập nhật bản nháp Homepage
      if (data.featured) {
        await $.ajax({
          url: "/admin/homepage/update",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({ _id: newsId }), // Gửi ID để toggle trong mảng news
        });
      }

      alert("Lưu tin tức thành công!");
      window.location.href = "/admin/news";
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Lỗi server: " + (error.responseJSON?.message || error.message));
  }
}

function deleteNews(id) {
  if (!id || !confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

  $.ajax({
    url: "/admin/news/delete/" + id,
    type: "DELETE",
    success: function (res) {
      if (res.success) {
        alert("Xóa thành công");
        location.reload();
      }
    },
  });
}
