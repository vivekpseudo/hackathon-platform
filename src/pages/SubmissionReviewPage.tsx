import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Placeholder data for a submission
const placeholderSubmission = {
  id: 'sub1',
  hackathonId: 1,
  title: 'AI-Powered Plant Disease Detector',
  description: 'An application that uses machine learning to identify diseases in plant leaves based on images.',
  link: 'https://github.com/example/plant-disease-detector',
  submittedBy: 'userA',
};

// Placeholder evaluation criteria
const evaluationCriteria = [
  { id: 'innovation', name: 'Innovation', maxScore: 10 },
  { id: 'impact', name: 'Potential Impact', maxScore: 10 },
  { id: 'technical', name: 'Technical Complexity', maxScore: 10 },
  { id: 'presentation', name: 'Presentation & Demo', maxScore: 10 },
];

const SubmissionReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Submission ID
  const submissionId = id; // For now, we're just using the ID from the route
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState('');

  const handleScoreChange = (criterionId, value) => {
    setScores({ ...scores, [criterionId]: parseInt(value) });
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmitEvaluation = () => {
    // In a real application, you would send the scores and feedback to the backend
    console.log('Evaluation submitted for submission:', submissionId, 'Scores:', scores, 'Feedback:', feedback);
    alert('Evaluation submitted!');
    // You might want to redirect the judge or show a confirmation
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Submission Review</h1>

      {placeholderSubmission ? (
        <div className="bg-white rounded-md shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{placeholderSubmission.title}</h2>
          <p className="text-gray-600 mb-3">{placeholderSubmission.description}</p>
          <p className="text-sm text-blue-500 mb-2">
            Link: <a href={placeholderSubmission.link} target="_blank" rel="noopener noreferrer" className="underline">
              {placeholderSubmission.link}
            </a>
          </p>

          <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Evaluation</h3>
          <form onSubmit={handleSubmitEvaluation}>
            {evaluationCriteria.map((criterion) => (
              <div key={criterion.id} className="mb-4">
                <label htmlFor={`score-${criterion.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                  {criterion.name} (Max Score: {criterion.maxScore})
                </label>
                <input
                  type="number"
                  id={`score-${criterion.id}`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  max={criterion.maxScore}
                  value={scores[criterion.id] || ''}
                  onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                />
              </div>
            ))}

            <div className="mb-6">
              <label htmlFor="feedback" className="block text-gray-700 text-sm font-bold mb-2">
                Feedback
              </label>
              <textarea
                id="feedback"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
                value={feedback}
                onChange={handleFeedbackChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit Evaluation
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-600">Submission not found.</p>
      )}

      <Link to="/" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Back to Home
      </Link>
    </div>
  );
};

export default SubmissionReviewPage;