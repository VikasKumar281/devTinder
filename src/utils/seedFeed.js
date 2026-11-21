const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../models/user");

const DUMMY_PASSWORD = "Dev@1234";

const people = [
  ["Aarav", "Mehta", 24, "male", "Builds React apps and likes late-night debugging.", ["React", "TypeScript"]],
  ["Sara", "Khan", 26, "female", "Backend engineer who cares about clean APIs.", ["Node", "MongoDB"]],
  ["Kabir", "Singh", 28, "male", "Full stack developer looking for project partners.", ["JavaScript", "Express"]],
  ["Meera", "Iyer", 23, "female", "UI engineer. I turn Figma into working screens.", ["CSS", "React"]],
  ["Rohan", "Das", 27, "male", "DevOps on weekdays, chess on weekends.", ["Docker", "AWS"]],
  ["Ananya", "Rao", 25, "female", "Learning system design and open source.", ["Python", "Django"]],
  ["Vivaan", "Joshi", 29, "male", "Mobile developer exploring web.", ["React Native", "JavaScript"]],
  ["Ishita", "Verma", 22, "female", "Data and dashboards. Always up for a hackathon.", ["SQL", "Python"]],
  ["Aisha", "Kapoor", 24, "female", "Product engineer who ships polished React apps.", ["React", "Figma"], 47],
  ["Diya", "Sharma", 26, "female", "Frontend lead. I care about motion and clean UI.", ["CSS", "React"], 45],
  ["Kiara", "Malhotra", 23, "female", "Mobile developer building smooth Android apps.", ["Kotlin", "Jetpack"], 44],
  ["Navya", "Reddy", 27, "female", "Backend engineer. APIs, queues, and calm on-call nights.", ["Node", "PostgreSQL"], 49],
  ["Pari", "Nair", 25, "female", "Design engineer. I sit between Figma and production.", ["UI", "TypeScript"], 48],
  ["Riya", "Banerjee", 22, "female", "Data scientist who likes clear charts and good questions.", ["Python", "ML"], 32],
  ["Saanvi", "Patel", 28, "female", "Full stack developer looking for a serious team.", ["JavaScript", "MongoDB"], 29],
  ["Tara", "Gill", 24, "female", "Security-minded developer. I review code before I merge it.", ["Node", "Auth"], 25],
  ["Zoya", "Qureshi", 26, "female", "DevOps engineer. I make deploys boring, in a good way.", ["Docker", "AWS"], 24],
  ["Myra", "Chopra", 23, "female", "Open source contributor. React by day, side projects by night.", ["React", "GraphQL"], 20],
];

const maleNames = ["Amit", "Rahul", "Nikhil", "Harsh", "Yash", "Aditya", "Karan", "Manish", "Siddharth", "Varun"];
const femaleNames = ["Neha", "Pooja", "Kavya", "Simran", "Anjali", "Nisha", "Priya", "Shreya", "Aditi", "Ritika"];
const lastNames = ["Sharma", "Gupta", "Patel", "Singh", "Khan", "Joshi", "Nair", "Reddy", "Das", "Mehta"];
const skillSets = [["React", "Node"], ["Python", "Django"], ["Java", "Spring"], ["UI", "Figma"], ["Go", "Docker"]];
const abouts = [
  "Software engineer who likes clean code and weekend hikes.",
  "Builds web apps and learns something new every week.",
  "Looking for a teammate who enjoys shipping products.",
  "Designer-developer who cares about small details.",
  "Backend engineer. Databases, APIs, and quiet mornings.",
];

for (let i = 0; i < 100; i += 1) {
  const female = i >= 50;
  const first = (female ? femaleNames : maleNames)[i % 10];
  const last = lastNames[i % 10] + (i + 1);
  people.push([
    first,
    last,
    21 + (i % 12),
    female ? "female" : "male",
    abouts[i % abouts.length],
    skillSets[i % skillSets.length],
    `https://randomuser.me/api/portraits/${female ? "women" : "men"}/${i % 100}.jpg`,
  ]);
}

const seed = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
  const password = await bcrypt.hash(DUMMY_PASSWORD, 10);
  let created = 0;

  for (const [index, person] of people.entries()) {
    const [firstName, lastName, age, gender, about, skills, photo] = person;
    const emailId = `${firstName}.${lastName}@devtinder.test`.toLowerCase();
    const exists = await User.findOne({ emailId });
    if (exists) continue;

    await User.create({
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
      photoUrl: String(photo || "").startsWith("http")
        ? photo
        : `https://i.pravatar.cc/600?img=${photo || index + 11}`,
    });
    created += 1;
  }

  const total = await User.countDocuments();
  console.log(`Added ${created} feed profiles. Users in database: ${total}`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
