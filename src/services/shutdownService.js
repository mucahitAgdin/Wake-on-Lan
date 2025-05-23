// src/services/shutdownService.js
const { exec } = require("child_process");

function logShutdown(ip, status, error = null) {
  const timestamp = new Date().toISOString();
  const statusColor = status === "success" ? status : "FAIL";

  console.log(`[${timestamp}] Shutdown Attempt: IP: ${ip}, Status: ${statusColor.toUpperCase()}`);

  if (error) {
    console.error("Error Details:", error);
  }
}


async function shutdownWindowsDevice(ip) {
  const command = `shutdown /s /m \\\\${ip} /t 5 /f /c "Uzaktan kapatma"`; // 5 saniye içinde force shutdown

  logShutdown(ip, "attempting");

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logShutdown(ip, "failed", error.message);
        reject(new Error(stderr || stdout || error.message));
      } else {
        logShutdown(ip, "success");
        resolve({ success: true, message: `${ip} kapatılıyor...` });
      }
    });
  });
}

module.exports = { shutdownWindowsDevice };
