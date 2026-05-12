import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MentalHealthReport } from '@/types/chat';
import { format } from 'date-fns';

export const generateSessionPDF = (report: MentalHealthReport) => {
  const doc = new jsPDF();
  const timestamp = format(report.timestamp, 'yyyy-MM-dd HH:mm:ss');
  
  // Set title
  doc.setFontSize(22);
  doc.setTextColor(33, 150, 243); // Primary color
  doc.text('MindfulChat - Wellness Session Report', 14, 22);
  
  // Reset font for body
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated on: ${timestamp}`, 14, 32);
  doc.text(`Session Mode: ${report.modeUsed}`, 14, 40);
  
  // Draw line
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 45, 196, 45);
  
  // Session Summary
  doc.setFontSize(16);
  doc.text('Session Summary', 14, 55);
  doc.setFontSize(11);
  const summaryLines = doc.splitTextToSize(report.sessionSummary, 180);
  doc.text(summaryLines, 14, 62);
  
  // Emotional Analysis Table
  doc.setFontSize(16);
  doc.text('Emotional Analysis', 14, 85);
  autoTable(doc, {
    startY: 90,
    head: [['Metric', 'Value']],
    body: [
      ['Primary Emotion', report.emotions.primary],
      ['Risk Level', report.emotions.riskLevel || report.risk.level],
      ['Severity Score', `${report.emotions.severityScore || report.risk.score}/10`],
      ['Confidence', `${(report.emotions.confidence * 100).toFixed(0)}%`],
    ],
    theme: 'striped',
    headStyles: { fillStyle: 'F', fillColor: [33, 150, 243] },
  });
  
  // Interventions & Recommendations
  const finalY = (doc as any).lastAutoTable.finalY || 130;
  
  doc.setFontSize(16);
  doc.text('Interventions Used', 14, finalY + 15);
  doc.setFontSize(11);
  report.interventions.forEach((item, index) => {
    doc.text(`\u2022 ${item}`, 14, finalY + 22 + (index * 7));
  });
  
  const recY = finalY + 22 + (report.interventions.length * 7) + 10;
  doc.setFontSize(16);
  doc.text('Recommendations', 14, recY);
  doc.setFontSize(11);
  report.recommendations.forEach((item, index) => {
    doc.text(`\u2022 ${item}`, 14, recY + 7 + (index * 7));
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('This report is for informational purposes only and is not a clinical diagnosis.', 14, pageHeight - 20);
  doc.text('If you are in immediate danger, please contact emergency services or a crisis helpline.', 14, pageHeight - 15);
  
  // Save PDF
  doc.save(`MindfulChat_Report_${format(report.timestamp, 'yyyyMMdd_HHmm')}.pdf`);
};
