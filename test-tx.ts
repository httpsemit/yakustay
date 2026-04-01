import { adminDb } from "./lib/firebase-admin";

async function run() {
  const snap = await adminDb.collection("pointTransactions").get();
  if (snap.empty) {
    console.log("No transactions found in db!");
  } else {
    snap.docs.forEach(d => {
      console.log(d.id, "=>", d.data());
    });
  }
}

run().catch(console.error);
