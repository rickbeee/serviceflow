const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const services = require("./data/services");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", {
    pageTitle: "Home",
    featuredServices: services.slice(0, 4)
  });
});

app.get("/services", (req, res) => {
  const { category } = req.query;

  let filtered = services;

  if (category) {
    filtered = filtered.filter((s) => s.category === category);
  }

  res.render("services", {
    pageTitle: "Services",
    services: filtered,
    category
  });
});

app.get("/services/:slug", (req, res) => {
  const service = services.find((s) => s.slug === req.params.slug);

  if (!service) {
    return res.status(404).send("Service not found");
  }

  res.render("service-details", {
    pageTitle: service.name,
    service
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    pageTitle: "Contact",
    service: req.query.service
  });
});

app.post("/contact", (req, res) => {
  const { name, email, service, message } = req.body;

  console.log("New enquiry received:");
  console.log({
    name,
    email,
    service,
    message
  });

  res.render("thank-you", {
    pageTitle: "Message Sent",
    name,
    service
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});