 
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, fetchClientProjects } from '../../store/slices/clientSlice';
import LoadingSpinner from '../UI/LoadingSpinner';
import { formatTRN } from '../../utils/formatters';

const ClientList = () => {
  const dispatch = useDispatch();
  const { list: clients, selectedClientProjects, loading, error } = useSelector(state => state.clients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    dispatch(fetchClientProjects(client.client_name));
  };

  const filteredClients = clients.filter(client =>
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clients Panel */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
            <h2 className="text-xl font-bold text-white">Clients Directory</h2>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="p-4 text-red-500">{error}</div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.client_name}
                  className={`p-4 cursor-pointer transition-colors duration-150 hover:bg-gray-50
                    ${selectedClient?.client_name === client.client_name ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.client_name}</h3>
                      <p className="text-sm text-gray-500">TRN: {formatTRN(client.trn)}</p>
                    </div>
                    <div className="text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Projects Panel */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
            <h2 className="text-xl font-bold text-white">
              {selectedClient ? `${selectedClient.client_name}'s Projects` : 'Projects'}
            </h2>
            <p className="text-indigo-100 mt-1">
              {selectedClient ? `TRN: ${formatTRN(selectedClient.trn)}` : 'Select a client to view projects'}
            </p>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {!selectedClient ? (
              <div className="p-8 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-4">Select a client to view their projects</p>
              </div>
            ) : selectedClientProjects.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No projects found for this client</p>
              </div>
            ) : (
              selectedClientProjects.map((project) => (
                <div key={project.project_code} className="p-4 hover:bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-600 rounded-full">
                          {project.project_code}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        TRN: {formatTRN(project.trn)}
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{project.project_name}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList;