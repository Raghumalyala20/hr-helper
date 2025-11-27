'use client';

import { useState } from 'react';
import { screenCV, CVScreenResponse } from '@/lib/api';
import Link from 'next/link';

export default function CVScreener() {
    const [cvFile, setCVFile] = useState<File | null>(null);
    const [jdText, setJDText] = useState('');
    const [result, setResult] = useState<CVScreenResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
                setCVFile(file);
                setError('');
            } else {
                setError('Please upload a PDF or DOCX file');
                setCVFile(null);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cvFile) {
            setError('Please upload a CV file');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await screenCV(cvFile, jdText);
            setResult(response);
        } catch (err) {
            setError('Failed to screen CV. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">CV Screener</h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload CV (PDF or DOCX)
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {cvFile && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Selected: {cvFile.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                value={jdText}
                                onChange={(e) => setJDText(e.target.value)}
                                rows={10}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Paste the job description here..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !cvFile}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? 'Analyzing...' : 'Screen CV'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {result && (
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Score</h2>
                            <div className={`text-6xl font-bold ${getScoreColor(result.match_score)}`}>
                                {result.match_score}%
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">✅ Strengths</h3>
                            <ul className="space-y-2">
                                {result.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        <span className="text-gray-700">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">⚠️ Gaps</h3>
                            <ul className="space-y-2">
                                {result.gaps.map((gap, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-red-500 mr-2">•</span>
                                        <span className="text-gray-700">{gap}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">💡 Recommendation</h3>
                            <p className="text-gray-700">{result.recommendation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
