/* =========================
   BASE URL
========================= */
const BASE_URL = "http://localhost:3000";


/* =========================
   UC-JS-03: Fetch Units by Type
========================= */
export async function getUnits(type) {
  try {
    const res = await fetch(`${BASE_URL}/units?type=${type.toLowerCase()}`);

    // Always check HTTP status
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching units:", err);

    // Return safe fallback (important for Alternate/Exception flow)
    return [];
  }
}


// Get conversions
export async function getConversions() {
  const res = await fetch(`${BASE_URL}/conversions`);
  return res.json();
}

// Save history
export async function saveHistory(record) {
  const res = await fetch(`${BASE_URL}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(record)
  });
  return res.json();
}

// Get history
export async function getHistory() {
  const res = await fetch(`${BASE_URL}/history`);
  return res.json();
}