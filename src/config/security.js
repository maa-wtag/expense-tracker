import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import cookieParser from "cookie-parser";
import csurf from "csurf";

export const applySecurity = (app) => {
  // Prevent NoSQL injection
  app.use(mongoSanitize());
  // Prevent XSS attacks
  app.use(xssClean());
  // CSRF protection
  app.use(cookieParser());
  app.use(csurf({ cookie: true }));
  // Provide CSRF token endpoint
  app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });
};
