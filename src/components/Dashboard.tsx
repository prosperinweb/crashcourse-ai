import { Award } from "lucide-react";
import type { Progress, CourseData } from "../types";

interface DashboardProps {
  progress: Progress;
  badges: string[];
  courseData: CourseData;
}

export const Dashboard = ({ progress, badges, courseData }: DashboardProps) => {
  const topics = Object.keys(courseData);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl sticky top-8">
      <h2 className="text-2xl font-bold text-teal-400 mb-4 border-b-2 border-gray-700 pb-2">
        My Dashboard
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Progress</h3>
        {topics.length > 0 ? (
          <ul className="space-y-3">
            {topics.map((topicKey) => (
              <li key={topicKey}>
                <span className="capitalize text-gray-400">
                  {courseData[topicKey].title}
                </span>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress[topicKey] || 0}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No course loaded.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Badges Earned
        </h3>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {badges.map((badgeKey) => (
              <div
                key={badgeKey}
                className="flex flex-col items-center p-3 bg-yellow-900/30 rounded-lg"
                title={`Mastered ${courseData[badgeKey]?.title}`}
              >
                <Award className="text-yellow-400" size={32} />
                <span className="text-xs mt-1 text-yellow-300 capitalize">
                  {courseData[badgeKey]?.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Complete a topic to earn a badge!</p>
        )}
      </div>
    </div>
  );
};
