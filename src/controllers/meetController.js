import { generateMeetLink } from "../services/googleMeet.js";
import { logInfo, logError } from "../utils/logger.js";

export async function createMeeting(req, res) {
  try {
    logInfo("REQUEST RECEIVED", req.body);

    const meetLink = await generateMeetLink(req.body);

    return res.json({
      success: true,
      meeting_url: meetLink,
    });
  } catch (error) {
    logError("ERROR CREATING MEETING", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
