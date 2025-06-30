# 🇱🇺 Luxembourgish Flashcards

An interactive web-based flashcard application for learning Luxembourgish vocabulary with intelligent spaced repetition.

## ✨ Features

- **Spaced Repetition Learning**: SM-2 algorithm for optimal memory retention
- **Rich Vocabulary Content**: Pre-loaded with essential Luxembourgish vocabulary organized by lessons
- **Interactive Flashcards**: Beautiful 3D card animations with audio pronunciation
- **Progress Tracking**: Detailed statistics and learning analytics
- **Multiple Study Modes**: Review, new cards, and comprehensive study sessions
- **Offline Support**: Works without internet connection using local storage
- **Mobile Optimized**: Responsive design for studying on any device
- **Dark/Light Theme**: Customizable appearance settings

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxembourgish-flashcards
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deployment

### GitHub Pages

1. **Configure repository settings**
   - Go to repository Settings > Pages
   - Set source to "GitHub Actions"

2. **Push to main branch**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

3. **Automatic deployment**
   - GitHub Actions will automatically build and deploy
   - Your app will be available at `https://yourusername.github.io/luxembourgish-flashcards/`

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 📚 Content Structure

The app includes comprehensive Luxembourgish vocabulary organized into:

- **Lektioun 1**: Greetings & Introductions
- **Essential Verbs**: Core auxiliary and communication verbs
- **Numbers & Time**: Counting, time expressions, dates
- **Sproochentest Vocabulary**: Essential words for citizenship test

### Adding Custom Vocabulary

Edit `src/data/vocabulary.ts` to add new decks or modify existing vocabulary:

```typescript
const newDeck: Deck = {
  id: 'custom-deck',
  name: 'My Custom Vocabulary',
  description: 'Personal vocabulary collection',
  cards: [
    {
      luxembourgish: 'Moien',
      english: 'Hello',
      pronunciation: 'MOY-en',
      category: 'greetings',
      difficulty: 'A1',
      // ... other properties
    }
  ]
};
```

## 🎮 Study Features

### Keyboard Shortcuts

- **Space**: Flip flashcard
- **1-4**: Rate card difficulty (Again, Hard, Good, Easy)
- **Q-R**: Alternative rating keys

### Study Modes

- **Review**: Cards due for review based on spaced repetition
- **New Cards**: Learn new vocabulary (up to 20 cards per session)
- **All Cards**: Study entire deck in random order

### Spaced Repetition

The app uses the SM-2 algorithm with customizable parameters:
- Easy bonus multiplier
- Interval modifier
- Maximum interval between reviews

## 📊 Progress Tracking

Monitor your learning with:
- Study streak tracking
- Accuracy statistics
- Time spent studying
- Category-wise progress
- Weekly activity charts
- Retention rate analysis

## ⚙️ Configuration

Customize your learning experience:
- Audio pronunciation settings
- Card animation preferences
- Daily study limits
- Spaced repetition parameters
- Theme and appearance

## 🛠️ Development

### Project Structure

```
src/
├── components/         # React components
├── store/             # Zustand state management
├── types/             # TypeScript definitions
├── utils/             # Utility functions
├── data/              # Vocabulary data
└── hooks/             # Custom React hooks
```

### Key Technologies

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run deploy       # Deploy to GitHub Pages
```

## 🌍 Luxembourgish Language Support

Special features for Luxembourgish:
- Proper rendering of special characters (ë, é, ä)
- English pronunciation guides
- Cultural context notes
- Integration with Luxembourg citizenship test vocabulary

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vocabulary content based on authentic Luxembourgish language learning materials
- Spaced repetition algorithm inspired by SuperMemo research
- Design inspired by modern language learning applications

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/luxembourgish-flashcards/issues) page
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

---

**Built with ❤️ for the Luxembourg community** 🇱🇺

*Schwätzt Dir Lëtzebuergesch? Learn Luxembourg's beautiful language with interactive flashcards!*
