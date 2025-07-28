import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Volume2, 
  Image, 
  Users, 
  Trophy, 
  Target,
  BookOpen,
  Mic,
  Globe
} from 'lucide-react';
import { 
  StoryQuiz, 
  VisualQuestion, 
  AudioQuestion, 
  Achievement
} from '@/types/quizEnhancements';

// Example Enhanced Quiz Component
const EnhancedQuizExample: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  // Example Story Quiz
  const storyQuiz: StoryQuiz = {
    id: 'story-1',
    title: 'A Day in Luxembourg City',
    scenario: 'You arrive in Luxembourg City for the first time. It\'s morning and you\'re hungry. You see a café nearby.',
    background: 'A charming café in the old town with outdoor seating',
    choices: [
      {
        id: 'choice-1',
        text: 'Gudde Moien! Ech hätt gär e Kaffi, wann ech gelift.',
        outcome: 'The barista smiles and responds warmly. You\'ve used the correct formal greeting!',
        vocabulary: ['Gudde Moien', 'Kaffi', 'wann ech gelift'],
        culturalNotes: 'Using "wann ech gelift" shows politeness and respect.',
        isCorrect: true
      },
      {
        id: 'choice-2',
        text: 'Gëff mer e Kaffi.',
        outcome: 'The barista looks surprised. This is too direct and informal for a first interaction.',
        vocabulary: ['Kaffi'],
        culturalNotes: 'This is too direct and might be considered rude in Luxembourgish culture.',
        isCorrect: false
      }
    ],
    culturalContext: 'Luxembourgish people value politeness and formal greetings, especially with strangers.',
    difficulty: 'A1'
  };

  // Example Visual Question
  const visualQuestion: VisualQuestion = {
    id: 'visual-1',
    type: 'image-identification',
    image: {
      url: '/images/luxembourg-castle.jpg',
      alt: 'Luxembourg Castle',
      description: 'A medieval castle overlooking the city'
    },
    question: 'Wat ass dat? (What is this?)',
    options: [
      { text: 'D\'Schlass', isCorrect: true },
      { text: 'D\'Kierch', isCorrect: false },
      { text: 'D\'Schoul', isCorrect: false },
      { text: 'D\'Spital', isCorrect: false }
    ],
    culturalContext: 'The Luxembourg Castle is a symbol of the country\'s history and independence.',
    vocabulary: ['Schlass', 'Kierch', 'Schoul', 'Spital'],
    difficulty: 'A1'
  };

  // Example Audio Question
  const audioQuestion: AudioQuestion = {
    id: 'audio-1',
    type: 'listen-choose',
    audioUrl: '/audio/greeting.mp3',
    question: 'Listen to the greeting and choose the correct meaning:',
    options: [
      'Good morning',
      'Good afternoon', 
      'Good evening',
      'Goodbye'
    ],
    pronunciation: {
      slow: '/audio/greeting-slow.mp3',
      normal: '/audio/greeting.mp3',
      phonetic: 'ˈɡudə ˈmoːjən',
      audioUrl: '/audio/greeting.mp3'
    },
    culturalNotes: 'This greeting is used from morning until around noon.',
    difficulty: 'A1'
  };

  // Example Achievement
  const achievement: Achievement = {
    id: 'ach-1',
    title: 'Polite Speaker',
    description: 'Used formal greetings correctly 10 times',
    icon: '🎩',
    category: 'culture',
    requirements: {
      correctAnswers: 10,
      streak: 5,
      categories: ['greetings', 'formality'],
      timeSpent: 300,
      socialInteractions: 0
    },
    rewards: {
      points: 100,
      badges: ['polite-badge'],
      unlockContent: ['advanced-greetings'],
      specialFeatures: ['formal-conversation-mode']
    }
  };

  const handleAnswer = (_answer: string) => {
    setShowFeedback(true);
  };

  const renderStoryQuiz = () => (
    <motion.div 
      className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{storyQuiz.title}</h2>
        <p className="text-gray-600">{storyQuiz.scenario}</p>
      </div>
      
      <div className="space-y-4">
        {storyQuiz.choices.map((choice) => (
          <motion.button
            key={choice.id}
            onClick={() => handleAnswer(choice.text)}
            className="w-full p-4 text-left bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="font-medium text-gray-900 mb-2">{choice.text}</div>
            {showFeedback && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm ${choice.isCorrect ? 'text-green-600' : 'text-red-600'}`}
              >
                {choice.outcome}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      
      {showFeedback && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200"
        >
          <h3 className="font-semibold text-yellow-800 mb-2">Cultural Insight</h3>
          <p className="text-yellow-700 text-sm">{storyQuiz.culturalContext}</p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderVisualQuestion = () => (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Visual Learning</h2>
        <div className="relative">
          <img 
            src={visualQuestion.image.url} 
            alt={visualQuestion.image.alt}
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            <Image className="inline w-4 h-4 mr-1" />
            Visual
          </div>
        </div>
        <p className="text-lg font-medium text-gray-900">{visualQuestion.question}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {visualQuestion.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswer(option.text)}
            className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium text-gray-900">{option.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderAudioQuestion = () => (
    <motion.div 
      className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Audio Comprehension</h2>
        <div className="flex justify-center mb-4">
          <button className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-colors">
            <Play className="w-8 h-8" />
          </button>
        </div>
        <p className="text-lg font-medium text-gray-900">{audioQuestion.question}</p>
      </div>
      
      <div className="space-y-3">
        {audioQuestion.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="font-medium text-gray-900">{option}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <h3 className="font-semibold text-green-800 mb-2 flex items-center">
          <Volume2 className="w-4 h-4 mr-2" />
          Pronunciation Guide
        </h3>
        <p className="text-green-700 text-sm">{audioQuestion.pronunciation.phonetic}</p>
      </div>
    </motion.div>
  );

  const renderAchievement = () => (
    <motion.div 
      className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">{achievement.icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
        <p className="text-gray-600 mb-4">{achievement.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-900">Rewards</div>
            <div className="text-gray-600">{achievement.rewards.points} points</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-900">Category</div>
            <div className="text-gray-600 capitalize">{achievement.category}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // const renderDailyChallenge = () => (
  //   Daily Challenge component would go here
  // );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Quiz Features Demo
        </h1>
        <p className="text-gray-600">
          Experience the future of Luxembourgish learning with these innovative quiz enhancements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Story Quiz */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Interactive Story Quiz
          </h2>
          {renderStoryQuiz()}
        </div>

        {/* Visual Question */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Image className="w-5 h-5 mr-2" />
            Visual Learning
          </h2>
          {renderVisualQuestion()}
        </div>

        {/* Audio Question */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Audio Comprehension
          </h2>
          {renderAudioQuestion()}
        </div>

        {/* Achievement */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Achievement System
          </h2>
          {renderAchievement()}
        </div>

        {/* Daily Challenge */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Daily Challenge
          </h2>
          {/* render DailyChallenge() */}
        </div>
      </div>

      {/* Feature Overview */}
      <motion.div 
        className="bg-gray-50 rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Key Enhancement Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Cultural Immersion</h3>
            <p className="text-sm text-gray-600">Learn through real cultural contexts and traditions</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mic className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Voice Recognition</h3>
            <p className="text-sm text-gray-600">Practice pronunciation with real-time feedback</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Social Learning</h3>
            <p className="text-sm text-gray-600">Learn together with peers and study groups</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Adaptive Intelligence</h3>
            <p className="text-sm text-gray-600">Personalized learning paths and difficulty adjustment</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedQuizExample; 