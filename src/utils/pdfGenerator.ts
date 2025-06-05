import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, Client, BusinessProfile, InvoiceTemplate } from '../types';
import { formatCurrency, formatDate } from './formatters';

interface GeneratePdfOptions {
  invoice: Invoice;
  client: Client;
  business: BusinessProfile;
  template: InvoiceTemplate;
}

/**
 * Generate a PDF invoice
 */
export const generateInvoicePdf = ({
  invoice,
  client,
  business,
  template = 'classic',
}: GeneratePdfOptions): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Invoice ${invoice.number}`,
    subject: `Invoice for ${client.name}`,
    author: business.name,
    keywords: 'invoice, bill',
    creator: 'Invoice Generator',
  });
  
  // Apply the selected template
  applyTemplate(doc, template);
  
  // Add invoice header
  addInvoiceHeader(doc, invoice, business, template);
  
  // Add client and business information
  addBusinessAndClientInfo(doc, business, client, template);
  
  // Add invoice details
  addInvoiceDetails(doc, invoice, template);
  
  // Add invoice items
  addInvoiceItems(doc, invoice, template);
  
  // Add invoice totals
  addInvoiceTotals(doc, invoice, template);
  
  // Add footer
  addFooter(doc, business, template);
  
  return doc;
};

/**
 * Apply template-specific styling
 */
const applyTemplate = (doc: jsPDF, template: InvoiceTemplate): void => {
  // Set default font
  doc.setFont('helvetica');
  
  // Template-specific customizations
  switch (template) {
    case 'modern':
      // Modern template has blue accents
      break;
      
    case 'corporate':
      // Corporate template has a more formal look
      break;
      
    case 'creative':
      // Creative template has more colors
      break;
      
    case 'minimal':
      // Minimal template is very clean
      break;
      
    case 'classic':
    default:
      // Classic template is the default
      break;
  }
};

/**
 * Add the invoice header with logo and title
 */
const addInvoiceHeader = (
  doc: jsPDF,
  invoice: Invoice,
  business: BusinessProfile,
  template: InvoiceTemplate
): void => {
  // Add logo if available
  if (business.logo) {
    // In a real app, you would load and add the logo image
    // For demo purposes, we'll just add a placeholder
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('[Company Logo]', 14, 20);
  }
  
  // Add invoice title and number
  doc.setFontSize(24);
  doc.setTextColor(40, 40, 40);
  doc.text('INVOICE', 14, 30);
  
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${invoice.number}`, 14, 38);
  
  // Add invoice status (with template-specific styling)
  let statusColor;
  switch (invoice.status) {
    case 'paid':
      statusColor = [39, 174, 96]; // Green
      break;
    case 'overdue':
      statusColor = [231, 76, 60]; // Red
      break;
    case 'sent':
      statusColor = [52, 152, 219]; // Blue
      break;
    default:
      statusColor = [149, 165, 166]; // Gray
  }
  
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.rect(170, 18, 25, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(invoice.status.toUpperCase(), 182.5, 24, { align: 'center' });
  
  // Reset colors
  doc.setTextColor(40, 40, 40);
};

/**
 * Add business and client information
 */
