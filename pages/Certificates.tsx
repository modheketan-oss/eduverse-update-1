import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Award, Loader2 } from 'lucide-react';
import { MOCK_CERTIFICATES } from '../constants';
import { jsPDF } from 'jspdf';
import { Certificate } from '../types';

export const Certificates: React.FC = () => {
  const navigate = useNavigate();
  const [generatingId, setGeneratingId] = React.useState<string | null>(null);

  const generatePDF = async (cert: Certificate) => {
    setGeneratingId(cert.id);
    
    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // --- Certificate Design ---

        // Background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 297, 210, 'F');

        // Main Border (Purple)
        doc.setLineWidth(2);
        doc.setDrawColor(124, 58, 237); // #7c3aed
        doc.rect(10, 10, 277, 190);

        // Inner Border (Light Grey)
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, 15, 267, 180);

        // Corner Accents
        doc.setFillColor(124, 58, 237);
        doc.rect(10, 10, 10, 10, 'F'); // Top Left
        doc.rect(277, 190, 10, 10, 'F'); // Bottom Right

        // Header Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.setTextColor(55, 65, 81); // Slate-700
        doc.text("Certificate of Completion", 148.5, 50, { align: "center" });

        // Subtext
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.text("This is to certify that", 148.5, 75, { align: "center" });

        // User Name (Hardcoded 'Learner' for demo)
        doc.setFont("times", "bolditalic");
        doc.setFontSize(36);
        doc.setTextColor(124, 58, 237); // Purple
        doc.text("Learner", 148.5, 95, { align: "center" });
        
        // Line under name
        doc.setDrawColor(124, 58, 237);
        doc.setLineWidth(0.5);
        doc.line(100, 97, 197, 97);

        // Action Text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.text("has successfully completed the course", 148.5, 115, { align: "center" });

        // Course Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(30, 30, 30);
        const splitTitle = doc.splitTextToSize(cert.title, 200);
        doc.text(splitTitle, 148.5, 135, { align: "center" });

        // Date
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`Issued on: ${cert.issueDate}`, 148.5, 160, { align: "center" });

        // Signatures
        doc.setLineWidth(0.5);
        doc.setDrawColor(50, 50, 50);
        
        const sigY = 180;
        
        doc.line(70, sigY, 130, sigY); // Line 1
        doc.line(167, sigY, 227, sigY); // Line 2

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text("Director of Education", 100, sigY + 5, { align: "center" });
        doc.text("Course Instructor", 197, sigY + 5, { align: "center" });

        // Brand
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(124, 58, 237);
        doc.text("EduVerse", 20, 200);

        // Save
        doc.save(`EduVerse_Certificate_${cert.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error", error);
        alert("Failed to generate certificate. Please try again.");
    } finally {
        setGeneratingId(null);
    }
  };

  return (
    <div className="p-6 pt-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">My Certificates</h1>
      </div>

      <div className="space-y-4">
        {MOCK_CERTIFICATES.map((cert) => (
          <div key={cert.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden">
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500 rounded-l-2xl"></div>

            <div className="flex justify-between items-start pl-3">
              <div>
                <h3 className="font-bold text-slate-800 pr-8 leading-tight mb-1">{cert.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Issued: {cert.issueDate}</p>
              </div>
              <Award className="w-6 h-6 text-purple-600 shrink-0" />
            </div>

            <div className="flex gap-3 pl-3 pt-2">
              <button 
                onClick={() => generatePDF(cert)}
                disabled={generatingId === cert.id}
                className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-purple-700 transition disabled:opacity-70 disabled:cursor-wait"
              >
                {generatingId === cert.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                {generatingId === cert.id ? "Generating..." : "Download PDF"}
              </button>
              <button className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};