document.getElementById('highlightBtn').addEventListener('click', () => {
    // Send a message to the background script
    chrome.runtime.sendMessage({ action: "highlight" });
    window.close(); // Close the popup after clicking
});