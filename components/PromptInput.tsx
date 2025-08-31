
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isDisabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, isDisabled }) => {
  return (
    <div className="w-full">
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
        Enter your video prompt
      </label>
      <textarea
        id="prompt"
        rows={4}
        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="e.g., A majestic lion waking up at sunrise in the savanna, cinematic lighting"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isDisabled}
      />
    </div>
  );
};

export default PromptInput;
