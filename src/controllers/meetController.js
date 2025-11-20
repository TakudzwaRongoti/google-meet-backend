import { generateMeetLink } from "../services/googleMeet.js";
import { logInfo, logError } from "../utils/logger.js";
//import supabase from "../config/supabase.js"; // import your Supabase client
import { supabase } from "../config/supabase.js"; // note the braces

export async function createMeeting(req, res) {
  try {
    logInfo("REQUEST RECEIVED", req.body);

    const { mentor_id, program_id, title, description, scheduled_at, type = "stream", mentor_tokens } = req.body;

    if (!mentor_id || !title || !scheduled_at || !mentor_tokens) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // 1️⃣ Create Google Meet
    const meetLink = await generateMeetLink(req.body);

    // 2️⃣ Save session to Supabase
    const { data: session, error: insertErr } = await supabase
      .from("live_sessions")
      .insert([{
        mentor_id,
        program_id,
        title,
        description,
        scheduled_at,
        type,
        status: "upcoming",
        meet_link: meetLink
      }])
      .select()
      .single();

    if (insertErr) {
      logError("SUPABASE INSERT ERROR", insertErr);
      return res.status(500).json({ success: false, error: "Failed to save session" });
    }

    // 3️⃣ Return to frontend
    return res.json({
      success: true,
      meeting_url: meetLink,
      session
    });

  } catch (error) {
    logError("ERROR CREATING MEETING", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
