# IPL Auctioneer Dashboard

A modern MERN (MongoDB, Express, React, Node.js) application for managing and simulating IPL cricket auction bidding. Upload player data via CSV and manage team budgets, player assignments, and auction statistics in real-time.

## Features

- 📤 **CSV Upload** - Upload player data with base prices, types, and values
- 🏏 **10 IPL Teams** - Manage all IPL teams with individual budgets and constraints
- 💰 **Budget Management** - Track team purses, player limits, and role restrictions
- 🎯 **Live Auction** - Assign players to teams with bid prices
- ✏️ **Edit Assignments** - Modify player assignments and prices during auction
- 📊 **Real-time Statistics** - View team composition, remaining budget, and player metrics

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning the repo)

## Installation

1. **Clone the repository** (or download the ZIP file):
```bash
git clone https://github.com/ujjwal1729/ipl-auctioneer-dashboard.git
cd ipl-auctioneer-dashboard
```

2. **Install server dependencies**:
```bash
cd server
npm install
```

3. **Install client dependencies**:
```bash
cd ../client
npm install
```

## Running the Application

You need to run both the server and client simultaneously in separate terminal windows.

### Terminal 1 - Start the Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000` (or the port configured in `server/index.js`)

### Terminal 2 - Start the Client

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### Access the App

Open your browser and navigate to:
```
http://localhost:5173
```

## How to Use

### 1. Upload Player Data

When the app loads, you'll see the CSV upload screen. You need to upload a CSV file with the following columns:

```
name,basePrice,foreigner,type,value
Virat Kohli,2,false,batsman,25
Rohit Sharma,2,false,batsman,20
Jasprit Bumrah,2,false,bowler,20
AB de Villiers,1.5,true,batsman,20
```

### 2. CSV Format Requirements

The CSV file **must** contain these columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| **name** | String | Player's name | "Virat Kohli" |
| **basePrice** | Number | Base price in Crores | 2 |
| **foreigner** | Boolean | Is player international? | true/false |
| **type** | String | Player role | "batsman", "bowler", "all-rounder" |
| **value** | Number | Player value rating | 25 |

### 3. Run the Auction

- Select a price for the player
- Click on a team button to assign the player
- Confirm the assignment in the modal
- View team statistics and assignments in real-time
- Edit previous assignments if needed

## CSV Sample File

A sample `players.csv` file is included in the project root directory. You can modify this or create your own following the format above.

## Project Structure

```
ipl-auctioneer-dashboard/
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── App.css           # Application styles
│   │   ├── main.jsx          # App entry point
│   │   └── index.css         # Global styles
│   ├── public/
│   │   └── images/           # Team logos
│   ├── index.html
│   ├── vite.config.js        # Vite configuration
│   ├── eslint.config.js
│   └── package.json
├── server/                    # Express backend
│   ├── index.js              # Server entry point
│   └── package.json
├── players.csv               # Sample player data
└── README.md                 # This file
```

## Technologies Used

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM (optional)
- **Nodemon** - Auto-reload during development

## Team Constraints

Each team starts with:
- **Purse**: ₹120 Crore
- **Total Players**: 15
- **Batsmen**: 7
- **Bowlers**: 4
- **International Players**: 5

These values are updated as players are assigned during the auction.

## Troubleshooting

### Port Already in Use
If port 5173 or 5000 is already in use:
- Kill the process using that port, or
- Modify the port in `vite.config.js` (client) or `server/index.js` (server)

### CSV Upload Fails
- Ensure your CSV has headers: `name,basePrice,foreigner,type,value`
- Column names are case-insensitive
- Check that boolean values are `true` or `false` (lowercase)
- Ensure no empty rows in the CSV

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Future Enhancements

- Database integration (MongoDB)
- User authentication and role management
- Export team data to Excel/PDF
- Auction history and analytics
- Real-time multi-user auction support

## License

This project is open source and available under the MIT License.

## Contact

For questions or feedback:
- **Email**: ujjwaljain1729@gmail.com
- **GitHub**: [@ujjwal1729](https://github.com/ujjwal1729)

---

**Happy Auctioning! 🏏**
