import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, fetchClientProjects } from '../store/slices/clientSlice';
import InvoiceGenerator from './Invoice/InvoiceGenerator';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: clients, selectedClientProjects, loading, error } = useSelector(state => state.clients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setSelectedProject(null);
    setShowInvoiceGenerator(false);
    dispatch(fetchClientProjects(client.client_name));
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowInvoiceGenerator(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clients Panel */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Clients</h2>
          </div>
          <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
            {clients && clients.map((client) => (
              <div
                key={client.client_name}
                onClick={() => handleClientClick(client)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${selectedClient?.client_name === client.client_name ? 'bg-blue-50' : ''}`}
              >
                <h3 className="font-medium">{client.client_name}</h3>
                <p className="text-sm text-gray-600">TRN: {client.trn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Panel */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              {selectedClient ? `${selectedClient.client_name}'s Projects` : 'Projects'}
            </h2>
          </div>
          <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
            {selectedClientProjects.map((project) => (
              <div
                key={project.project_code}
                onClick={() => handleProjectClick(project)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${selectedProject?.project_code === project.project_code ? 'bg-blue-50' : ''}`}
              >
                <h3 className="font-medium">{project.project_name}</h3>
                <p className="text-sm text-gray-600">Code: {project.project_code}</p>
                <p className="text-sm text-gray-600">TRN: {project.trn}</p>
              </div>
            ))}
            {selectedClient && selectedClientProjects.length === 0 && (
              <div className="p-4 text-gray-500">No projects found</div>
            )}
            {!selectedClient && (
              <div className="p-4 text-gray-500">Select a client to view projects</div>
            )}
          </div>
        </div>

        {/* Invoice Generator Panel */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Invoice Generator</h2>
          </div>
          <div className="p-4">
            {showInvoiceGenerator && selectedClient && selectedProject ? (
              <InvoiceGenerator 
                clientData={selectedClient} 
                projectData={selectedProject}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a client and project to generate invoice
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;