/*
    Author: Leah Pittman
    Date: October 1, 2026
    Purpose: Detect a server launch, update the page,
             refresh telemetry, and store the launch timestamp.
*/

// Read a named cookie.
function getCookie(name) {
    const prefix = name + "=";

    const cookie = document.cookie
        .split(";")
        .map(function (item) {
            return item.trim();
        })
        .find(function (item) {
            return item.startsWith(prefix);
        });

    if (!cookie) {
        return null;
    }

    return decodeURIComponent(cookie.substring(prefix.length));
}

// Store a cookie for 30 days.
function setCookie(name, value) {
    document.cookie =
        name + "=" + encodeURIComponent(value) +
        "; max-age=2592000; path=/; SameSite=Lax";
}

// Format a saved timestamp using the computer's local date and time.
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "No valid launch timestamp found.";
    }

    return date.toLocaleString();
}

const protocol = window.location.protocol;

// HTTP or HTTPS means the page was launched through a web server.
// Opening the HTML directly uses file: and remains in Ground Standby.
const isLive = protocol === "http:" || protocol === "https:";

document.body.classList.toggle("uplink-mode", isLive);

// Display the hostname.
document.getElementById("hostInfo").textContent =
    window.location.hostname || "Not available — opened as a local file";

// Display an explicit port or the protocol's default port.
let port = window.location.port;

if (!port) {
    if (protocol === "http:") {
        port = "80 (default HTTP port)";
    } else if (protocol === "https:") {
        port = "443 (default HTTPS port)";
    } else {
        port = "Not applicable — no web server";
    }
}

document.getElementById("portInfo").textContent = port;
document.getElementById("protocolInfo").textContent = protocol;

if (isLive) {
    // Activate the warm Uplink Mode theme and update the hero.
    document.getElementById("heroTitle").textContent = "UPLINK MODE";

    document.getElementById("heroText").textContent =
        "Satellite uplink established. Command systems are online.";

    document.getElementById("connectionStatus").textContent =
        "Online — local web server connection established";

    // Read the previous launch before replacing its cookie.
    const previousLaunch = getCookie("lastUplink");

    document.getElementById("lastOnline").textContent = previousLaunch
        ? formatTimestamp(previousLaunch)
        : "First launch — no previous uplink recorded.";

    // Save a fresh timestamp whenever the live page launches or refreshes.
    const currentLaunch = new Date().toISOString();

    setCookie("lastUplink", currentLaunch);

    document.getElementById("launchInfo").textContent =
        formatTimestamp(currentLaunch);

    // Read the cookie back to confirm it was stored.
    const savedLaunch = getCookie("lastUplink");

    document.getElementById("cookieStatus").textContent =
        savedLaunch === currentLaunch
            ? "lastUplink cookie saved successfully."
            : "The browser did not save the lastUplink cookie.";
} else {
    // Retain the cool Ground Standby theme for a direct file launch.
    document.getElementById("heroTitle").textContent =
        "GROUND STANDBY";

    document.getElementById("heroText").textContent =
        "Awaiting Uplink Authorization. Launch through a local web server.";

    document.getElementById("connectionStatus").textContent =
        "Offline — Ground Standby Mode";

    document.getElementById("lastOnline").textContent =
        "Launch records are available when opened through the web server.";

    document.getElementById("launchInfo").textContent =
        formatTimestamp(new Date().toISOString());

    document.getElementById("cookieStatus").textContent =
        "Open through a local web server to store the lastUplink cookie.";
}

// Manually reload the page when the refresh button is clicked.
document.getElementById("refreshButton").addEventListener(
    "click",
    function () {
        window.location.reload();
    }
);