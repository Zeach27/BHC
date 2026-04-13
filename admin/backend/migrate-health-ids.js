const mongoose = require("mongoose");
const User = require("./models/user");

const MONGO_URI = "mongodb://127.0.0.1:27017/Chesms";

function parseHealthIdNumber(healthId, year) {
  const match = (healthId || "").match(new RegExp(`^CHEMS-${year}-(\\d+)$`));
  if (!match) return null;
  return Number.parseInt(match[1], 10);
}

async function runMigration() {
  await mongoose.connect(MONGO_URI);

  const year = new Date().getFullYear();
  const prefix = `CHEMS-${year}-`;

  const allUsers = await User.find({}).sort({ createdAt: 1, _id: 1 });

  let maxNumber = 0;
  for (const user of allUsers) {
    const n = parseHealthIdNumber(user.healthId, year);
    if (Number.isInteger(n) && n > maxNumber) {
      maxNumber = n;
    }
  }

  let updatedCount = 0;
  for (const user of allUsers) {
    if (!user.healthId) {
      maxNumber += 1;
      user.healthId = `${prefix}${String(maxNumber).padStart(3, "0")}`;
      await user.save();
      updatedCount += 1;
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} user(s). Current max ID: ${prefix}${String(maxNumber).padStart(3, "0")}`);
  await mongoose.disconnect();
}

runMigration().catch(async (err) => {
  console.error("Migration failed:", err.message);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
