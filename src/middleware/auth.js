export function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token provided" });

  next();
}
