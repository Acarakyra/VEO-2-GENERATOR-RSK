
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  prompt: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, prompt }) => {
  const downloadFileName = prompt.substring(0, 30).replace(/\s+/g, '_') + '.mp4'

  return (
    <div className="w-full bg-gray-800 rounded-lg border border-gray-700 p-4">
      <video
        src={videoUrl}
        controls
        autoPlay
        loop
        className="w-full rounded-md aspect-video bg-black"
      >
        Your browser does not support the video tag.
      </video>
      <a
        href={videoUrl}
        download={downloadFileName}
        className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-transform transform hover:scale-105"
      >
        Download Video
      </a>
    </div>
  );
};

export default VideoPlayer;
