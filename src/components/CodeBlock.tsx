import { useState } from "react";
import ReactMarkdown from "react-markdown";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Loader, Sparkles } from "lucide-react";
import { callGeminiAPI } from "../utils/geminiApi";

// Register the language for the syntax highlighter
SyntaxHighlighter.registerLanguage("typescript", typescript);

interface CodeBlockProps {
  code: string;
}

export const CodeBlock = ({ code }: CodeBlockProps) => {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getExplanation = async () => {
    setIsLoading(true);
    setExplanation("");
    const prompt = `You are a friendly expert tutor. Explain the following code snippet line-by-line in a way that is easy for a beginner to understand. Focus on the 'why' behind the code, not just the 'what'. Format your response using markdown, including things like lists, bolding, and inline code snippets. Code: \`\`\`\n${code}\n\`\`\``;
    const result = await callGeminiAPI(prompt);
    setExplanation(result);
    setIsLoading(false);
  };

  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      backgroundColor: "#111827",
      borderRadius: "0.5rem",
      padding: "1rem",
      fontSize: "0.875rem",
    },
  };

  return (
    <div className="my-4 overflow-hidden shadow-inner relative bg-gray-900 rounded-lg">
      <SyntaxHighlighter
        language="typescript"
        style={customStyle}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={getExplanation}
        disabled={isLoading}
        className="absolute top-2 right-2 bg-teal-500/80 hover:bg-teal-500 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center transition disabled:bg-gray-600"
      >
        {isLoading ? (
          <Loader className="animate-spin mr-1" size={14} />
        ) : (
          <Sparkles className="mr-1" size={14} />
        )}
        Explain Code
      </button>
      {isLoading && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center text-teal-400">
            <Loader className="animate-spin mr-2" />
            <span>Getting explanation...</span>
          </div>
        </div>
      )}
      {explanation && (
        <div className="p-4 border-t border-gray-700 text-gray-300 prose prose-invert prose-sm max-w-none prose-pre:bg-gray-800 prose-pre:p-2 prose-pre:rounded-md">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    style={customStyle}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className}>{children}</code>
                );
              },
            }}
          >
            {explanation}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};
