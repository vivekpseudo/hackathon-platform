import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRegistrations } from '../api/competitions';
import { useLocalAuth } from '../context/AuthContext';
import { makePutRequest, makeGetRequest } from '../libs/axios';
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
    competition_organiser?: any;
  };
  isCreated?: boolean;
  isJoined?: boolean;
}

const HackathonManagementPage: React.FC = () => {
  const { user } = useLocalAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHackathons();
  }, [user]);

  const fetchHackathons = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Fetch all hackathons
      const allResponse = await makeGetRequest(
        '/competitions?populate[competition_organiser][populate]=users_permissions_user&pagination[limit]=100&sort[0]=createdAt:desc'
      );
      const allHackathons: Hackathon[] = allResponse.data || [];

      // 2️⃣ Fetch user registrations
      const registrationsResponse = await getUserRegistrations(user.email, 0, 1000);
      const joinedIds = new Set<number>();
      if (registrationsResponse.data && Array.isArray(registrationsResponse.data)) {
        registrationsResponse.data.forEach((reg: any) => {
          const id = reg.attributes?.competition?.data?.id;
          if (id) joinedIds.add(id);
        });
      }

      // 3️⃣ Mark hackathons as joined/created
      const processedHackathons = allHackathons.map(h => {
        // Fix: ensure organisers is always an array
        const organisersData = h.attributes.competition_organiser?.data;
        const organisersArray = Array.isArray(organisersData)
          ? organisersData
          : organisersData
          ? [organisersData]
          : [];

        const isCreated = organisersArray.some(
          (org: any) => org.attributes.users_permissions_user?.data?.id === user.id
        );
        const isJoined = joinedIds.has(h.id);

        return { ...h, isCreated, isJoined };
      });

      setHackathons(processedHackathons);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await makePutRequest(`competitions/${id}`, { data: { publishedAt: new Date().toISOString() } });
      setHackathons(prev =>
        prev.map(h => (h.id === id ? { ...h, attributes: { ...h.attributes, publishedAt: new Date().toISOString() } } : h))
      );
      toast.success('Published successfully!');
    } catch {
      toast.error('Failed to publish');
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await makePutRequest(`competitions/${id}`, { data: { publishedAt: null } });
      setHackathons(prev =>
        prev.map(h => (h.id === id ? { ...h, attributes: { ...h.attributes, publishedAt: null } } : h))
      );
      toast.success('Unpublished successfully!');
    } catch {
      toast.error('Failed to unpublish');
    }
  };

  const handleEdit = (id: number) => navigate(`/hackathons-management/${id}/edit`);
  const handleView = (id: number) => navigate(`/hackathons/${id}`);
  const handleSubmission = (id: number) => navigate(`/hackathons/${id}/submission`);

  const filteredHackathons = hackathons.filter(h =>
    h.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Split hackathons - Show ALL created and joined hackathons
  const createdHackathons = filteredHackathons.filter(h => h.isCreated);
  const joinedHackathons = filteredHackathons.filter(h => h.isJoined);

  if (loading) return <p className="text-center py-8">Loading hackathons...</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hackathon Management</h1>
          <p className="text-gray-600">View, join, and create hackathons</p>
        </div>
        <Link
          to="/hackathons-management/create"
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded font-semibold"
        >
          + Create Hackathon
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <input
        type="text"
        placeholder="Search hackathons..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6"
      />

      {/* Created by Me */}
      <h2 className="text-2xl font-bold mb-4">Created by Me ({createdHackathons.length})</h2>
      {createdHackathons.length === 0 && <p className="text-gray-500 mb-4">You haven't created any hackathons yet.</p>}
      <div className="grid md:grid-cols-1 gap-4 mb-8">
        {createdHackathons.map(h => (
          <div key={h.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg">{h.attributes.Title}</h3>
              <p className="text-gray-600 text-sm">
                Start: {new Date(h.attributes.startDate).toLocaleDateString()} | End: {new Date(h.attributes.endDate).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-1">
                {h.attributes.publishedAt && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Published</span>}
                {h.isJoined && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Joined</span>}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
              <button onClick={() => handleView(h.id)} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">View</button>
              <button onClick={() => handleEdit(h.id)} className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm">Edit</button>
              {h.attributes.publishedAt
                ? <button onClick={() => handleUnpublish(h.id)} className="bg-orange-500 hover:bg-orange-700 text-white py-1 px-3 rounded text-sm">Unpublish</button>
                : <button onClick={() => handlePublish(h.id)} className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded text-sm">Publish</button>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Joined by Me */}
      <h2 className="text-2xl font-bold mb-4">Joined by Me ({joinedHackathons.length})</h2>
      {joinedHackathons.length === 0 && <p className="text-gray-500 mb-4">You haven't joined any hackathons yet.</p>}
      <div className="grid md:grid-cols-1 gap-4">
        {joinedHackathons.map(h => (
          <div key={h.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg">{h.attributes.Title}</h3>
              <p className="text-gray-600 text-sm">
                Start: {new Date(h.attributes.startDate).toLocaleDateString()} | End: {new Date(h.attributes.endDate).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-1">
                {h.attributes.publishedAt && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Published</span>}
                {h.isCreated && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">Created by You</span>}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
              <button onClick={() => handleView(h.id)} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">View</button>
              <button onClick={() => handleSubmission(h.id)} className="bg-purple-500 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm">Submission</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HackathonManagementPage;
