const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.document = new JSDOM("/").window.document;

// //toggle icon navbar
// let menuIcon = document.querySelector("#menu-icon");
// let navbar = document.querySelector(".navbar");

// eventEmitter.on("click", function () {
//   menuIcon.classList.toggle("bx-x");
//   navbar.classList.toggle("active");
// });

// //scrool section
// let sections = document.querySelectorAll("section");
// let navLinks = document.querySelectorAll("header nav a");

// eventEmitter.on("scroll", () => {
//   sections.forEach((sec) => {
//     let top = rl.scrollY;
//     let offset = sec.offsetTop - 100;
//     let height = sec.offsetHeight;
//     let id = sec.getAttribute("id");

//     if (top >= offset && top < offset + height) {
//       // active nevbar
//       navLinks.forEach((links) => {
//         links.classList.remove("active");
//         document
//           .querySelector("header nav a[href*=" + id + "]")
//           .classList.add("active");
//       });
//       // active section for animation on scroll
//       sec.classList.add("show-animate");
//     }
//     //if you want to use animation repeat on scroll
//     else {
//       sec.classList.remove("show-animate");
//     }
//   });
//   let header = document.querySelector("header");

//   header.classList.toggle("sticky", window.scrollY > 100);

//   // remove toggle icon and nav bar when click navbar (scroll)
//   menuIcon.classList.remove("bx-x");
//   navbar.classList.remove("active");

//   // animation footer on scroll
//   let footer = document.querySelector("footer");
//   footer.classList.toggle(
//     "show-animate",
//     this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight
//   );
// });

app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/", function (req, res) {
  const Fname = req.body.Fname;
  const Phonenum = req.body.Phonenum;
  const message = req.body.message;
  const subject = req.body.subject;
  const emailAdd = req.body.Emailadd;
  const data = {
    members: [
      {
        email_address: emailAdd,
        status: "subscribed",
        merge_fields: {
          FNAME: Fname,
          PHONE: Phonenum,
          EMAILSUB: subject,
          MESSAGE: message,
        },
      },
    ],
  };

  app.post("/failure", function (req, res) {
    res.redirect("/");
  });

  const jasonData = JSON.stringify(data);
  const url = "https://us8.api.mailchimp.com/3.0/lists/1b2f70f74d";
  const options = {
    method: "POST",
    auth: "soufiane1:s4d4c261193a60c933328c256168c61d5-us8",
  };
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failed.html");
    }
  });
  request.write(jasonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running");
});

//API Key
// 4d4c261193a60c933328c256168c61d5-us8
//audience ID
// 1b2f70f74d
