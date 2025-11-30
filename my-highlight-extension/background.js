chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "highlight") {
        console.log("Background: Received highlight message."); // This would be line 3 or 4
        // THIS IS THE NEW PART - IT SHOULD BE HERE NOW:
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { // This should be line 5 or 6 now
            if (tabs && tabs.length > 0) {
                const tabId = tabs[0].id;
                console.log("Background: Found active tab with ID:", tabId, ". Executing script.");
                chrome.scripting.executeScript({
                    target: { tabId: tabId }, // This is now much later, perhaps line 10-12
                    function: highlightSelectedText
                });
            } else {
                console.error("Background: No active tab found to execute script on.");
            }
        });
    }
});

// The highlightSelectedText function remains exactly the same as before
function highlightSelectedText() {
    console.log("Content Script: highlightSelectedText function started.");

    const selection = window.getSelection();
    console.log("Content Script: Current selection:", selection);

    if (selection.rangeCount > 0) {
        console.log("Content Script: Selection count is > 0.");
        const range = selection.getRangeAt(0);
        console.log("Content Script: Range:", range);

        const span = document.createElement('span');
        span.style.backgroundColor = 'yellow';
        span.style.fontWeight = 'bold';

        try {
            console.log("Content Script: Attempting to surround contents with span.");
            range.surroundContents(span);
            console.log("Content Script: Successfully surrounded contents.");
        } catch (e) {
            console.error("Content Script: Error trying to surround contents:", e);
            console.log("Content Script: Falling back to simpler highlighting logic.");

            if (selection.toString().trim().length > 0) {
                const selectedText = selection.toString();
                const parentNode = range.commonAncestorContainer;

                const tempElement = document.createElement('span');
                tempElement.style.backgroundColor = 'yellow';
                tempElement.style.fontWeight = 'bold';
                tempElement.textContent = selectedText;

                range.deleteContents();
                range.insertNode(tempElement);
                console.log("Content Script: Fallback highlighting applied.");
            } else {
                console.log("Content Script: No text selected for fallback highlighting.");
                alert("Please select some text to highlight!");
            }
        }
    } else {
        console.log("Content Script: No text selected (rangeCount is 0).");
        alert("Please select some text to highlight!");
    }
}
