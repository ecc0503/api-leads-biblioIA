export function validateLead(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name, email are required.",
    });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Invalid name.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email.",
    });
  }

  next();
}