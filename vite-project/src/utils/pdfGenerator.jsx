import jsPDF from 'jspdf';

export const generateReceipt = (donation, userName) => {
  const doc = new jsPDF();
  
 
  const emerald = [16, 185, 129]; 
  const gold = [217, 119, 6];   
  const lightBg = [240, 253, 244]; 

  doc.setFillColor(...emerald);
  doc.rect(0, 0, 210, 50, 'F');
  
  doc.setFillColor(...gold);
  doc.rect(0, 50, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('DONATION RECEIPT', 105, 25, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Saylani Zakat & Donation Management System', 105, 35, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Transforming Lives Through Your Charity', 105, 42, { align: 'center' });
  
 
  doc.setTextColor(40, 40, 40);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt No: #${donation.transactionId.toUpperCase()}`, 190, 65, { align: 'right' });
  
  const date = new Date(donation.createdAt).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.setFont('helvetica', 'normal');
  doc.text(`Date of Issue: ${date}`, 190, 72, { align: 'right' });
  
  doc.setFillColor(...lightBg);
  doc.roundedRect(20, 85, 170, 25, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  doc.text('DONOR DETAILS', 30, 95);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Name: ${userName}`, 30, 103);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  doc.text('CONTRIBUTION SUMMARY', 20, 125);
  
  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.5);
  doc.line(20, 130, 190, 130);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  const startY = 140;
  const lineGap = 10;
  
  const details = [
    ['Donation Type:', donation.type],
    ['Category:', donation.category],
    ['Payment Method:', donation.paymentMethod],
    ['Current Status:', donation.status],
    ['Campaign:', donation.campaign?.title || 'General Relief Fund']
  ];
  
  details.forEach((item, index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(item[0], 25, startY + (index * lineGap));
    doc.setFont('helvetica', 'normal');
    doc.text(String(item[1]), 80, startY + (index * lineGap));
  });
  
 
  doc.setFillColor(...emerald);
  doc.roundedRect(20, 200, 170, 35, 4, 4, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Contribution Amount', 105, 212, { align: 'center' });
  
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`PKR ${donation.amount.toLocaleString()}`, 105, 225, { align: 'center' });

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.text('"May Allah accept your generous contribution and bless you abundantly."', 105, 255, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a digitally signed document and does not require a physical signature.', 105, 265, { align: 'center' });
  

  doc.setDrawColor(...gold);
  doc.setLineWidth(2);
  doc.line(70, 275, 140, 275);
  
  doc.setFontSize(8);
  doc.text('Saylani Mass IT Training • Karachi, Pakistan • info@saylani.org', 105, 285, { align: 'center' });

  doc.save(`Saylani_Receipt_${donation.transactionId.toUpperCase()}.pdf`);
};