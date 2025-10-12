import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCompetitions } from '../api/competitions';
import { makePutRequest } from '../libs/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Hackathon {
  id: number;
  attributes: {
    Title: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    publishedAt: string | null;
    createdAt: string;
  };
}

const HackathonManagementPage: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCompetitions(0, 100);
      console.log('Fetched response:', response);
      setHackathons(response.data || []);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: number, title: string) => {
    if (window.confirm(`Publish "${title}"?`)) {
      try {
        await makePutRequest(`competitions/${id}`, {
          data: { publishedAt: new Date().toISOString() },
        });
        setHackathons(prev =>
          prev.map(h =>
            h.id === id
              ? { ...h, attributes: { ...h.attributes, publishedAt: new Date().toISOString() } }
              : h
          )
        );
        toast.success(`Published successfully!`);
      } catch (err: any) {
        toast.error(`Failed to publish`);
      }
    }
  };

  const handleUnpublish = async (id: number, title: string) => {
    if (window.confirm(`Unpublish "${title}"?`)) {
      try {
        await makePutRequest(`competitions/${id}`, { data: { publishedAt: null } });
        setHackathons(prev =>
          prev.map(h =>
            h.id === id ? { ...h, attributes: { ...h.attributes, publishedAt: null } } : h
          )
        );
        toast.success(`Unpublished successfully!`);
      } catch (err: any) {
        toast.error(`Failed to unpublish`);
      }
    }
  };

  const handleEdit = (id: number) => navigate(`/hackathons-management/${id}/edit`);
  const handleView = (id: number) => navigate(`/hackathons/${id}`);

  const filteredHackathons = hackathons.filter(h =>
    h.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Loading hackathons...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hackathon Management</h1>
        <p className="text-gray-600">Manage your hackathons and track their status</p>
      </div>

      <div className="mb-6">
        <Link
          to="/hackathons-management/create"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded inline-flex items-center gap-2"
        >
          + Create New Hackathon
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button onClick={fetchHackathons} className="mt-2 text-red-600 underline">
            Try Again
          </button>
        </div>
      )}

      {hackathons.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search hackathons..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {filteredHackathons.length > 0 ? (
        <div className="shadow-md rounded-lg overflow-hidden bg-white">
          <div className="hidden md:block">
            <div className="bg-gray-100 py-4 px-6 grid grid-cols-6 gap-4 font-semibold text-gray-700 border-b">
              <div>Title</div>
              <div>Start Date</div>
              <div>End Date</div>
              <div>Status</div>
              <div>Created</div>
              <div>Actions</div>
            </div>

            {filteredHackathons.map(hackathon => (
              <div key={hackathon.id} className="py-4 px-6 grid grid-cols-6 gap-4 items-center border-b hover:bg-gray-50">
                <div className="font-semibold text-gray-800 truncate">{hackathon.attributes.Title}</div>
                <div className="text-gray-600 text-sm">{new Date(hackathon.attributes.startDate).toLocaleDateString()}</div>
                <div className="text-gray-600 text-sm">{new Date(hackathon.attributes.endDate).toLocaleDateString()}</div>
                <div>
                  {hackathon.attributes.publishedAt ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Published</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">Draft</span>
                  )}
                </div>
                <div className="text-gray-600 text-sm">{new Date(hackathon.attributes.createdAt).toLocaleDateString()}</div>
                <div className="flex gap-2">
                  <button onClick={() => handleView(hackathon.id)} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs font-semibold">View</button>
                  <button onClick={() => handleEdit(hackathon.id)} className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded text-xs font-semibold">Edit</button>
                  {hackathon.attributes.publishedAt ? (
                    <button onClick={() => handleUnpublish(hackathon.id, hackathon.attributes.Title)} className="bg-orange-500 hover:bg-orange-700 text-white py-1 px-2 rounded text-xs font-semibold">Unpublish</button>
                  ) : (
                    <button onClick={() => handlePublish(hackathon.id, hackathon.attributes.Title)} className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded text-xs font-semibold">Publish</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-4 p-4">
            {filteredHackathons.map(hackathon => (
              <div key={hackathon.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 text-lg mb-1">{hackathon.attributes.Title}</h3>
                <div className="flex gap-2 mb-2">
                  {hackathon.attributes.publishedAt ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Published</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Draft</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <p><strong>Starts:</strong> {new Date(hackathon.attributes.startDate).toLocaleDateString()}</p>
                  <p><strong>Ends:</strong> {new Date(hackathon.attributes.endDate).toLocaleDateString()}</p>
                  <p><strong>Created:</strong> {new Date(hackathon.attributes.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleView(hackathon.id)} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm font-semibold flex-1">View</button>
                  <button onClick={() => handleEdit(hackathon.id)} className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm font-semibold flex-1">Edit</button>
                  {hackathon.attributes.publishedAt ? (
                    <button onClick={() => handleUnpublish(hackathon.id, hackathon.attributes.Title)} className="bg-orange-500 hover:bg-orange-700 text-white py-1 px-3 rounded text-sm font-semibold flex-1">Unpublish</button>
                  ) : (
                    <button onClick={() => handlePublish(hackathon.id, hackathon.attributes.Title)} className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded text-sm font-semibold flex-1">Publish</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">{searchTerm ? 'No hackathons found.' : 'No hackathons created yet.'}</p>
          <Link to="/hackathons-management/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">Create Your First Hackathon</Link>
        </div>
      )}

      {hackathons.length > 0 && (
        <div className="mt-6 text-sm text-gray-600">
          <p>Showing {filteredHackathons.length} of {hackathons.length} hackathons</p>
        </div>
      )}
    </div>
  );
};

export default HackathonManagementPage;