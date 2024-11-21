import React, { useState } from 'react';

/** Helper Functions */
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.getDate() + ' ' + d.toLocaleString('en-US', { 
    month: 'long',
    year: 'numeric'
  }).toUpperCase();
};

const formatDescriptionDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'long' }).toUpperCase()} ${d.getFullYear()}`;
};

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

const numberToWords = (number) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const scales = ['', 'Thousand', 'Million', 'Billion'];

  const convertGroup = (n) => {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
      if (n > 0) str += 'and ';
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      if (n % 10 > 0) str += ones[n % 10] + ' ';
    } else if (n >= 10) {
      str += teens[n - 10] + ' ';
    } else if (n > 0) {
      str += ones[n] + ' ';
    }
    return str;
  };

  if (!number || isNaN(number)) return 'Zero Only.';
  if (number === 0) return 'Zero Only.';

  const num = Math.abs(number);
  const decimal = Math.round((num % 1) * 100);
  let str = '';
  let scale = 0;
  let remaining = Math.floor(num);
  
  while (remaining > 0) {
    const group = remaining % 1000;
    if (group !== 0) {
      str = convertGroup(group) + scales[scale] + ' ' + str;
    }
    remaining = Math.floor(remaining / 1000);
    scale++;
  }

  str = str.trim();
  if (decimal > 0) {
    str += ` & ${decimal}/100`;
  }

  return str + ' Only.';
};

// Add print styles to document
const printStyles = `
  @page {
    size: A4;
    margin: 0;
  }
  
  @media print {
    body {
      margin: 0;
      -webkit-print-color-adjust: exact !important;
    }
    
    .print\\:hidden {
      display: none !important;
    }

    .a4-paper {
      width: 210mm !important;
      min-height: 297mm !important;
      padding: 20mm !important;
      margin: 0 !important;
      box-shadow: none !important;
    }

    .preview-container {
      background: white !important;
      padding: 0 !important;
    }
  }

  .preview-container {
    background: #f3f4f6;
  }

  .a4-paper {
    width: 210mm;
    min-height: 297mm;
    background: white;
    margin: 0 auto;
  }

  .preview-mode {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

if (!document.getElementById('invoice-print-styles')) {
  const style = document.createElement('style');
  style.id = 'invoice-print-styles';
  style.innerHTML = printStyles;
  document.head.appendChild(style);
}
/** Main Component */
const InvoicePreview = ({ formData = {}, client = {}, project = {}, onBack }) => {
  const [isPreview, setIsPreview] = useState(false);

  const calculateRows = () => {
    const rows = [];
    const cumulativeValue = parseFloat(formData.details?.cumulativeValue) || 0;
    const prevPayment = parseFloat(formData.details?.previousPayment) || 0;

    // Main row - either custom or default description
    if (formData.details?.useCustomDescription) {
      rows.push({
        sno: 1,
        description: formData.details.customDescription,
        qty: 1,
        unitPrice: formData.details.customAmount || 0,
        taxable: formData.details.customAmount || 0,
        vatPercentage: 5,
        vatAmount: Number((formData.details.customAmount || 0) * 0.05).toFixed(2),
        totalAmount: Number((formData.details.customAmount || 0) * 1.05).toFixed(2),
        isDeduction: false
      });
    } else {
      rows.push({
        sno: 1,
        description: `Cumulative Value of Works Done for Period Ending `
          + `<strong>${formatDescriptionDate(formData.details?.certificateDate)}</strong>, `
          + `Based on Payment Certificate No.<strong>${formData.details?.paymentCertificateNo}</strong>`,
        qty: 1,
        unitPrice: cumulativeValue,
        taxable: cumulativeValue,
        vatPercentage: 5,
        vatAmount: Number(cumulativeValue * 0.05).toFixed(2),
        totalAmount: Number(cumulativeValue * 1.05).toFixed(2),
        isDeduction: false
      });
    }

    let currentSno = 2;

    // Handle all deductions
    if (formData.deductions?.advanceRelease?.checked) {
      const amount = cumulativeValue * (formData.deductions.advanceRelease.percentage / 100);
      rows.push({
        sno: currentSno++,
        description: `Less: ${formData.deductions.advanceRelease.percentage}% Advance of Total Amount`,
        qty: 1,
        unitPrice: -amount,
        taxable: -amount,
        vatPercentage: 5,
        vatAmount: Number(-amount * 0.05).toFixed(2),
        totalAmount: Number(-amount * 1.05).toFixed(2),
        isDeduction: true
      });
    }

    if (formData.deductions?.retentionRelease?.checked) {
      const amount = cumulativeValue * (formData.deductions.retentionRelease.percentage / 100);
      rows.push({
        sno: currentSno++,
        description: `Less: ${formData.deductions.retentionRelease.percentage}% Retention Release of Total Amount`,
        qty: 1,
        unitPrice: -amount,
        taxable: -amount,
        vatPercentage: 5,
        vatAmount: Number(-amount * 0.05).toFixed(2),
        totalAmount: Number(-amount * 1.05).toFixed(2),
        isDeduction: true
      });
    }

    if (formData.deductions?.retentionDeduction?.checked) {
      const amount = cumulativeValue * (formData.deductions.retentionDeduction.percentage / 100);
      rows.push({
        sno: currentSno++,
        description: `Less: ${formData.deductions.retentionDeduction.percentage}% Retention Deduction of Total Amount`,
        qty: 1,
        unitPrice: -amount,
        taxable: -amount,
        vatPercentage: 5,
        vatAmount: Number(-amount * 0.05).toFixed(2),
        totalAmount: Number(-amount * 1.05).toFixed(2),
        isDeduction: true
      });
    }

    // Handle Previous Payments
    if (prevPayment > 0) {
      rows.push({
        sno: currentSno++,
        description: 'Less: Previous Payments',
        qty: 1,
        unitPrice: -prevPayment,
        taxable: -prevPayment,
        vatPercentage: 5,
        vatAmount: Number(-prevPayment * 0.05).toFixed(2),
        totalAmount: Number(-prevPayment * 1.05).toFixed(2),
        isDeduction: true
      });
    }

    if (formData.deductions?.ncrDeduction?.checked) {
      const amount = parseFloat(formData.deductions.ncrDeduction.amount) || 0;
      rows.push({
        sno: currentSno++,
        description: 'NCR Deduction',
        qty: 1,
        unitPrice: -amount,
        taxable: -amount,
        vatPercentage: 5,
        vatAmount: Number(-amount * 0.05).toFixed(2),
        totalAmount: Number(-amount * 1.05).toFixed(2),
        isDeduction: true
      });
    }

    if (formData.deductions?.otherDeduction?.checked) {
      const amount = parseFloat(formData.deductions.otherDeduction.amount) || 0;
      rows.push({
        sno: currentSno++,
        description: 'Other Deduction',
        qty: 1,
        unitPrice: -amount,
        taxable: -amount,
        vatPercentage: 5,
        vatAmount: Number(-amount * 0.05).toFixed(2),
        totalAmount: Number(-amount * 1.05).toFixed(2),
        isDeduction: true
      });
    }

    return rows;
  };

  const rows = calculateRows();
  const totals = rows.reduce((acc, row) => ({
    taxable: Number((acc.taxable + parseFloat(row.taxable || 0)).toFixed(2)),
    vatAmount: Number((acc.vatAmount + parseFloat(row.vatAmount || 0)).toFixed(2)),
    totalAmount: Number((acc.totalAmount + parseFloat(row.totalAmount || 0)).toFixed(2))
  }), { taxable: 0, vatAmount: 0, totalAmount: 0 });

  return (
    <div className="min-h-screen text-[11px]">
      {/* Preview toggle button */}
      <button 
        onClick={() => setIsPreview(!isPreview)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden text-sm"
      >
        {isPreview ? 'Edit View' : 'Show Final Preview'}
      </button>

      <div className={`transition-all duration-300 ${isPreview ? 'bg-gray-100 p-8' : ''}`}>
        <div className={`max-w-[210mm] mx-auto bg-white ${isPreview ? 'shadow-xl' : ''}`}>
          <div className="p-[20mm]">
            {/* Header Section */}
            <div className="mb-8">
              <div className="text-blue-500 text-xl font-bold underline mb-2">TAX INVOICE</div>
              <div className="text-red-600 font-bold border-b border-red-600 inline-block mb-2">
                S.N.: {formData.header?.serialNumber}...{new Date().getFullYear()}
              </div>
              <div className="font-bold">Tax Invoice Ref: {formData.header?.taxInvoiceRef}</div>
              <div className="font-bold mb-6">Tax Invoice Date: {formatDate(formData.header?.taxInvoiceDate)}</div>
            </div>

            {/* Address Section */}
            <div className="relative mb-6">
              {/* From Section */}
              <div className="mb-4">
                <div className="flex">
                  <span className="font-bold underline">From: </span>
                  <span className="ml-1 font-bold">Phoenician Technical Services LLC.</span>
                </div>
                <div>P.O Box: 377972, Dubai, UAE</div>
                <div>Central Plaza, Office 399, DIP-1</div>
                <div>Tel: 04-8829484 Fax: 04-8829585</div>
                <div className="relative inline-block">
                  <span className="text-green-600">TRN: 100058522200003</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"></div>
                </div>
              </div>

              {/* To Section */}
              <div className="mb-4">
                <div className="flex">
                  <span className="font-bold underline">To: </span>
                  <span className="ml-1 font-bold">{client?.client_name}</span>
                </div>
                <div>P.O. Box {client?.po_box}, Dubai, UAE</div>
                <div>Tel: {client?.telephone_no}</div>
                <div className="relative inline-block">
                  <span className="text-green-600">TRN: {client?.trn}</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"></div>
                </div>
              </div>

              {/* Project Details */}
              <div className="absolute right-0 top-0 text-right text-blue-600">
                <div className="font-bold">{project?.project_name?.split(' ').slice(0,3).join(' ')}</div>
                <div className="font-bold">{project?.project_name?.split(' ').slice(3,16).join(' ')}</div>
                <div className="font-bold">{project?.loa_wo_sub_contract_ref?.split(' ').slice(0, 2).join(' ')}</div>
                <div className="font-bold">{project?.loa_wo_sub_contract_ref?.split(' ').slice(2, 4).join(' ')}</div>
                <div className="font-bold">{project?.loa_wo_sub_contract_ref?.split(' ').slice(4, 10).join(' ')}</div>
              </div>

              {/* Contract Value */}
              <div className="text-blue-600 font-bold mt-4">
                Contract Value: AED {formatNumber(project?.contract_value)}
              </div>
            </div>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-2 w-12 text-center">S.NO</th>
                  <th className="border border-black p-2 text-left w-[35%]">Description</th>
                  <th className="border border-black p-2 w-12 text-center">Qty</th>
                  <th className="border border-black p-2 w-24 text-right">Unit Price</th>
                  <th className="border border-black p-2 w-24 text-right">Taxable</th>
                  <th className="border border-black p-2 w-12 text-center">VAT %</th>
                  <th className="border border-black p-2 w-24 text-right">VAT Amount</th>
                  <th className="border border-black p-2 w-28 text-right">Total Amount<br/>INCL VAT<br/>(in AED)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.sno} className={row.isDeduction ? 'text-red-600' : ''}>
                    <td className="border border-black p-2 text-center">{row.sno}</td>
                    <td className="border border-black p-2" 
                        dangerouslySetInnerHTML={{ __html: row.description }}></td>
                    <td className="border border-black p-2 text-center">{row.qty}</td>
                    <td className="border border-black p-2 text-right">{formatNumber(row.unitPrice)}</td>
                    <td className="border border-black p-2 text-right">{formatNumber(row.taxable)}</td>
                    <td className="border border-black p-2 text-center">{row.vatPercentage}%</td>
                    <td className="border border-black p-2 text-right">{formatNumber(row.vatAmount)}</td>
                    <td className="border border-black p-2 text-right">{formatNumber(row.totalAmount)}</td>
                  </tr>
                ))}

                {/* Total Amount Row */}
                <tr>
                  <td colSpan="4" className="border border-black p-2 font-bold">
                    Total Amount Due for Payment Including VAT (in AED)
                  </td>
                  <td className="border border-black p-2 text-right font-bold">
                    {formatNumber(totals.taxable)}
                  </td>
                  <td className="border border-black"></td>
                  <td className="border border-black p-2 text-right font-bold">
                    {formatNumber(totals.vatAmount)}
                  </td>
                  <td className="border border-black p-2 text-right font-bold">
                    {formatNumber(totals.totalAmount)}
                  </td>
                </tr>

                {/* Amount in Words */}
                <tr>
                  <td colSpan="8" className="border border-black p-2 font-bold text-center">
                    AED: {numberToWords(Math.abs(totals.totalAmount))}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Bank Details & Remarks */}
            <div className="mt-8">
              <div className="font-bold underline">Bank Details:</div>
              <div className="mt-2">
                <div>Account Name: {formData.bankDetails?.accountName}</div>
                <div>
                  Bank Name & Branch: <span className="bg-yellow-300 px-1 font-bold">
                    {formData.bankDetails?.bank === 'ADCB' 
                      ? 'ABU DHABI COMMERCIAL BANK PJSC, Dubai, U.A.E.' 
                      : 'INVEST BANK PJSC, Dubai, U.A.E.'}
                  </span>
                </div>
                <div>Account Number: {formData.bankDetails?.accountNumber}</div>
                <div>IBAN: {formData.bankDetails?.iban}</div>
                <div>SWIFT: {formData.bankDetails?.swift}</div>
              </div>

              {/* Remarks Section */}
              <div className="mt-6">
                <div className="font-bold mb-2">Remarks:</div>
                <div className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div className="font-bold">
                    If any questions concerning this Invoice, please contact Eng. Elie Harb, the General Manager, 
                    on <span className="text-blue-600">+971557877701</span>, 
                    Email: <span className="text-blue-600">elie@phoenician-uae.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Controls */}
      <div className="fixed bottom-4 right-4 space-x-2 print:hidden">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 text-sm"
        >
          Edit
        </button>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;