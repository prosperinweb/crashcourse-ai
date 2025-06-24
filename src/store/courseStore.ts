import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CourseData,
  Progress,
  AiGeneratedQuizzes,
  TopicData,
  Quiz,
} from "../types";
import { initialCourseContent } from "../data/initialCourseContent";

interface CourseState {
  // Core state
  courseData: CourseData;
  activeTopic: string;
  progress: Progress;
  badges: string[];
  aiGeneratedQuizzes: AiGeneratedQuizzes;
  courseTitle: string;
  completedQuizzes: string[];
  divedDeeperTopics: string[];
  showConfetti: boolean;
  isInitialCourse: boolean;
  showInitialCourseNote: boolean;
  isGeneratingCourse: boolean;

  // Actions
  resetCourse: (newCourseData: CourseData, newTitle: string) => void;
  updateProgress: (topic: string, chunkIndex: number) => void;
  navigateTopic: (direction: number) => void;
  handleNextTopic: () => void;
  handleQuizComplete: (topic: string) => void;
  updateTopicContent: (topic: string, newTopicData: TopicData) => void;
  addAiQuiz: (topic: string, quiz: Quiz) => void;
  setActiveTopic: (topic: string) => void;
  setShowConfetti: (show: boolean) => void;
  setShowInitialCourseNote: (show: boolean) => void;
  setIsGeneratingCourse: (generating: boolean) => void;

  // Computed getters
  getCurrentTopicData: () => TopicData | undefined;
  getTopicKeys: () => string[];
  getActiveTopicIndex: () => number;
  getCurrentTopicProgress: () => number;
  getIsLastTopic: () => boolean;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      // Initial state
      courseData: initialCourseContent,
      activeTopic: Object.keys(initialCourseContent)[0],
      progress: Object.keys(initialCourseContent).reduce(
        (acc, topic) => ({ ...acc, [topic]: 0 }),
        {}
      ),
      badges: [],
      aiGeneratedQuizzes: {},
      courseTitle: "Advanced TypeScript",
      completedQuizzes: [],
      divedDeeperTopics: [],
      showConfetti: false,
      isInitialCourse: true,
      showInitialCourseNote: true,
      isGeneratingCourse: false,

      // Actions
      resetCourse: (newCourseData: CourseData, newTitle: string) => {
        const newTopics = Object.keys(newCourseData);
        const newProgress = newTopics.reduce(
          (acc, topic) => ({ ...acc, [topic]: 0 }),
          {}
        );

        set({
          courseData: newCourseData,
          courseTitle: newTitle,
          activeTopic: newTopics[0],
          progress: newProgress,
          badges: [],
          aiGeneratedQuizzes: {},
          completedQuizzes: [],
          divedDeeperTopics: [],
          showConfetti: false,
          isInitialCourse: false,
        });
      },

      updateProgress: (topic: string, chunkIndex: number) => {
        const state = get();
        const currentTopicData = state.courseData[topic];
        if (!currentTopicData) return;

        const newProgressPercentage =
          ((chunkIndex + 1) / currentTopicData.chunks.length) * 100;

        const newProgress = {
          ...state.progress,
          [topic]: Math.max(state.progress[topic] || 0, newProgressPercentage),
        };

        const newBadges =
          newProgressPercentage === 100 && !state.badges.includes(topic)
            ? [...state.badges, topic]
            : state.badges;

        // Check if all topics are completed for confetti
        const showConfetti =
          newBadges.length > 0 &&
          newBadges.length === Object.keys(state.courseData).length;

        set({
          progress: newProgress,
          badges: newBadges,
          showConfetti,
        });
      },

      navigateTopic: (direction: number) => {
        const state = get();
        const topicKeys = Object.keys(state.courseData);
        const activeTopicIndex = topicKeys.indexOf(state.activeTopic);
        const newIndex = activeTopicIndex + direction;

        if (newIndex >= 0 && newIndex < topicKeys.length) {
          set({ activeTopic: topicKeys[newIndex] });
        }
      },

      handleNextTopic: () => {
        const state = get();
        const topicKeys = Object.keys(state.courseData);
        const activeTopicIndex = topicKeys.indexOf(state.activeTopic);
        const newIndex = activeTopicIndex + 1;

        if (newIndex < topicKeys.length) {
          set({ activeTopic: topicKeys[newIndex] });
        }
      },

      handleQuizComplete: (topic: string) => {
        const state = get();
        if (!state.completedQuizzes.includes(topic)) {
          set({
            completedQuizzes: [...state.completedQuizzes, topic],
          });
        }
      },

      updateTopicContent: (topic: string, newTopicData: TopicData) => {
        const state = get();
        const newCourseData = {
          ...state.courseData,
          [topic]: newTopicData,
        };

        const newDivedDeeperTopics = !state.divedDeeperTopics.includes(topic)
          ? [...state.divedDeeperTopics, topic]
          : state.divedDeeperTopics;

        set({
          courseData: newCourseData,
          divedDeeperTopics: newDivedDeeperTopics,
        });
      },

      addAiQuiz: (topic: string, quiz: Quiz) => {
        const state = get();
        set({
          aiGeneratedQuizzes: {
            ...state.aiGeneratedQuizzes,
            [topic]: [...(state.aiGeneratedQuizzes[topic] || []), quiz],
          },
        });
      },

      setActiveTopic: (topic: string) => set({ activeTopic: topic }),
      setShowConfetti: (show: boolean) => set({ showConfetti: show }),
      setShowInitialCourseNote: (show: boolean) =>
        set({ showInitialCourseNote: show }),
      setIsGeneratingCourse: (generating: boolean) =>
        set({ isGeneratingCourse: generating }),

      // Computed getters
      getCurrentTopicData: () => {
        const state = get();
        return state.courseData[state.activeTopic];
      },

      getTopicKeys: () => {
        const state = get();
        return Object.keys(state.courseData);
      },

      getActiveTopicIndex: () => {
        const state = get();
        const topicKeys = Object.keys(state.courseData);
        return topicKeys.indexOf(state.activeTopic);
      },

      getCurrentTopicProgress: () => {
        const state = get();
        return state.progress[state.activeTopic] || 0;
      },

      getIsLastTopic: () => {
        const state = get();
        const topicKeys = Object.keys(state.courseData);
        const activeTopicIndex = topicKeys.indexOf(state.activeTopic);
        return activeTopicIndex === topicKeys.length - 1;
      },
    }),
    {
      name: "course-storage",
      // Only persist essential data, not UI state
      partialize: (state) => ({
        courseData: state.courseData,
        activeTopic: state.activeTopic,
        progress: state.progress,
        badges: state.badges,
        aiGeneratedQuizzes: state.aiGeneratedQuizzes,
        courseTitle: state.courseTitle,
        completedQuizzes: state.completedQuizzes,
        divedDeeperTopics: state.divedDeeperTopics,
        isInitialCourse: state.isInitialCourse,
      }),
    }
  )
);
