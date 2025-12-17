/**
 * Sends a message to the specified Discord webhook.
 * @param {string} content - The message to send.
 * @returns {Promise<boolean>} - Returns true if sent successfully, false otherwise.
 */
export async function sendDiscordMsg(content: string): Promise<boolean> {
  try {
    const webhookUrl =
      "https://discord.com/api/webhooks/1450868064852906121/Ph_Rpv_qbs_nuFFYUZJTLDewcQtNZbGksYb_HUeIks9OeQEY6R9dGVpTjVFuTJcXKU01";

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending Discord message:", error);
    return false;
  }
}
