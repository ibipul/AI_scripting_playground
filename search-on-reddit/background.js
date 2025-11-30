// This script runs in the background as a Service Worker.
// It handles events and manages the extension's core logic.

// Listen for when the extension is installed or updated.
// This is where we'll create our context menu item.
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item.
  // The 'id' is a unique identifier for this menu item.
  // The 'title' is the text that will appear in the context menu.
  // The 'contexts' array specifies when the menu item should appear.
  // "selection" means it will only appear when text is selected.
  chrome.contextMenus.create({
    id: "searchRedditSentiment", // Unique ID for this menu item
    title: "Search Reddit Sentiment", // Text displayed in the context menu
    contexts: ["selection"] // Appears only when text is selected
  });
  console.log("Context menu item 'Search Reddit Sentiment' created.");
});

// Listen for when a context menu item is clicked.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Check if the clicked item is our specific menu item.
  if (info.menuItemId === "searchRedditSentiment") {
    // 'info.selectionText' contains the text that the user highlighted.
    const selectedText = info.selectionText;
    console.log("Selected text for Reddit search:", selectedText);

    if (selectedText) {
      // It's good practice to add keywords to the search query
      // to guide Reddit towards sentiment-related results.
      const searchTerm = `${selectedText} sentiment OR review`; // Example: "iPhone sentiment OR review"
      const encodedSearchTerm = encodeURIComponent(searchTerm);

      // Construct the Reddit search URL.
      // reddit.com/search/?q= is the standard search endpoint.
      const redditUrl = `https://www.reddit.com/search/?q=${encodedSearchTerm}`;
      console.log("Opening Reddit URL:", redditUrl);

      // Open a new tab with the constructed Reddit URL.
      chrome.tabs.create({ url: redditUrl });
    } else {
      // This fallback is for safety, though 'contexts: ["selection"]' should prevent it.
      console.warn("No text was selected when the context menu item was clicked.");
      // In a real extension, you might use a notification API here.
      alert("Please select some text to search on Reddit!");
    }
  }
});
