const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const expressLayouts = require("express-ejs-layouts");
const services = require("./data/services");

const app = express();
const PORT = process.env.PORT || 3000;

const ENQUIRIES_FILE = path.join(__dirname, "data", "enquiries.json");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanInput(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactForm({ name, email, service, message }) {
  const errors = [];

  if (!name) {
    errors.push("Name is required.");
  }

  if (!email) {
    errors.push("Email is required.");
  } else if (!isValidEmail(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (service.length > 100) {
    errors.push("Service name is too long.");
  }

  if (!message) {
    errors.push("Message is required.");
  }

  if (message.length > 1000) {
    errors.push("Message is too long.");
  }

  return errors;
}

async function saveEnquiry(enquiry) {
  let enquiries = [];

  try {
    const fileContent = await fs.readFile(ENQUIRIES_FILE, "utf8");
    enquiries = JSON.parse(fileContent);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  enquiries.push(enquiry);

  await fs.writeFile(
    ENQUIRIES_FILE,
    JSON.stringify(enquiries, null, 2),
    "utf8"
  );
}

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

app.post("/contact", async (req, res) => {
  const enquiry = {
    name: cleanInput(req.body.name),
    email: cleanInput(req.body.email),
    service: cleanInput(req.body.service),
    message: cleanInput(req.body.message),
    receivedAt: new Date().toISOString()
  };

  const errors = validateContactForm(enquiry);

  if (errors.length > 0) {
    return res.status(400).send(errors.join(" "));
  }

  try {
    await saveEnquiry(enquiry);

    console.log("New enquiry received:");
    console.log(enquiry);

    res.render("thank-you", {
      pageTitle: "Message Sent",
      name: enquiry.name,
      service: enquiry.service
    });
  } catch (error) {
    console.error("Failed to save enquiry:", error);

    res.status(500).send("Something went wrong. Please try again later.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});