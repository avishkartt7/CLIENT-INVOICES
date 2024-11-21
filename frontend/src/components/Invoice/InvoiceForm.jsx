import React, { useState } from 'react';
import InvoicePreviewRouter from './InvoicePreviewRouter';

const InvoiceForm = ({ client, project, onBack }) => {
  const [showPreview, setShowPreview] = useState(false);
  const isAliSons = client?.client_name?.includes("Ali & Sons");

  // Initial form state based on client type
  const initialFormState = {
    header: {
      serialNumber: '',
      taxInvoiceRef: '',
      taxInvoiceDate: new Date().toISOString().split('T')[0],
    },
    details: isAliSons ? {
      // Ali & Sons specific structure
      billItems: {
        landscape: {
          preliminaries: {
            description: 'Bill No. 01 - Preliminaries & General Requirements',
            amount: 0,
            unit: 'Item'
          },
          landscapingWorks: {
            description: 'Bill No. 02 - Landscaping Works',
            amount: 0,
            unit: 'Item'
          },
          tenderersAdjustments: {
            description: "Bill No. 03 - Tenderer's Adjustments for Bill No. 02",
            amount: 0,
            unit: 'Item'
          },
          ProvisionalSums:{
            description: "Bill No. 04 - Provisional Sums",
            amount: 0,
            unit: 'Item'
          }
        },
        swimming: {
          preliminaries: {
            description: 'Bill No. 01 - Preliminaries General Requirements',
            amount: 0,
            unit: 'Nos'
          },
          mepWorks: {
            description: 'Bill No. 02 - Swimming Pool MEP Works',
            amount: 0,
            unit: 'Nos'
          },
          civilWorks: {
            description: 'Bill No. 03 - Swimming Pool Civil & Finishing Works',
            amount: 0,
            unit: 'Nos'
          }
        }
      },
      totalWDLastPeriod: 0
    } : {
      // Standard structure
      paymentCertificateNo: '',
      certificateDate: new Date().toISOString().split('T')[0],
      cumulativeValue: '',
      previousPayment: '',
      useCustomDescription: false,
      customDescription: '',
      customAmount: 0,
      totalWDLastPeriod: 0
    },
    deductions: {
      advanceRelease: { checked: false, percentage: 10 },
      retentionRelease: { checked: false, percentage: 10 },
      retentionDeduction: { checked: false, percentage: 10 },
      ncrDeduction: { checked: false, amount: 0 },
      otherDeduction: { checked: false, amount: 0 }
    },
    bankDetails: {
      bank: isAliSons ? 'INVEST' : 'ADCB',
      accountName: 'Phoenician Technical Services LLC',
      accountNumber: isAliSons ? '2000215166' : '10412895920001',
      iban: isAliSons ? 'AE410300000002000215166' : 'AE460030010412895920001',
      swift: isAliSons ? 'IBTFAEASXXX' : 'ADCBAEAA'
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const percentageOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <InvoicePreviewRouter 
        formData={formData}
        client={client}
        project={project}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  // Common header section component
  const renderHeader = () => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">S.N.</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.header.serialNumber}
          onChange={(e) => setFormData({
            ...formData,
            header: { ...formData.header, serialNumber: e.target.value }
          })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Invoice Ref</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.header.taxInvoiceRef}
          onChange={(e) => setFormData({
            ...formData,
            header: { ...formData.header, taxInvoiceRef: e.target.value }
          })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Invoice Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.header.taxInvoiceDate}
          onChange={(e) => setFormData({
            ...formData,
            header: { ...formData.header, taxInvoiceDate: e.target.value }
          })}
          required
        />
      </div>
    </div>
  );

  // Common deductions section component
  const renderDeductions = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">Deductions</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(formData.deductions).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              checked={value.checked}
              onChange={(e) => setFormData({
                ...formData,
                deductions: {
                  ...formData.deductions,
                  [key]: { ...value, checked: e.target.checked }
                }
              })}
            />
            <label className="text-sm text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {value.hasOwnProperty('percentage') ? (
              <select
                className="w-20 p-1 border rounded"
                value={value.percentage}
                onChange={(e) => setFormData({
                  ...formData,
                  deductions: {
                    ...formData.deductions,
                    [key]: { ...value, percentage: parseInt(e.target.value) }
                  }
                })}
                disabled={!value.checked}
              >
                {percentageOptions.map(percent => (
                  <option key={percent} value={percent}>
                    {percent}%
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                className="w-24 p-1 border rounded"
                value={value.amount}
                onChange={(e) => setFormData({
                  ...formData,
                  deductions: {
                    ...formData.deductions,
                    [key]: { ...value, amount: parseFloat(e.target.value) || 0 }
                  }
                })}
                disabled={!value.checked}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Common bank details section component
  const renderBankDetails = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
      <select
        className="w-full p-2 border rounded"
        value={formData.bankDetails.bank}
        onChange={(e) => {
          const isADCB = e.target.value === 'ADCB';
          setFormData({
            ...formData,
            bankDetails: {
              bank: e.target.value,
              accountName: 'Phoenician Technical Services LLC',
              accountNumber: isADCB ? '10412895920001' : '2000215166',
              iban: isADCB ? 'AE460030010412895920001' : 'AE410300000002000215166',
              swift: isADCB ? 'ADCBAEAA' : 'IBTFAEASXXX'
            }
          });
        }}
      >
        <option value="ADCB">ABU DHABI COMMERCIAL BANK PJSC</option>
        <option value="INVEST">INVEST BANK PJSC</option>
      </select>
    </div>
  );

  // Common form actions component
  const renderFormActions = () => (
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
      >
        Generate Invoice
      </button>
    </div>
  );

  // Ali & Sons specific details section
  const renderAliSonsDetails = () => (
    <>
      {/* Landscape Works Section */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-medium mb-4">Landscape Works</h3>
        <div className="space-y-4">
          {Object.entries(formData.details.billItems.landscape).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {value.description}
                </label>
              </div>
              <div>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={value.amount}
                  onChange={(e) => {
                    const newBillItems = {
                      ...formData.details.billItems,
                      landscape: {
                        ...formData.details.billItems.landscape,
                        [key]: {
                          ...value,
                          amount: parseFloat(e.target.value) || 0
                        }
                      }
                    };
                    setFormData({
                      ...formData,
                      details: {
                        ...formData.details,
                        billItems: newBillItems
                      }
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swimming Pool Works Section */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-medium mb-4">Swimming Pool Works</h3>
        <div className="space-y-4">
          {Object.entries(formData.details.billItems.swimming).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {value.description}
                </label>
              </div>
              <div>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={value.amount}
                  onChange={(e) => {
                    const newBillItems = {
                      ...formData.details.billItems,
                      swimming: {
                        ...formData.details.billItems.swimming,
                        [key]: {
                          ...value,
                          amount: parseFloat(e.target.value) || 0
                        }
                      }
                    };
                    setFormData({
                      ...formData,
                      details: {
                        ...formData.details,
                        billItems: newBillItems
                      }
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Period Total */}
      <div className="border p-4 rounded">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total WD Last Period
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={formData.details.totalWDLastPeriod}
              onChange={(e) => setFormData({
                ...formData,
                details: {
                  ...formData.details,
                  totalWDLastPeriod: parseFloat(e.target.value) || 0
                }
              })}
            />
          </div>
        </div>
      </div>
    </>
  );

  // Standard details section
  const renderStandardDetails = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Certificate No.</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.details.paymentCertificateNo}
            onChange={(e) => setFormData({
              ...formData,
              details: { ...formData.details, paymentCertificateNo: e.target.value }
            })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={formData.details.certificateDate}
            onChange={(e) => setFormData({
              ...formData,
              details: { ...formData.details, certificateDate: e.target.value }
            })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cumulative Value</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.details.cumulativeValue}
            onChange={(e) => setFormData({
              ...formData,
              details: { ...formData.details, cumulativeValue: e.target.value }
            })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Previous Payment</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.details.previousPayment}
            onChange={(e) => setFormData({
              ...formData,
              details: { ...formData.details, previousPayment: e.target.value }
            })}
          />
        </div>
      </div>

      {/* Custom Description Section */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={formData.details.useCustomDescription}
            onChange={(e) => setFormData({
              ...formData,
              details: { 
                ...formData.details, 
                useCustomDescription: e.target.checked 
              }
            })}
          />
          <label className="text-sm font-medium text-gray-700">
            Use Custom Description
          </label>
        </div>
        
        {formData.details.useCustomDescription && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Description
              </label>
              <textarea
                rows={3}
                className="w-full p-2 border rounded"
                value={formData.details.customDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { 
                    ...formData.details, 
                    customDescription: e.target.value 
                  }
                })}
                placeholder="Enter custom description for invoice"
              />
            </div>
        
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Amount
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={formData.details.customAmount || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { 
                    ...formData.details, 
                    customAmount: parseFloat(e.target.value) || 0
                  }
                })}
                placeholder="Enter amount for custom description"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Main render
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        ← Back to Projects
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Common Header Section */}
        {renderHeader()}

        {/* Conditional Details Section */}
        {isAliSons ? renderAliSonsDetails() : renderStandardDetails()}

        {/* Common Sections */}
        {renderDeductions()}
        {renderBankDetails()}
        {renderFormActions()}
      </form>
    </div>
  );
};

export default InvoiceForm;