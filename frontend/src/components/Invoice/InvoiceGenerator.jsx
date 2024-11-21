// frontend/src/components/Invoice/InvoiceGenerator.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const InvoiceGenerator = ({ clientData, projectData }) => {
  const [invoiceData, setInvoiceData] = useState({
    serialNumber: '',
    taxInvoiceRef: '',
    taxInvoiceDate: new Date().toISOString().split('T')[0],
    paymentCertificateNo: '',
    paymentCertificateDate: new Date().toISOString().split('T')[0],
    cumulativeValue: '',
    selectedBank: 'ADCB',
    entries: []
  });

  const [deductionOptions, setDeductionOptions] = useState({
    advanceRelease: false,
    retentionRelease: false,
    advanceRecovery: false,
    retentionDeduction: false,
    ncrDeduction: false,
    otherDeduction: false
  });

  // Calculate VAT and totals
  const calculateValues = (amount) => {
    const taxable = parseFloat(amount) || 0;
    const vat = taxable * 0.05;
    const total = taxable + vat;
    return { taxable, vat, total };
  };

  const handleCumulativeValueChange = (value) => {
    setInvoiceData(prev => ({
      ...prev,
      cumulativeValue: value,
      entries: [
        {
          description: `Cumulative Value of Works Done for Period Ending ${invoiceData.paymentCertificateDate}, Based on Payment Certificate No.${invoiceData.paymentCertificateNo}`,
          qty: 1,
          unitPrice: value,
          ...calculateValues(value)
        }
      ]
    }));
  };

  const addDeductionEntry = (type, percentage) => {
    const baseAmount = invoiceData.cumulativeValue;
    const deductionAmount = (baseAmount * (percentage / 100)).toFixed(2);
    const calculatedValues = calculateValues(deductionAmount);
    
    setInvoiceData(prev => ({
      ...prev,
      entries: [...prev.entries, {
        description: type,
        qty: 1,
        unitPrice: -deductionAmount,
        ...calculatedValues
      }]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="S.N."
            className="border p-2 rounded"
            value={invoiceData.serialNumber}
            onChange={(e) => setInvoiceData(prev => ({...prev, serialNumber: e.target.value}))}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Tax Invoice Ref"
            className="border p-2 rounded"
            value={invoiceData.taxInvoiceRef}
            onChange={(e) => setInvoiceData(prev => ({...prev, taxInvoiceRef: e.target.value}))}
          />
        </div>
        <div>
          <input
            type="date"
            className="border p-2 rounded"
            value={invoiceData.taxInvoiceDate}
            onChange={(e) => setInvoiceData(prev => ({...prev, taxInvoiceDate: e.target.value}))}
          />
        </div>
      </div>

      {/* Company Details */}
      <div className="mb-6">
        <h2 className="font-bold">From:</h2>
        <p>Phoenician Technical Services LLC</p>
        <p>P.O Box: 377972, Dubai, UAE</p>
        <p>Central Plaza, Office 399, DIP-1</p>
        <p>Tel: 04-8829484 Fax: 04-8829585</p>
        <p>TRN: 100058522200003</p>
      </div>

      {/* Client Details */}
      <div className="mb-6">
        <h2 className="font-bold">To:</h2>
        <p>{clientData.client_name}</p>
        <p>{clientData.address}</p>
        <p>Tel: {clientData.telephone_no}</p>
        <p>TRN: {clientData.trn}</p>
      </div>

      {/* Project Details */}
      <div className="mb-6">
        <p>Project: {projectData.project_name}</p>
        <p>LOA Ref: {projectData.loa_wo_sub_contract_ref}</p>
        <p>Contract Value: {projectData.contract_value}</p>
      </div>

      {/* Invoice Table */}
      <div className="mb-6">
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">S.NO</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Taxable</th>
              <th className="border p-2">VAT %</th>
              <th className="border p-2">VAT Amount</th>
              <th className="border p-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.entries.map((entry, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{entry.description}</td>
                <td className="border p-2">{entry.qty}</td>
                <td className="border p-2">{entry.unitPrice}</td>
                <td className="border p-2">{entry.taxable}</td>
                <td className="border p-2">5%</td>
                <td className="border p-2">{entry.vat}</td>
                <td className="border p-2">{entry.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2">Payment Certificate No.</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={invoiceData.paymentCertificateNo}
            onChange={(e) => setInvoiceData(prev => ({...prev, paymentCertificateNo: e.target.value}))}
          />
        </div>
        <div>
          <label className="block mb-2">Cumulative Value</label>
          <input
            type="number"
            className="border p-2 rounded"
            value={invoiceData.cumulativeValue}
            onChange={(e) => handleCumulativeValueChange(e.target.value)}
          />
        </div>
      </div>

      {/* Deduction Options */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(deductionOptions).map(([key, value]) => (
          <div key={key}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => {
                  setDeductionOptions(prev => ({...prev, [key]: e.target.checked}));
                  if (e.target.checked) {
                    addDeductionEntry(key, 10); // Default 10% for example
                  }
                }}
                className="mr-2"
              />
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
          </div>
        ))}
      </div>

      {/* Bank Selection */}
      <div className="mb-6">
        <label className="block mb-2">Select Bank</label>
        <select
          className="border p-2 rounded"
          value={invoiceData.selectedBank}
          onChange={(e) => setInvoiceData(prev => ({...prev, selectedBank: e.target.value}))}
        >
          <option value="ADCB">ABU DHABI COMMERCIAL BANK PJSC</option>
          <option value="INVEST">INVEST BANK</option>
        </select>
      </div>
    </div>
  );
};

export default InvoiceGenerator;