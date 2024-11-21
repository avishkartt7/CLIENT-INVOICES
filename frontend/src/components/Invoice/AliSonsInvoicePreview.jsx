import React, { useState } from 'react';

const AliSonsInvoicePreview = ({ formData, client, project, onBack }) => {
  const [isPreview, setIsPreview] = useState(false);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0.00';
    const value = parseFloat(num);
    const isNegative = value < 0;
    const formattedNum = Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return isNegative ? `(${formattedNum})` : formattedNum;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateTotalAmount = () => {
    try {
      const landscapeItems = formData.details.billItems.landscape;
      const swimmingItems = formData.details.billItems.swimming;
      
      const landscapeTotal = Object.values(landscapeItems)
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      const swimmingTotal = Object.values(swimmingItems)
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      
      return landscapeTotal + swimmingTotal;
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  };

  const totalAmount = calculateTotalAmount();
  const vatAmount = totalAmount * 0.05;
  const totalWithVat = totalAmount + vatAmount;

  return (
    <div className="min-h-screen text-[10px]">
      <div className="fixed top-2 right-4 space-x-2 print:hidden z-50">
        <button 
          onClick={() => setIsPreview(!isPreview)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {isPreview ? 'Edit Mode' : 'Preview Mode'}
        </button>
        <button 
          onClick={() => window.print()}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Print Invoice
        </button>
      </div>

      
      <div className={`transition-all duration-300 ${isPreview ? 'bg-gray-100 p-4' : ''}`}>
        <div className={`max-w-[210mm] mx-auto bg-white ${isPreview ? 'shadow-xl' : ''}`}>
          <div className="p-[15mm]">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div className="w-1/2">
                {/* TAX INVOICE in single line */}
                <div className="text-blue-500 text-base font-bold">
                  TAX INVOICE
                  <div className="absolute bottom-[-1px] left-0 w-full h-[0.5px]"></div>
                </div>

                {/* Invoice Details */}
                <div className="mt-2 space-y-0.5">
                  <div className="text-red-500 relative inline-block font-bold">
                  S.N.: {formData.header?.serialNumber}...2024
                    <div className="absolute bottom-[-1px] left-0 w-full h-[0.5px] bg-red-500"></div>
                  </div>
                  <div className="font-bold">Invoice Ref: {formData.header?.taxInvoiceRef}</div>
                  <div className="font-bold">Date: {formatDate(formData.header?.taxInvoiceDate)}</div>
                </div>
              </div>

              {/* Project Details - Right Aligned */}
              <div className="w-1/2 text-right text-blue-500 font-bold">
                <div className="">
                Project: {project?.project_name}
                  <div className="absolute bottom-[-1px] left-0 w-full h-[0.5px] bg-blue-500"></div>
                </div>
                <div className="">
                Sub-Contract Ref: {project?.loa_wo_sub_contract_ref}
                  <div className="absolute bottom-[-1px] left-0 w-full h-[0.5px] bg-blue-500"></div>
                </div>
                <div className="">
                Contract Value: AED {formatNumber(project?.contract_value)}
                  <div className="absolute bottom-[-1px] left-0 w-full h-[0.5px] bg-blue-500"></div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-2 mt-8">
              {/* From Section */}
              <div>
                <div className="font-bold">
                  <div>From: Phoenician Technical Services LLC.</div>
                  <div>P.O Box: 377972, Dubai, UAE</div>
                  <div>Central Plaza, Office 399, DIP-1</div>
                  <div>Tel: 04-8829484 Fax: 04-8829585</div>
                  <div>Email: mjawfer@phoenician-uae.com</div>
                  <div className="text-green-600 text-[11px]">TRN:100058522200003</div>
                </div>
              </div>

              {/* To Section */}
              <div>
                <div className="font-bold">
                  <div>To: M/s. Ali & Sons Contracting Company</div>
                  <div>Owned by Ali and Sons Holding-Sole Proprietorship LLC-RAK Branch</div>
                  <div>P.O.Box: 2153, Abu Dhabi</div>
                  <div>Tel: +97125546611 | F: +97125544788</div>
                  <div>Email:jithin.joseph@ali-sons.com</div>
                  <div className="text-green-600 text-[11px]">TRN:100244272900003</div>
                </div>
              </div>
            </div>

            <table className="w-full border-collapse border border-black text-[10px] leading-tight">
              <thead>
                <tr>
                  <th className="border border-black p-0.5 text-center w-[35%] font-bold">Description</th>
                  <th className="border border-black p-0.5 text-center w-[6%] font-bold">Unit</th>
                  <th className="border border-black p-0.5 text-center w-[6%] font-bold">Qty</th>
                  <th className="border border-black p-0.5 text-center w-[12%] font-bold">Rate<br/>(AED)</th>
                  <th className="border border-black p-0.5 text-center w-[12%] font-bold">Amount<br/>(AED)</th>
                  <th className="border border-black p-0.5 text-center w-[6%] font-bold bg-[rgb(230,255,255)]">Vat<br/>%</th>
                  <th className="border border-black p-0.5 text-center w-[12%] font-bold bg-[rgb(230,255,255)]">Vat Amount<br/>(AED)</th>
                  <th className="border border-black p-0.5 text-center w-[16%] font-bold">Total Amount<br/>(AED)</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-l [&>tr]:border-r [&>tr]:border-black">
                <tr>
                  <td className="border-l border-r border-black p-1 ">
                    Complete Landscaping works (RFI 572/JCA/065/23/FAW)
                    <br />
                    Bill No. 01 - Preliminaries & General Requirements
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">Item</td>
                  <td className="border-l border-r border-black p-1 text-center">1.00</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    AED {formatNumber(formData.details.billItems.landscape.preliminaries.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    AED {formatNumber(formData.details.billItems.landscape.preliminaries.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">5%</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    AED {formatNumber(formData.details.billItems.landscape.preliminaries.amount * 0.05)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    AED {formatNumber(formData.details.billItems.landscape.preliminaries.amount * 1.05)}
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-r border-black p-1">
                    Bill No. 02 - Landscaping Works
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">Item</td>
                  <td className="border-l border-r border-black p-1 text-center">1.00</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.landscapingWorks.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.landscapingWorks.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">5%</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.landscapingWorks.amount * 0.05)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.landscapingWorks.amount * 1.05)}
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-r border-black p-1">
                    Bill No. 03 - Tenderer's Adjustments for Bill No. 02
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">Item</td>
                  <td className="border-l border-r border-black p-1 text-center">1.00</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.tenderersAdjustments.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.tenderersAdjustments.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">5%</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.tenderersAdjustments.amount * 0.05)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.tenderersAdjustments.amount * 1.05)}
                  </td>
                </tr>
                <tr>
                  <td className="border-l border-r border-black p-1">
                    Bill No. 04 - Provisional Sums
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">Item</td>
                  <td className="border-l border-r border-black p-1 text-center">1.00</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.ProvisionalSums.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.ProvisionalSums.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">5%</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.ProvisionalSums.amount * 0.05)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.landscape.ProvisionalSums.amount * 1.05)}
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-r border-black p-1">
                    Swimming Pool works (372/JCA/081/23/FAW)
                    <br />
                    Bill No. 01 - Preliminaries General Requirements
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">Nos</td>
                  <td className="border-l border-r border-black p-1 text-center">1.00</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.preliminaries.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.preliminaries.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">5%</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.preliminaries.amount * 0.05)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.preliminaries.amount * 1.05)}
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-r border-black p-1">
                    Bill No. 02 - Swimming Pool MEP Works
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">Nos</td>
                  <td className="border-l border-r border-black p-1 text-center">1.00</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.mepWorks.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.mepWorks.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">5%</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.mepWorks.amount * 0.05)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.mepWorks.amount * 1.05)}
                  </td>
                </tr>

                <tr>
                  <td className="border-l border-r border-black p-1">
                    Bill No. 03 - Swimming Pool Civil & Finishing Works
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">Nos</td>
                  <td className="border-l border-r border-black p-1 text-center">1.00</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.civilWorks.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.civilWorks.amount)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-center">5%</td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.civilWorks.amount * 0.05)}
                  </td>
                  <td className="border-l border-r border-black p-1 text-right">
                    {formatNumber(formData.details.billItems.swimming.civilWorks.amount * 1.05)}
                  </td>
                </tr>

                <tr>
                  <td className="p-0.5 border-l border-black"></td>
                  <td className="p-0.5 border-l border-black"></td>
                  <td className="p-0.5 border-l border-black"></td>
                  <td className="p-0.5 border-l border-black"></td>
                  <td className="p-0.5 border-l border-black text-right font-bold">
                    {formatNumber(totalAmount)}
                  </td>
                  <td className="p-0.5 border-l border-black text-center font-bold">5%</td>
                  <td className="p-0.5 border-l border-black text-right font-bold">
                    {formatNumber(vatAmount)}
                  </td>
                  <td className="p-0.5 border-l border-r border-black text-right font-bold">
                    {formatNumber(totalWithVat)}
                  </td>
                </tr>

                <tr className="border-t-2 border-black">
                  <td colSpan="6" className="border-r border-black"></td>
                  <td className="p-0.5 border-r border-black text-right pr-2 font-bold italic">Value (AED)</td>
                  <td className="p-0.5 border-r border-black text-right pr-2 font-bold italic bg-[rgb(230,255,253)]">Vat 5% (AED)</td>
                </tr>

                <tr>
                  <td colSpan="8" className="border-t border-black"></td>
                </tr>
                
                <tr>
                  <td colSpan="6" className="border-r border-black text-right pr-2 font-bold italic">Total WD to Date</td>
                  <td className="p-0.5 border-r border-black text-right pr-2">{formatNumber(calculateTotalAmount())}</td>
                  <td className="p-0.5 border-r border-black text-right pr-2">{formatNumber(calculateTotalAmount() * 0.05)}</td>
                </tr>

                <tr>
                  <td colSpan="6" className="border-r border-black text-right pr-2 font-bold italic">Total WD Last Period</td>
                  <td className="p-0.5 border-r border-black text-right pr-2">{formatNumber(formData.details.totalWDLastPeriod)}</td>
                  <td className="p-0.5 border-r border-black text-right pr-2">{formatNumber(formData.details.totalWDLastPeriod * 0.05)}</td>
                </tr>
                
                <tr>
                  <td colSpan="6" className="border-r border-black text-right pr-2 font-bold italic">WD This Period</td>
                  <td className="p-0.5 border-r border-black text-right pr-2">
                    {formatNumber(calculateTotalAmount() - formData.details.totalWDLastPeriod)}
                  </td>
                  <td className="p-0.5 border-r border-black text-right pr-2">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * 0.05)}
                  </td>
                </tr>

                <tr>
                  <td colSpan="8" className="border-t border-black"></td>
                </tr>
                
                <tr>
                  <td colSpan="6" className="border-r border-black text-right pr-2 font-bold italic">Advance 10%</td>
                  <td className="p-0.5 border-r border-black text-right pr-2">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * -0.1)}
                  </td>
                  <td className="p-0.5 border-r border-black text-right pr-2">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * -0.1 * 0.05)}
                  </td>
                </tr>
                
                <tr>
                  <td colSpan="6" className="border-r border-black text-right pr-2 font-bold italic">Retention 10%</td>
                  <td className="p-0.5 border-r border-black text-right pr-2 text-black-600">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * -0.1)}
                  </td>
                  <td className="p-0.5 border-r border-black text-right pr-2 ">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * -0.1 * 0.05)}
                  </td>
                </tr>
                
                <tr className="border-t border-black font-bold">
                  <td colSpan="6" className="border-r border-black text-right pr-2 font-bold italic">Total</td>
                  <td className="p-0.5 border-r border-black text-right pr-2">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * 0.8)}
                  </td>
                  <td className="p-0.5 border-r border-black text-right pr-2">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * 0.8 * 0.05)}
                  </td>
                </tr>
                
                <tr className="border-t-2 border-black relative">
                  <td colSpan="8" className="p-0.5">
                    <div className="absolute w-px h-[calc(100%+93px)] bg-black left-1/2 top-0"></div>
                    <div className="w-1/2 ml-auto text-center font-bold relative">
                      Summary
                      <div className="absolute w-full h-px bg-black bottom-0"></div>
                    </div>
                  </td>
                </tr>
                
                <tr className="relative">
                  <td colSpan="4"></td>
                  <td colSpan="2" className="text-right pr-2 font-bold italic">Gross Value (in AED)</td>
                  <td colSpan="2" className="p-0.5 border-l border-black text-right pr-4">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * 0.8)}
                  </td>
                  <div className="absolute w-1/2 h-px bg-black bottom-0 right-0"></div>
                </tr>
                
                <tr className="relative">
                  <td colSpan="4"></td>
                  <td colSpan="2" className="text-right pr-2 font-bold italic bg-[rgb(230,255,255)]">Add - VAT 5% (in AED)</td>
                  <td colSpan="2" className="p-0.5 border-l border-black text-right pr-4">
                    {formatNumber((calculateTotalAmount() - formData.details.totalWDLastPeriod) * 0.8 * 0.05)}
                  </td>
                  <div className="absolute w-1/2 h-px bg-black bottom-0 right-0"></div>
                </tr>
                
                <tr className="relative">
                  <td colSpan="4"></td>
                  <td colSpan="2" className="text-right pr-2 font-bold italic">Less - Deduction Inc VAT</td>
                  <td colSpan="2" className="p-0.5 border-l border-black text-right pr-4">-</td>
                  <div className="absolute w-1/2 h-px bg-black bottom-0 right-0"></div>
                </tr>
                
                <tr className="relative">
                  <td colSpan="4"></td>
                  <td colSpan="2" className="text-right pr-2 font-bold italic">Less - Hold-PG</td>
                  <td colSpan="2" className="p-0.5 border-l border-black text-right pr-4">-</td>
                  <div className="absolute w-1/2 h-px bg-black bottom-0 right-0"></div>
                </tr>
                
                <tr>
                  <td colSpan="4"></td>
                  <td colSpan="2" className="text-right pr-2 font-bold italic">Net Value (in AED)</td>
                  <td colSpan="2" className="p-0.5 border-l border-black text-right pr-4 font-bold">
                    {formatNumber(((calculateTotalAmount() - formData.details.totalWDLastPeriod) * 0.8) * 1.05)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 right-4 space-x-2 print:hidden">
        <button 
          onClick={onBack}
          className="px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200 text-sm"
        >
          Back to Edit
        </button>
        <button 
          onClick={() => window.print()}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Print Invoice
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AliSonsInvoicePreview;