const addBusinessAndClientInfo = (
  doc: jsPDF,
  business: BusinessProfile,
  client: Client,
  template: InvoiceTemplate
): void => {
  // From (Business info)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM', 14, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.text(business.name, 14, 60);
  doc.text(business.address.street, 14, 65);
  doc.text(
    `${business.address.postal} ${business.address.city}, ${business.address.country}`,
    14,
    70
  );
  doc.text(`SIRET: ${business.legal.siret}`, 14, 75);
  doc.text(`VAT: ${business.legal.vatNumber}`, 14, 80);
  
  // To (Client info)
  doc.setFont('helvetica', 'bold');
  doc.text('TO', 120, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.text(client.name, 120, 60);
  if (client.company.name) {
    doc.text(client.company.name, 120, 65);
    doc.text(client.address.street, 120, 70);
    doc.text(
      `${client.address.postal} ${client.address.city}, ${client.address.country}`,
      120,
      75
    );
    if (client.company.vatNumber) {
      doc.text(`VAT: ${client.company.vatNumber}`, 120, 80);
    }
  } else {
    doc.text(client.address.street, 120, 65);
    doc.text(
      `${client.address.postal} ${client.address.city}, ${client.address.country}`,
      120,
      70
    );
  }
};

/**
 * Add invoice details (dates, payment terms)
 */
const addInvoiceDetails = (
  doc: jsPDF,
  invoice: Invoice,
  template: InvoiceTemplate
): void => {
  // Add a divider line
  doc.setDrawColor(230, 230, 230);
  doc.line(14, 90, 196, 90);
  
  // Invoice details
  doc.setFontSize(9);
  
  // Date details
  doc.text('Invoice Date:', 14, 100);
  doc.text(formatDate(invoice.dates.created), 50, 100);
  
  doc.text('Due Date:', 14, 105);
  doc.text(formatDate(invoice.dates.due), 50, 105);
  
  if (invoice.dates.paid) {
    doc.text('Paid Date:', 14, 110);
    doc.text(formatDate(invoice.dates.paid), 50, 110);
  }
  
  // Payment terms
  doc.text('Payment Terms:', 120, 100);
  doc.text(`${invoice.paymentTerms} days`, 160, 100);
  
  // Payment details
  doc.text('Payment Details:', 120, 105);
  doc.text(`IBAN: ${invoice.dates.paid ? 'PAID' : business.paymentInfo.iban}`, 160, 105);
  
  // Add another divider line
  doc.line(14, 115, 196, 115);
};

/**
 * Add invoice items as a table
 */
const addInvoiceItems = (
  doc: jsPDF,
  invoice: Invoice,
  template: InvoiceTemplate
): void => {
  // Prepare the table data
  const tableColumn = ['Description', 'Qty', 'Unit Price', 'VAT %', 'Total'];
  const tableRows = invoice.items.map((item) => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    `${item.vatRate}%`,
    formatCurrency(item.total),
  ]);
  
  // Add the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 120,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: template === 'modern' ? [59, 130, 246] : [70, 70, 70],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });
};

/**
 * Add invoice totals
 */
const addInvoiceTotals = (
  doc: jsPDF,
  invoice: Invoice,
  template: InvoiceTemplate
): void => {
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Add totals
  doc.setFontSize(10);
  
  // Subtotal
  doc.text('Subtotal:', 140, finalY);
  doc.text(formatCurrency(invoice.totals.subtotal), 180, finalY, { align: 'right' });
  
  // Discount (if any)
  if (invoice.totals.discount > 0) {
    doc.text('Discount:', 140, finalY + 6);
    doc.text(`-${formatCurrency(invoice.totals.discount)}`, 180, finalY + 6, { align: 'right' });
  }
  
  // VAT
  doc.text('VAT:', 140, finalY + 12);
  doc.text(formatCurrency(invoice.totals.vatAmount), 180, finalY + 12, { align: 'right' });
  
  // Total
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 140, finalY + 20);
  doc.text(formatCurrency(invoice.totals.total), 180, finalY + 20, { align: 'right' });
  
  // Reset font
  doc.setFont('helvetica', 'normal');
  
  // Add notes if present
  if (invoice.notes) {
    doc.setFontSize(9);
    doc.text('Notes:', 14, finalY);
    doc.text(invoice.notes, 14, finalY + 6);
  }
};

/**
 * Add footer with payment and business information
 */
const addFooter = (
  doc: jsPDF,
  business: BusinessProfile,
  template: InvoiceTemplate
): void => {
  // Add a footer with payment instructions and thank you note
  const pageHeight = doc.internal.pageSize.height;
  
  // Add a divider line
  doc.setDrawColor(230, 230, 230);
  doc.line(14, pageHeight - 40, 196, pageHeight - 40);
  
  // Payment instructions
  doc.setFontSize(9);
  doc.text('Payment Instructions:', 14, pageHeight - 35);
  doc.text(`Please transfer the total amount to: ${business.paymentInfo.iban}`, 14, pageHeight - 30);
  doc.text(`BIC/SWIFT: ${business.paymentInfo.bic}`, 14, pageHeight - 25);
  
  // Thank you note
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for your business!', 105, pageHeight - 15, { align: 'center' });
  
  // Contact information
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${business.email} | ${business.phone} | ${business.address.city}, ${business.address.country}`,
    105,
    pageHeight - 10,
    { align: 'center' }
  );
};

/**
 * Export functions
 */
export default {
  generateInvoicePdf,
};