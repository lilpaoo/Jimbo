import React, { useState, useRef } from 'react';
import { analyzeWorkoutForm } from '../services/geminiService';

const VideoAnalysis: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exerciseType, setExerciseType] = useState('Squat');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoSrc(URL.createObjectURL(file));
      setFeedback(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setError(null);
    setFeedback(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setError("Could not get canvas context.");
        setLoading(false);
        return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      const result = await analyzeWorkoutForm(base64Image, exerciseType);
      setFeedback(result);
    } catch (err)
      {
      setError('Failed to analyze video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI-Powered Video Analysis</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary">Let me be your second pair of eyes. Upload a video to get instant feedback on your form.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">1. Upload Your Video</h2>
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Exercise Type</label>
                <select 
                    value={exerciseType} 
                    onChange={(e) => setExerciseType(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
                >
                    <option>Squat</option>
                    <option>Push-up</option>
                    <option>Deadlift</option>
                    <option>Bicep Curl</option>
                </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Video File</label>
              <input type="file" accept="video/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            </div>
            {videoSrc && (
              <div className="mt-4">
                <video ref={videoRef} src={videoSrc} controls className="w-full rounded-lg" />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
            <button onClick={handleAnalyze} disabled={!videoFile || loading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400">
              {loading ? 'Analyzing...' : 'Analyze My Form'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">2. AI Feedback</h2>
          {error && <div className="text-red-500">{error}</div>}
          {loading && <div className="text-center">Analyzing frame, please wait...</div>}
          {feedback ? (
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br />') }} />
          ) : (
            <p className="text-gray-500 dark:text-dark-text-secondary">Your feedback will appear here after analysis.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysis;