/* =========================
   BASE URL
========================= */
const BASE_URL = "http://localhost:3000";

/* =========================
   UC-JS-06: Load History
========================= */
export async function getHistory() {
  try {
    const res = await fetch(
      `${BASE_URL}/history?_sort=timestamp&_order=desc`
    );

    // Optional safety check
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json(); // returns [] if no records

  } catch (err) {
    console.error("Failed to load history:", err);

    // Return empty array (non-breaking)
    return [];
  }
}

/* =========================
   UC-JS-05: Save to History
========================= */
export async function saveHistory(record) {
  try {
    const res = await fetch(`${BASE_URL}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(record)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json(); // returns saved object with id

  } catch (err) {
    console.error("Failed to save history:", err);

    // ❗ Do NOT throw — history is non-critical
    return null;
  }
}
/* =========================
   UC-JS-04: Fetch Conversion Record
========================= */
export async function getConversion(from, to) {
  // short-circuit same unit
  if (from === to) {
    return { from, to, factor: 1, formula: null };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/conversions?from=${from}&to=${to}`
    );

    // Check HTTP status
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    // json-server ALWAYS returns an array
    const data = await res.json();

    // If no conversion found → throw error
    if (!data.length) {
      throw new Error("No conversion found");
    }

    // Return the first match
    return data[0];

  } catch (err) {
    console.error("Error fetching conversion:", err);
    throw err; // let caller handle UI message
  }
}

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


