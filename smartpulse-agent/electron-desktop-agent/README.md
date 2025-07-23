# Electron Desktop Agent

## Overview
The Electron Desktop Agent is a desktop application designed to monitor worker activities, including idle time, productive hours, and non-productive hours. It provides insights into user productivity and helps in managing time effectively.

## Features
- Tracks active applications and user activity.
- Monitors idle time and categorizes hours into productive and non-productive.
- Displays real-time activity data through a user-friendly interface.

## Project Structure
```
electron-desktop-agent
├── src
│   ├── main
│   │   └── main.ts          # Main entry point for the Electron application
│   ├── renderer
│   │   ├── App.tsx          # Main React component for the renderer process
│   │   └── index.tsx        # Entry point for the React application
│   ├── components
│   │   └── ActivityMonitor.tsx # Component to display activity monitoring data
│   ├── utils
│   │   └── activityUtils.ts  # Utility functions for tracking activity data
│   └── types
│       └── index.ts          # TypeScript interfaces and types
├── public
│   └── index.html            # HTML template for the Electron application
├── package.json               # npm configuration file
├── tsconfig.json             # TypeScript configuration file
└── README.md                 # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd electron-desktop-agent
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the application, run:
```
npm start
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.