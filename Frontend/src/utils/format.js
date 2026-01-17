// utils/format.js
export const formatPrice = (price) => {
  if (price == null || isNaN(price)) return "—";
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
};
