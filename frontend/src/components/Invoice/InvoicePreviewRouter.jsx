import React from 'react';
import StandardInvoicePreview from './StandardInvoicePreview';
import AliSonsInvoicePreview from './AliSonsInvoicePreview';

const InvoicePreviewRouter = ({ client, project, formData, onBack }) => {
  const isAliSons = client?.client_name?.toLowerCase().includes("ali & sons");

  if (isAliSons) {
    return (
      <AliSonsInvoicePreview 
        client={client}
        project={project}
        formData={formData}
        onBack={onBack}
      />
    );
  }
  
  return (
    <StandardInvoicePreview 
      client={client} 
      project={project} 
      formData={formData} 
      onBack={onBack} 
    />
  );
};

export default InvoicePreviewRouter;