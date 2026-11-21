const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../models/user");

const DUMMY_PASSWORD = "Dev@1234";

const maleFirst = [
  "Aarav", "Rohan", "Kabir", "Vivaan", "Aditya", "Arjun", "Ishaan", "Reyansh", "Shaurya", "Atharv",
  "Krish", "Dhruv", "Ayaan", "Vihaan", "Kartik", "Nikhil", "Rahul", "Amit", "Harsh", "Yash",
  "Karan", "Manish", "Siddharth", "Varun", "Rohan", "Dev", "Ankit", "Rajat", "Saurabh", "Tushar",
  "Mohit", "Gaurav", "Pranav", "Neel", "Aryan", "Kunal", "Rishi", "Samar", "Yuvraj", "Laksh",
  "Om", "Parth", "Raghav", "Shivansh", "Tanmay", "Uday", "Vedant", "Abhinav", "Chirag", "Darsh",
  "Farhan", "Harshil", "Ishan", "Jai", "Kabir", "Lalit", "Mihir", "Naman", "Piyush", "Rudra",
];

const femaleFirst = [
  "Sara", "Meera", "Ananya", "Ishita", "Aisha", "Diya", "Kiara", "Navya", "Pari", "Riya",
  "Saanvi", "Tara", "Zoya", "Myra", "Neha", "Pooja", "Kavya", "Simran", "Anjali", "Nisha",
  "Priya", "Shreya", "Aditi", "Ritika", "Aarohi", "Avni", "Bhavya", "Charvi", "Esha", "Fatima",
  "Gauri", "Hina", "Ira", "Jiya", "Kritika", "Lavanya", "Mahika", "Nandini", "Ojasvi", "Prisha",
  "Radhika", "Sia", "Trisha", "Urvi", "Vanya", "Wamiqa", "Yashika", "Zara", "Aanya", "Inaaya",
  "Mira", "Noor", "Pihu", "Rhea", "Sanya", "Tanya", "Uma", "Vedika", "Wisha", "Zaina",
];

const lastNames = [
  "Mehta", "Khan", "Singh", "Iyer", "Das", "Rao", "Joshi", "Verma", "Kapoor", "Sharma",
  "Malhotra", "Reddy", "Nair", "Banerjee", "Patel", "Gill", "Qureshi", "Chopra", "Gupta", "Bhat",
  "Agarwal", "Chawla", "Desai", "Fernandes", "Ghosh", "Hegde", "Iqbal", "Jain", "Kaul", "Lal",
  "Menon", "Naik", "Oberoi", "Pillai", "Raina", "Saxena", "Trivedi", "Uppal", "Vyas", "Yadav",
];

const skillSets = [
  ["React", "TypeScript", "Node.js"],
  ["Node.js", "MongoDB", "Express"],
  ["Python", "Django", "PostgreSQL"],
  ["Java", "Spring", "Kafka"],
  ["React Native", "JavaScript", "Firebase"],
  ["UI", "Figma", "CSS"],
  ["Go", "Docker", "Kubernetes"],
  ["AWS", "Terraform", "Linux"],
  ["GraphQL", "React", "Apollo"],
  ["Next.js", "Tailwind", "Vercel"],
  ["Flutter", "Dart", "Firebase"],
  ["ML", "Python", "Pandas"],
  ["SQL", "dbt", "Python"],
  ["Swift", "iOS", "UIKit"],
  ["Kotlin", "Android", "Jetpack"],
  ["C#", ".NET", "Azure"],
  ["PHP", "Laravel", "MySQL"],
  ["Rust", "WebAssembly", "Linux"],
  ["Redis", "Node.js", "Microservices"],
  ["Cybersecurity", "Auth", "Node.js"],
];

const maleAbouts = [
  "Full stack engineer who ships React and Node apps on weekends.",
  "Backend developer. Clean APIs, indexes, and on-call that stays quiet.",
  "Mobile engineer exploring web. Always up for a weekend hackathon.",
  "DevOps by day, chess by night. I like boring deploys.",
  "Product engineer. I care about the last 10% of polish.",
  "Open source contributor looking for a serious side-project teammate.",
  "System design nerd. Distributed systems and strong coffee.",
  "Data engineer who turns messy logs into dashboards people actually use.",
  "Security-minded developer. I review the auth flow before I merge.",
  "Builds SaaS MVPs fast and talks honestly about tradeoffs.",
];

const femaleAbouts = [
  "Frontend lead. Motion, accessibility, and screens that feel fast.",
  "Backend engineer who cares about clean contracts and tests.",
  "Design engineer sitting between Figma and production CSS.",
  "Data scientist. Clear charts, better questions, no mystery metrics.",
  "Full stack developer looking for people who actually ship.",
  "Mobile developer building smooth Android and iOS apps.",
  "DevOps engineer. Pipelines, alerts, and zero-drama releases.",
  "Product engineer. React by day, side projects by night.",
  "ML engineer exploring applied NLP for developer tools.",
  "UI engineer who turns messy briefs into working interfaces.",
];

const people = [];

const pushPerson = (firstName, lastName, gender, index) => {
  const female = gender === "female";
  const abouts = female ? femaleAbouts : maleAbouts;
  const photo = `https://randomuser.me/api/portraits/${female ? "women" : "men"}/${index % 100}.jpg`;
  people.push({
    firstName,
    lastName,
    age: 21 + ((index * 3) % 14),
    gender,
    about: abouts[index % abouts.length],
    skills: skillSets[index % skillSets.length],
    photoUrl: photo,
    emailId: `${firstName}.${lastName}${index}@devtinder.test`.toLowerCase(),
  });
};

for (let i = 0; i < 60; i += 1) {
  pushPerson(maleFirst[i % maleFirst.length], lastNames[i % lastNames.length], "male", i);
}
for (let i = 0; i < 60; i += 1) {
  pushPerson(femaleFirst[i % femaleFirst.length], lastNames[(i + 7) % lastNames.length], "female", i);
}

const seed = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
  const password = await bcrypt.hash(DUMMY_PASSWORD, 10);
  let created = 0;

  for (const person of people) {
    const exists = await User.findOne({ emailId: person.emailId });
    if (exists) {
      exists.age = person.age;
      exists.gender = person.gender;
      exists.about = person.about;
      exists.skills = person.skills;
      exists.photoUrl = person.photoUrl;
      await exists.save();
      continue;
    }

    await User.create({
      firstName: person.firstName,
      lastName: person.lastName,
      emailId: person.emailId,
      password,
      age: person.age,
      gender: person.gender,
      about: person.about,
      skills: person.skills,
      photoUrl: person.photoUrl,
    });
    created += 1;
  }

  const total = await User.countDocuments();
  const men = await User.countDocuments({ gender: "male" });
  const women = await User.countDocuments({ gender: "female" });
  console.log(`Added ${created} new test profiles (password: ${DUMMY_PASSWORD}).`);
  console.log(`Users in database: ${total} (male ${men}, female ${women})`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
