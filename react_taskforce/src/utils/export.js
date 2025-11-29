/**
 * Data export utility module.
 * Provides functions to export application data to CSV and PDF formats with formatting.
 */
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file to download
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Convert data to CSV
  const csv = Papa.unparse(data);
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to PDF file with table formatting
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file to download
 * @param {String} title - Title to display on the PDF
 * @param {Array} columns - Optional array of column definitions [{header: 'Name', dataKey: 'name'}]
 */
export const exportToPDF = (data, filename, title, columns = null) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  // Prepare columns and data
  let tableColumns;
  let tableData;
  
  if (columns) {
    // Use provided columns
    tableColumns = columns;
    tableData = data;
  } else {
    // Auto-generate columns from first data object
    const firstItem = data[0];
    tableColumns = Object.keys(firstItem).map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      dataKey: key
    }));
    tableData = data;
  }
  
  // Generate table using autoTable function
  autoTable(doc, {
    columns: tableColumns,
    body: tableData,
    startY: 35,
    headStyles: { fillColor: [52, 73, 94] },
    alternateRowStyles: { fillColor: [242, 242, 242] },
    styles: { fontSize: 9 },
    margin: { top: 35 }
  });
  
  // Save the PDF
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
