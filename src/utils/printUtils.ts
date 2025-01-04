import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const printContent = (content: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
};

export const viewContent = (content: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
  }
};

export const downloadPDF = (content: string, filename: string) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Parse the HTML content
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content, 'text/html');
    
    // Extract restaurant details
    const restaurantName = htmlDoc.querySelector('h2')?.textContent || '';
    const address = htmlDoc.querySelectorAll('p')[0]?.textContent || '';
    const gstNo = htmlDoc.querySelectorAll('p')[1]?.textContent || '';
    
    // Extract order details
    const tableInfo = Array.from(htmlDoc.querySelectorAll('div p'))
      .slice(0, 2)
      .map(p => p.textContent);
    
    // Extract items and their prices
    const items = Array.from(htmlDoc.querySelectorAll('table tbody tr'))
      .map(row => {
        const cells = (row as HTMLTableRowElement).cells;
        return {
          item: cells[0]?.textContent || '',
          amount: cells[1]?.textContent || ''
        };
      });
    
    // Extract totals
    const totals = Array.from(htmlDoc.querySelectorAll('.amount-cell'))
      .slice(-3)
      .map((cell, index) => {
        const labels = ['Subtotal', 'GST', 'Total'];
        return {
          label: labels[index],
          amount: cell.textContent || ''
        };
      });

    // Start building PDF
    doc.setFontSize(16);
    doc.text(restaurantName, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(address, doc.internal.pageSize.width / 2, 30, { align: 'center' });
    doc.text(gstNo, doc.internal.pageSize.width / 2, 35, { align: 'center' });
    
    // Order details
    doc.setFontSize(12);
    tableInfo.forEach((info, index) => {
      doc.text(info || '', 20, 45 + (index * 7));
    });
    
    // Items table
    const tableData = items.map(item => [item.item, item.amount]);
    
    autoTable(doc, {
      startY: 65,
      head: [['Item', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [70, 70, 70] },
      margin: { left: 20, right: 20 },
    });
    
    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    totals.forEach((total, index) => {
      doc.text(total.label, 20, finalY + (index * 7));
      doc.text(total.amount, doc.internal.pageSize.width - 20, finalY + (index * 7), { align: 'right' });
    });
    
    // Thank you message
    doc.text(
      'Thank you for dining with us!',
      doc.internal.pageSize.width / 2,
      finalY + 30,
      { align: 'center' }
    );
    
    // Save the PDF
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};