module.exports.getErrorMessage = (error) => {
  const fields = new Map([["tel", "Số điện thoại"], ["email", "Email"], ["name", "Tên công ty"]]);
    switch (error.code) {
      case 11000:
        const fieldDuplicate = Object.keys(error.keyPattern).join("");
        return `${fields.get(fieldDuplicate)} đã tồn tại!`;

      default:
        return "An unknown error";
    }
}