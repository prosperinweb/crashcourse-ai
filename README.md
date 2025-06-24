# 🧠 AI Crash Course - Advanced TypeScript Learning Platform

A modern, interactive learning platform powered by AI that generates personalized crash courses on any topic. Built with React, TypeScript, and the Vercel AI SDK.

## ✨ Features

- **🤖 AI-Powered Course Generation**: Create comprehensive courses on any topic using Google's Gemini AI
- **📚 Interactive Learning Modules**: Bite-sized chunks with progress tracking
- **🧩 Dynamic Quizzes**: Both original and AI-generated quizzes (multiple choice & drag-and-drop)
- **💡 Code Explanations**: AI-powered code explanations with syntax highlighting
- **🧠 Mnemonic Generation**: AI-generated memory aids for better retention
- **🏆 Progress Tracking**: Visual progress bars and achievement badges
- **📱 Responsive Design**: Beautiful UI with dark theme using Tailwind CSS

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI SDK + Google Gemini API
- **Code Highlighting**: React Syntax Highlighter
- **Markdown**: React Markdown with GitHub Flavored Markdown
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Google Generative AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crashcourse-ai
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file in root directory
   echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env
   ```

4. **Start the development server**

   ```bash
   pnpm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Environment Variables

| Variable              | Description                  | Required |
| --------------------- | ---------------------------- | -------- |
| `VITE_GEMINI_API_KEY` | Google Generative AI API key | Yes      |

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── AiFeatures.tsx   # AI quiz/mnemonic generation
│   ├── CodeBlock.tsx    # Syntax-highlighted code blocks
│   ├── CourseGenerator.tsx # AI course creation modal
│   ├── Dashboard.tsx    # Progress and badges display
│   ├── Footer.tsx       # Application footer
│   ├── Header.tsx       # Application header
│   ├── LearningModule.tsx # Main learning content
│   ├── Mnemonic.tsx     # Memory aid display
│   ├── Quiz.tsx         # Interactive quiz component
│   ├── QuizSection.tsx  # Quiz container
│   └── TopicNavigator.tsx # Topic navigation
├── data/
│   └── initialCourseContent.ts # Default TypeScript course
├── types/
│   └── index.ts         # TypeScript interfaces
├── utils/
│   └── geminiApi.ts     # AI SDK integration
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🔧 Architecture

### AI Integration

The application uses the **Vercel AI SDK** with Google's Gemini models for:

- **Course Generation**: Creates structured courses with topics, learning objectives, and quizzes
- **Code Explanations**: Provides detailed explanations of code snippets
- **Quiz Generation**: Creates additional practice questions
- **Mnemonic Creation**: Generates memory aids for complex concepts

### Component Architecture

- **Modular Design**: Each component has a single responsibility
- **Type Safety**: Full TypeScript coverage with strict mode
- **Reusable Components**: Clean interfaces and proper prop typing
- **State Management**: React hooks with proper state lifting

## 📚 Usage

### Creating a New Course

1. Click "Create New Course" in the header
2. Enter a topic (e.g., "React Hooks", "Machine Learning", "Italian Cooking")
3. Wait for AI to generate a comprehensive course structure
4. Navigate through topics and chunks
5. Complete quizzes to earn badges

### Learning Features

- **Progress Tracking**: Automatic progress saving as you complete chunks
- **Code Exploration**: Click "Explain Code" for detailed breakdowns
- **AI Tools**: Generate additional quizzes and mnemonics
- **Badges**: Earn achievements for completing topics

## 🎨 Customization

### Adding New Features

1. **Create Component**: Add to `src/components/`
2. **Define Types**: Update `src/types/index.ts`
3. **Integrate**: Import and use in parent components
4. **Style**: Use Tailwind utility classes

### Modifying AI Prompts

Edit prompts in:

- `src/components/CourseGenerator.tsx` - Course generation
- `src/components/CodeBlock.tsx` - Code explanations
- `src/components/AiFeatures.tsx` - Quiz/mnemonic generation

## 🧪 Development

### Available Scripts

```bash
pnpm run dev        # Start development server
pnpm run build      # Build for production
pnpm run preview    # Preview production build
pnpm run lint       # Run ESLint
```

### Code Quality

- **ESLint**: Configured with TypeScript rules
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Consistent naming and organization

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application is a static SPA that can be deployed to:

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) - Excellent AI integration toolkit
- [Google Generative AI](https://developers.generativeai.google/) - Powerful language models
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful utility-first styling
- [Lucide](https://lucide.dev/) - Clean and consistent icons
