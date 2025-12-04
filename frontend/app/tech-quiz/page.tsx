'use client';

import { useState } from 'react';
import { generateQuiz, evaluateQuiz, QuizRequest, QuizResponse, QuizEvaluationResponse } from '@/lib/api';
import Link from 'next/link';

export default function TechQuiz() {
    const [formData, setFormData] = useState<QuizRequest>({
        role: '',
        skill_level: 'intermediate',
        num_questions: 5,
    });
    const [quiz, setQuiz] = useState<QuizResponse | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [evaluation, setEvaluation] = useState<QuizEvaluationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setQuiz(null);
        setEvaluation(null);
        setUserAnswers({});

        try {
            const response = await generateQuiz(formData);
            setQuiz(response);
        } catch (err) {
            setError('Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluate = async () => {
        if (!quiz) return;

        setEvaluating(true);
        setError('');

        try {
            const answersList = quiz.questions.map((q, idx) => ({
                question: q.question,
                answer: userAnswers[idx] || 'No answer provided'
            }));

            const response = await evaluateQuiz({ answers: answersList });
            setEvaluation(response);
        } catch (err) {
            setError('Failed to evaluate answers. Please try again.');
        } finally {
            setEvaluating(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">Technical Assessment Generator</h1>

                {!quiz ? (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role/Position
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Frontend Developer, Data Scientist"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skill Level
                                </label>
                                <select
                                    value={formData.skill_level}
                                    onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Questions
                                </label>
                                <input
                                    type="number"
                                    min="3"
                                    max="10"
                                    value={formData.num_questions}
                                    onChange={(e) => setFormData({ ...formData, num_questions: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? 'Generating...' : 'Start Quiz'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Quiz: {formData.role} ({formData.skill_level})
                            </h2>
                            <button
                                onClick={() => setQuiz(null)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>

                        {quiz.questions.map((q, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Question {idx + 1}
                                    </h3>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                                            {q.difficulty}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {q.topic}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{q.question}</p>

                                {!evaluation ? (
                                    <textarea
                                        value={userAnswers[idx] || ''}
                                        onChange={(e) => setUserAnswers({ ...userAnswers, [idx]: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Type your answer here..."
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Your Answer</span>
                                            <p className="text-gray-800 mt-1">{userAnswers[idx] || 'No answer provided'}</p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded border border-green-200">
                                            <span className="text-xs font-semibold text-green-700 uppercase">Correct Answer</span>
                                            <p className="text-gray-800 mt-1">{q.answer}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {!evaluation ? (
                            <button
                                onClick={handleEvaluate}
                                disabled={evaluating}
                                className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
                            >
                                {evaluating ? 'Evaluating Answers...' : 'Submit Answers'}
                            </button>
                        ) : (
                            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-100">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Assessment Results</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                                        <div className="text-sm text-gray-500 font-semibold uppercase mb-2">Overall Score</div>
                                        <div className={`text-5xl font-bold ${evaluation.score >= 70 ? 'text-green-600' :
                                                evaluation.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {evaluation.score}/100
                                        </div>
                                    </div>

                                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                                        <div className="text-sm text-gray-500 font-semibold uppercase mb-2">Confidence Level</div>
                                        <div className={`text-4xl font-bold ${evaluation.confidence_level === 'High' ? 'text-green-600' :
                                                evaluation.confidence_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {evaluation.confidence_level}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">📝 Feedback</h3>
                                    <p className="text-gray-700 leading-relaxed bg-blue-50 p-6 rounded-lg">
                                        {evaluation.feedback}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setQuiz(null);
                                        setEvaluation(null);
                                        setUserAnswers({});
                                    }}
                                    className="w-full mt-8 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium"
                                >
                                    Start New Quiz
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
