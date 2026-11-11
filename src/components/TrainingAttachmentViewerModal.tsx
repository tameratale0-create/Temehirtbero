import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  X,
  FileCheck,
  Calendar,
  User,
  Paperclip,
  Share2
} from 'lucide-react';
import { TrainingAttachment } from '../types';

interface TrainingAttachmentViewerModalProps {
  attachment: TrainingAttachment | null;
  materialTitle?: string;
  onClose: () => void;
}

export const TrainingAttachmentViewerModal: React.FC<TrainingAttachmentViewerModalProps> = ({
  attachment,
  materialTitle,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!attachment) return null;

  const handleCopy = () => {
    const textToCopy = attachment.textContent || attachment.description || attachment.fileName;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (attachment.dataUrl) {
      const a = document.createElement('a');
      a.href = attachment.dataUrl;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create downloadable text file
      const blob = new Blob([attachment.textContent || ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName.endsWith('.txt') ? attachment.fileName : `${attachment.fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${attachment.fileName} - የስልጠና አታችመንት ሰነድ</title>
          <style>
            body { font-family: sans-serif; padding: 30px; line-height: 1.6; color: #1e293b; }
            .header { border-bottom: 2px solid #047857; padding-bottom: 15px; margin-bottom: 20px; }
            .bureau { font-size: 14px; font-weight: bold; color: #065f46; text-transform: uppercase; }
            .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 5px; }
            .meta { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px; font-size: 12px; color: #475569; }
            .content { white-space: pre-line; font-size: 13.5px; }
            .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 11px; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="bureau">የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ · ይፋዊ የስልጠና አታችመንት ሰነድ</div>
            <div class="title">${attachment.fileName}</div>
          </div>
          <div class="meta">
            <div><strong>ዋና የስልጠና ርዕስ:</strong> ${materialTitle || 'አጠቃላይ የስልጠና ሞጁል'}</div>
            <div><strong>የሰነድ አይነት:</strong> ${attachment.fileType.toUpperCase()} · <strong>መጠን:</strong> ${attachment.fileSize} · <strong>የተጫነበት ቀን:</strong> ${attachment.uploadedAt}</div>
            ${attachment.uploadedBy ? `<div><strong>የጫነው ባለሙያ:</strong> ${attachment.uploadedBy}</div>` : ''}
          </div>
          ${attachment.description ? `<p style="font-style: italic; color: #334155;"><strong>መግለጫ፡</strong> ${attachment.description}</p>` : ''}
          <div class="content">${attachment.textContent || 'ምንም የተያያዘ ዝርዝር ጽሑፍ የለም።'}</div>
          <div class="footer">
            ይህ የስልጠና አታችመንት ሰነድ ከሻሸመኔ ትምህርት ቢሮ ፖርታል በቀጥታ ለመምህራን የተዘጋጀ ነው።
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }, 400);
  };

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'docx':
      case 'doc':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'txt':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'image':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 p-5 sm:p-6 text-white shrink-0 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getBadgeColor(attachment.fileType)}`}>
                  {attachment.fileType} ሰነድ
                </span>
                <span className="text-[11px] text-emerald-300 font-mono">
                  {attachment.fileSize}
                </span>
                {attachment.uploadedBy && (
                  <span className="text-[11px] text-slate-300">
                    · በ <strong className="text-white">{attachment.uploadedBy}</strong>
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black text-white leading-snug break-words">
                {attachment.fileName}
              </h3>

              {materialTitle && (
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">ከስልጠና፡ <strong>{materialTitle}</strong> ጋር የተያያዘ</span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
          {attachment.description && (
            <div className="p-3.5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-950">
              <strong>የሰነዱ መግለጫ / ማጠቃለያ፡</strong> {attachment.description}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-700">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>የአታችመንት ጽሑፉ ሙሉ ይዘት (Document Text Content)</span>
              </span>
              <span className="font-mono text-[11px]">
                {attachment.textContent ? `${attachment.textContent.length} ቁምፊዎች` : ''}
              </span>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl whitespace-pre-line font-normal text-slate-800 leading-relaxed max-h-[50vh] overflow-y-auto">
              {attachment.textContent || (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 mx-auto text-slate-300" />
                  <p>ይህ ሰነድ የተያያዘ የውጭ ፋይል ነው (PDF/DOCX)። ሙሉ ፋይሉን ለማንበብ ከታች ያለውን "አውርድ" ወይም "አትም" ይጠቀሙ።</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">ጽሑፉ ተቀድቷል!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>ጽሑፉን ቅዳ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>አትም</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>ሰነዱን አውርድ</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            ዝጋ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
