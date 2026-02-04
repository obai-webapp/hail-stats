import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlackSummaryProps {
  summary: string;
  className?: string;
}

export function SlackSummary({ summary, className }: SlackSummaryProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('border-2 border-foreground bg-card', className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b-2 border-foreground flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-foreground">
            Slack Summary
          </h3>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
            Ready to paste
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border-2 font-bold text-xs uppercase tracking-wider transition-all',
            copied 
              ? 'border-status-safe bg-status-safe text-white' 
              : 'border-foreground hover:bg-foreground hover:text-primary-foreground'
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <pre className="p-5 text-sm font-mono whitespace-pre-wrap text-foreground leading-relaxed overflow-x-auto bg-secondary/30">
        {summary}
      </pre>
    </div>
  );
}
