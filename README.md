# verman

`verman` is a simple version manager that allows your application to check for updates and automatically manage versioning. You can host the server code on your own server or use our public server.

## Getting Started

### Setting Up

1. **Server Configuration:**
   - Host the server code on your own server or use the public server.
   - Make sure the server is running and accessible.

2. **Application Integration:**
   - In your application code, just before the main execution starts, make a GET request to `/version/:appid`.
   - Check if the returned version is higher than the current version.

### Update Process

If a new version is available, follow these steps:

1. **Download the Update:**
   - Download the file from the `url` field in a temporary directory.

2. **Start the Update:**
   - Launch your application as a separate process.
   - Pass the old executable path and version as arguments, letting it know that an update has occurred.

3. **Update Execution:**
   - The parent process will exit.
   - The new process will:
     - Copy itself to the original executable's path.
     - Start as a new process.
     - Exit the current process.

This way, the update is completed seamlessly. Feel free to modify this process to fit your application's needs.

### Example Code Snippet

Here’s a basic example of how you might implement the version check in your app:

```javascript
const axios = require('axios');

async function checkForUpdates(appId, currentVersion) {
    try {
        const response = await axios.get(`/version/${appId}`);
        const latestVersion = response.data.version;

        if (isNewerVersion(latestVersion, currentVersion)) {
            // Logic for downloading and restarting the app
        }
    } catch (error) {
        console.error("Error checking for updates:", error);
    }
}

// Function to compare versions (you'll need to implement this)
function isNewerVersion(latest, current) {
    // Version comparison logic
}
```

### Conclusion

By implementing `verman`, you can provide a smooth auto-update experience for your users. Customize the update process as needed to suit your application's architecture!
