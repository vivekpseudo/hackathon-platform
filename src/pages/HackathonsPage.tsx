import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompetitions } from '../hooks/useCompetitions';
import { NodeType } from "../types/richText";
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Extracts plain text from rich text nodes and truncates to specified word count
 */
const extractAndTruncateText = (nodes: NodeType[], maxWords: number = 50): string => {
  const extractText = (node: any): string => {
    if (!node) return '';
    
    // Handle text nodes
    if (node.type === 'text' && node.text) {
      return node.text;
    }
    
    // Handle nodes with children
    if (node.children && Array.isArray(node.children)) {
      return node.children.map((child: any) => extractText(child)).join('');
    }
    
    // Handle nodes with content (TipTap format)
    if (node.content && Array.isArray(node.content)) {
      return node.content.map((child: any) => extractText(child)).join(' ');
    }
    
    return '';
  };

  // Extract all text
  const fullText = nodes.map(node => extractText(node)).join(' ').trim();
  
  // Split into words and truncate
  const words = fullText.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length <= maxWords) {
    return fullText;
  }
  
  return words.slice(0, maxWords).join(' ') + '...';
};

const HackathonsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  const { getCompetitionsData } = useCompetitions();
  const { data, isSuccess } = getCompetitionsData;

  const hackathons = isSuccess && data.data
    ? data.data.map((d: any) => {
        // If the API returns Strapi-like objects with an "attributes" wrapper, merge them,
        // otherwise return the object as-is.
        if (d && d.attributes) {
          return { ...d, ...d.attributes };
        }
        return d;
      })
    : [];
  console.log('Fetched competitions data:', hackathons); // Debug log

  // Calculate pagination
  const totalPages = Math.ceil(hackathons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHackathons = hackathons.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Hackathons</h1>
        {isSuccess && hackathons.length > 0 && (
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, hackathons.length)} of {hackathons.length} hackathons
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isSuccess && <p>Loading hackathons...</p>}
        {isSuccess && currentHackathons.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-8">No hackathons found.</p>
        )}
        {isSuccess && currentHackathons.map((hackathon) => (
          <div key={hackathon.id} className="bg-white rounded-md shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{hackathon.Title}</h2>

            {/* Truncated description preview */}
            <div className="text-gray-600 mb-3 text-sm">
              {hackathon.description && (
                <p className="line-clamp-3">
                  {Array.isArray(hackathon.description) 
                    ? extractAndTruncateText(hackathon.description, 50)
                    : typeof hackathon.description === 'string'
                    ? hackathon.description.split(/\s+/).slice(0, 50).join(' ') + 
                      (hackathon.description.split(/\s+/).length > 50 ? '...' : '')
                    : extractAndTruncateText([hackathon.description], 50)
                  }
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-1">
              Starts: {new Date(hackathon.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Ends: {new Date(hackathon.endDate).toLocaleDateString()}
            </p>
            {hackathon.type && (
              <p className="text-sm text-gray-500 mb-1">Mode: {hackathon.type}</p>
            )}
            {hackathon.prize && (
              <p className="text-sm text-green-600 font-semibold">
                Prize: {hackathon.prize}
              </p>
            )}
            <Link
              to={`/hackathons/${hackathon.id}`}
              className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {isSuccess && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => goToPage(page as number)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HackathonsPage;

  

  