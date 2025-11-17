const mongoose = require("mongoose");
require("dotenv").config();
const Event = require("./models/Event");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/communityevents";

const sampleEvents = [
  {
    title: "Community Cleanup Day",
    date: "December 12, 2025",
    time: "10:00 AM",
    location: "Riverside, Trinidad, Bohol",
    category: "Community",
    attendees: 45,
    image: "👥",
    description:
      "Join us for a community cleanup event to make our neighborhood cleaner and greener!",
    isUserCreated: false,
    dateTime: new Date("2025-12-12T10:00:00"),
  },
  {
    title: "Minimilitia Gaming Tournament",
    date: "December 15, 2025",
    time: "2:00 PM",
    location: "Poblacion, Trinidad, Bohol",
    category: "Education",
    attendees: 120,
    image: "📚",
    description: "Show your skills in this exciting gaming tournament!",
    isUserCreated: false,
    dateTime: new Date("2025-12-15T14:00:00"),
  },
  {
    title: "Live Music Festival",
    date: "December 20, 2025",
    time: "6:00 PM",
    location: "Ubay, Bohol",
    category: "Music",
    attendees: 300,
    image: "🎵",
    description:
      "An evening of live music featuring local bands and artists. Food and drinks available!",
    isUserCreated: false,
    dateTime: new Date("2025-12-20T18:00:00"),
  },
  {
    title: "Kumbira Food Festival",
    date: "December 25, 2025",
    time: "6:00 PM",
    location: "Trinidad, Bohol",
    category: "Food",
    attendees: 300,
    image: "🍽️",
    description:
      "An evening of live music featuring local bands and artists. Food and drinks available!",
    isUserCreated: false,
    dateTime: new Date("2025-12-25T18:00:00"),
  },
  {
    title: "Basketball Championship",
    date: "December 18, 2025",
    time: "3:00 PM",
    location: "Sports Complex, Trinidad, Bohol",
    category: "Sports",
    attendees: 200,
    image: "⚽",
    description:
      "Annual basketball championship. Come support your favorite team!",
    isUserCreated: false,
    dateTime: new Date("2025-12-18T15:00:00"),
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing events
    await Event.deleteMany({});
    console.log("🗑️  Cleared existing events");

    // Insert sample events
    const result = await Event.insertMany(sampleEvents);
    console.log(`✅ Inserted ${result.length} sample events`);

    console.log("\n📋 Sample Events:");
    result.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${event.category}`);
    });

    mongoose.connection.close();
    console.log("\n✅ Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
