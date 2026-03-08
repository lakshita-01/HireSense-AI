import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import PDFDocument from 'pdfkit';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const extractTextFromFile = async (file) => {
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  
  if (fileExtension === 'pdf') {
    const pdfData = await pdfParse(file.buffer);
    return pdfData.text;
  } else if (fileExtension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  } else {
    throw new Error("Unsupported file format. Use PDF or DOCX");
  }
};

export const generateResumePDF = (resumeContent, targetJobRole) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(24).fillColor('#6366f1').text('Tailored Resume', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#666').text(`Optimized for: ${targetJobRole}`, { align: 'center' });
    doc.moveDown(1.5);

    // Content
    doc.fontSize(11).fillColor('#000').text(resumeContent, {
      align: 'left',
      lineGap: 5
    });

    doc.end();
  });
};

export const generateResumeDocx = async (resumeContent, targetJobRole) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'Tailored Resume',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Optimized for: ${targetJobRole}`,
              italics: true,
              color: '6366f1'
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: resumeContent,
          spacing: { line: 360 }
        })
      ]
    }]
  });

  return await Packer.toBuffer(doc);
};

export const generateCoverLetterPDF = (coverLetter, targetJobRole) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(24).fillColor('#10b981').text('Cover Letter', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#666').text(`For: ${targetJobRole}`, { align: 'center' });
    doc.moveDown(1.5);

    // Content
    doc.fontSize(11).fillColor('#000').text(coverLetter, {
      align: 'left',
      lineGap: 5
    });

    doc.end();
  });
};

export const generateCoverLetterDocx = async (coverLetter, targetJobRole) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'Cover Letter',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `For: ${targetJobRole}`,
              italics: true,
              color: '10b981'
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: coverLetter,
          spacing: { line: 360 }
        })
      ]
    }]
  });

  return await Packer.toBuffer(doc);
};
