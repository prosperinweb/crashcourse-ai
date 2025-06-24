export interface Mnemonic {
  title: string;
  text: string;
}

export interface Chunk {
  title: string;
  content: string;
  code?: string;
  mnemonic?: Mnemonic;
}

export interface Quiz {
  type: "multiple-choice" | "drag-and-drop";
  question: string;
  options: string[];
  answer: string;
  codeSnippet?: string;
}

export interface TopicData {
  title: string;
  learningObjectives: string[];
  chunks: Chunk[];
  quiz: Quiz;
}

export interface CourseData {
  [key: string]: TopicData;
}

export interface Progress {
  [topicKey: string]: number;
}

export interface AiGeneratedQuizzes {
  [topicKey: string]: Quiz[];
}
