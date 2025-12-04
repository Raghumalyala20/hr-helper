'use client';

import { useState, useRef } from 'react';
import { analyzeAudio, AudioAnalysisResponse } from '@/lib/api';
import Link from 'next/link';

export default function LiveInterview() {
    const [isRecording, setIsRecording] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AudioAnalysisResponse | null>(null);
    const [error, setError] = useState('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setError('');
            setResult(null);
        } catch (err) {
            setError('Could not access microphone. Please ensure you have granted permission.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                await handleAnalysis(audioBlob);

                // Stop all tracks to release microphone
                mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleAnalysis = async (audioBlob: Blob) => {
        setAnalyzing(true);
        try {
            const response = await analyzeAudio(audioBlob);
            setResult(response);
        } catch (err) {
            setError('Failed to analyze audio. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">Live Interview Assistant</h1>

                <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
                    <div className="mb-8">
                        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
                            }`}>
                            {isRecording ? (
                                <div className="w-8 h-8 bg-red-600 rounded-sm" />
                            ) : (
                                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {isRecording ? 'Recording...' : 'Ready to Record'}
                        </h2>
                        <p className="text-gray-600">
                            {isRecording
                                ? 'Listening to candidate answer...'
                                : 'Click the button below when the candidate starts answering.'}
                        </p>
                    </div>

                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={analyzing}
                        className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${isRecording
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {analyzing ? 'Analyzing...' : isRecording ? 'Stop & Analyze' : 'Start Recording'}
                    </button>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {result && (
                    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-100 animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Analysis Results</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-sm text-gray-500 font-semibold uppercase mb-2">Confidence Score</div>
                                <div className={`text-5xl font-bold ${result.confidence_score >= 80 ? 'text-green-600' :
                                        result.confidence_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {result.confidence_score}
                                </div>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-sm text-gray-500 font-semibold uppercase mb-2">Confidence Level</div>
                                <div className={`text-3xl font-bold ${result.confidence_level === 'High' ? 'text-green-600' :
                                        result.confidence_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {result.confidence_level}
                                </div>
                            </div>

                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-sm text-gray-500 font-semibold uppercase mb-2">Detected Tone</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {result.tone}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">📝 Summary</h3>
                                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                                    {result.summary}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">💬 Transcription</h3>
                                <p className="text-gray-600 italic bg-gray-50 p-4 rounded-lg text-sm">
                                    "{result.transcription}"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
