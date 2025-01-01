export const printContent = (content: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
};

export const viewContent = (content: string) => {
  const viewWindow = window.open('', '_blank');
  if (viewWindow) {
    viewWindow.document.write(content);
    viewWindow.document.close();
  }
};

export const downloadPDF = (content: string, filename: string) => {
  const element = document.createElement('div');
  element.innerHTML = content;
  
  const style = document.createElement('style');
  style.textContent = `
    @page { size: A4; margin: 2cm; }
    body { font-family: Arial, sans-serif; }
  `;
  element.prepend(style);

  const blob = new Blob([element.outerHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};