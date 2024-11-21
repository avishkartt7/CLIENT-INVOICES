// frontend/src/components/Dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, fetchClientProjects } from '../../store/slices/clientSlice';
import InvoiceForm from '../Invoice/InvoiceForm';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: clients, selectedClientProjects, loading, error } = useSelector(state => state.clients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setSelectedProject(null);
    setShowInvoice(false);
    dispatch(fetchClientProjects(client.client_name));
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowInvoice(true);
  };

  const handleBackToList = () => {
    setShowInvoice(false);
    setSelectedProject(null);
  };

  // If showing invoice form
  if (showInvoice && selectedProject && selectedClient) {
    return (
      <div className="container mx-auto p-4">
        <InvoiceForm 
          client={selectedClient}
          project={selectedProject}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clients Panel */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-xl font-bold">Clients</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="text-center py-4">Loading clients...</div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : (
              <div className="space-y-2">
                {clients?.map((client) => (
                  <div
                    key={client.client_name}
                    onClick={() => handleClientClick(client)}
                    className={`p-4 rounded-lg cursor-pointer border transition-colors
                      ${selectedClient?.client_name === client.client_name 
                        ? 'bg-blue-50 border-blue-500' 
                        : 'hover:bg-gray-50 border-gray-200'}`}
                  >
                    <h3 className="font-medium">{client.client_name}</h3>
                    <p className="text-sm text-gray-600">TRN: {client.trn}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects Panel */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 bg-indigo-600 text-white">
            <h2 className="text-xl font-bold">
              {selectedClient ? `Projects for ${selectedClient.client_name}` : 'Projects'}
            </h2>
          </div>
          <div className="p-4">
            {!selectedClient ? (
              <div className="text-center py-4 text-gray-500">
                Select a client to view projects
              </div>
            ) : selectedClientProjects.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No projects found for this client
              </div>
            ) : (
              <div className="space-y-2">
                {selectedClientProjects.map((project) => (
                  <div
                    key={project.project_code}
                    onClick={() => handleProjectClick(project)}
                    className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                          {project.project_code}
                        </span>
                        <h3 className="font-medium mt-2">{project.project_name}</h3>
                        <p className="text-sm text-gray-600 mt-1">TRN: {project.trn}</p>
                        {project.contract_value && (
                          <p className="text-sm text-gray-600">
                            Contract Value: {new Intl.NumberFormat('en-AE', {
                              style: 'currency',
                              currency: 'AED'
                            }).format(project.contract_value)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;