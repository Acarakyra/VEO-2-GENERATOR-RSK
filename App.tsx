import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import AspectRatioSelector from './components/AspectRatioSelector';
import Loader from './components/Loader';
import VideoPlayer from './components/VideoPlayer';
import { generateVideo } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';
import type { AspectRatio, ImageData } from './types';
import ImageUploader from './components/ImageUploader';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<ImageData | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      let messageIndex = 0;
      interval = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 4000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

  const handleGenerateClick = useCallback(async () => {
    if (!prompt || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const imageInput = image ? { data: image.data, mimeType: image.mimeType } : null;
      const url = await generateVideo(prompt, aspectRatio, imageInput);
      setVideoUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate video. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, isLoading, image]);
  
  // Cleanup object URL when component unmounts or videoUrl changes
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <Header />

        <main className="w-full max-w-4xl mx-auto mt-6 flex-grow">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 space-y-6 shadow-2xl">
            <PromptInput 
              prompt={prompt} 
              setPrompt={setPrompt} 
              isDisabled={isLoading} 
            />
            
            <ImageUploader 
              onImageChange={setImage}
              isDisabled={isLoading}
            />

            <AspectRatioSelector
              selectedRatio={aspectRatio}
              onRatioChange={setAspectRatio}
              isDisabled={isLoading}
            />

            <button
              onClick={handleGenerateClick}
              disabled={!prompt || isLoading}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? 'Generating...' : 'Generate Video'}
            </button>
          </div>

          <div className="mt-8">
            {isLoading && <Loader message={loadingMessage} />}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {videoUrl && <VideoPlayer videoUrl={videoUrl} prompt={prompt} />}
          </div>
        </main>
        <footer className="text-center py-6 mt-8">
            <p className="text-sm text-gray-500">
                VEO-2 Video Generator by AKURSK
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;