# Tetromino - Modern Tetris Game

A feature-rich Tetris-style game built with React, Redux, and Tailwind CSS. This game combines classic Tetris gameplay with modern features and tools to enhance the gaming experience.

## 🎮 Game Features

- **Classic Tetris Gameplay**: Drop and arrange tetromino pieces to clear rows
- **Responsive Design**: Play seamlessly on desktop and mobile devices
- **Hold Piece Function**: Store a piece for later use
- **Next Piece Preview**: See upcoming pieces to plan your strategy
- **Ghost Piece**: Preview where the current piece will land
- **Scoring System**: Earn points for clearing rows and level progression
- **Level Progression**: Game speed increases as you clear more lines
- **Sound Effects**: Enjoy audio feedback during gameplay

### 🛠 Special Tools

The game includes three powerful tools to help players in challenging situations:

1. **Save Game** (costs 100 points)
   - Saves your current game state with timestamp tracking
   - Auto-pauses the game when saved
   - Includes visual feedback and confirmation message

2. **Skip Piece** (costs 200 points)
   - Skip the current piece when you're in a difficult situation
   - Provides 3 favorable pieces (I, T, L, J tetrominos)
   - Includes visual feedback animation

3. **Clear Row** (costs 150 points)
   - Clears up to 4 rows from the bottom of the board
   - Counts toward level progression
   - Works even when no filled rows exist (as preparation)

All tools require a minimum score to unlock and cost points to use. Once used, a tool becomes unavailable until you earn enough points again.

## 🚀 Technology Stack

- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with Neumorphism design
- **Build Tool**: Next.js 14
- **Language**: TypeScript, Python


### Data Flow

The game implements a unidirectional data flow:

1. **User Input** → Captured by UI components
2. **Dispatch** → Action sent to Redux store
3. **Reducer** → State updated based on action
4. **Render** → UI reflects updated state

## 📋 Controls

### Desktop

- **Left Arrow / A**: Move left
- **Right Arrow / D**: Move right
- **Down Arrow / S**: Soft drop
- **Up Arrow / W**: Hard drop
- **Z**: Rotate counter-clockwise
- **X**: Rotate clockwise
- **C**: Hold piece
- **Escape**: Pause game

### Mobile

- **Left side buttons**: Movement controls
- **Right side buttons**: Rotation and special actions

## 💻 Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- Ynpm

### Installation Steps
2. Install dependencies:
   ```bash
   npm install

3. Start the development server:
   ```bash
   npm run dev

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game

### Building for Production

```bash
npm run build

## 🧪 Testing

Run the test suite with:

```bash
npm run test

Made with ❤️ by Ronda
