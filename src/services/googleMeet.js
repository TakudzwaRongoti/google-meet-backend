export async function generateMeetLink(data) {
  console.log("Generating Google Meet link for:", data);

  // ---------- Replace this later with actual Google API logic ----------
  const fakeMeetCode = Math.random().toString(36).substring(2, 12);
  const meetUrl = `https://meet.google.com/${fakeMeetCode}`;
  // ---------------------------------------------------------------------

  return meetUrl;
}
