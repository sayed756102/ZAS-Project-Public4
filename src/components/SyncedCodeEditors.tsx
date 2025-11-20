import { useRef, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { Button } from "./ui/button";
import { Copy, Download, Columns2, Rows2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface SyncedCodeEditorsProps {
  inputValue: string;
  outputValue: string;
  onInputChange?: (value: string) => void;
  inputSegments?: Array<{ text: string; isTranslatable: boolean; startIndex: number; endIndex: number }>;
  onSegmentClick?: (index: number) => void;
  selectedSegmentIndex?: number | null;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  className?: string;
}

export const SyncedCodeEditors = ({
  inputValue,
  outputValue,
  onInputChange,
  inputSegments,
  onSegmentClick,
  selectedSegmentIndex,
  inputPlaceholder,
  outputPlaceholder,
  className
}: SyncedCodeEditorsProps) => {
  const inputScrollRef = useRef<HTMLDivElement>(null);
  const outputScrollRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations.editor[language];

  const handleInputScroll = () => {
    if (inputScrollRef.current && outputScrollRef.current) {
      outputScrollRef.current.scrollTop = inputScrollRef.current.scrollTop;
      outputScrollRef.current.scrollLeft = inputScrollRef.current.scrollLeft;
    }
  };

  const handleOutputScroll = () => {
    if (inputScrollRef.current && outputScrollRef.current) {
      inputScrollRef.current.scrollTop = outputScrollRef.current.scrollTop;
      inputScrollRef.current.scrollLeft = outputScrollRef.current.scrollLeft;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputValue);
      toast({
        title: t.copiedSuccess,
        description: t.copiedDescription,
      });
    } catch (error) {
      toast({
        title: t.copyError,
        description: t.copyErrorDescription,
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([outputValue], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated-code.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t.downloadedSuccess,
      description: t.downloadedDescription,
    });
  };

  const toggleLayout = () => {
    setLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {outputValue && (
        <div className="flex justify-center">
          <div className="inline-flex gap-2 p-3 border-2 border-primary/20 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLayout}
              className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10"
            >
              {layout === 'horizontal' ? <Rows2 className="h-4 w-4" /> : <Columns2 className="h-4 w-4" />}
              {layout === 'horizontal' ? t.vertical : t.horizontal}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10"
            >
              <Copy className="h-4 w-4" />
              {t.copy}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10"
            >
              <Download className="h-4 w-4" />
              {t.download}
            </Button>
          </div>
        </div>
      )}

      {/* Editors Container */}
      <div 
        className={cn(
          "grid gap-4",
          layout === 'horizontal' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}
      >
        {/* Input Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-semibold text-foreground">{t.originalCode}</h3>
            <span className="text-xs text-muted-foreground">
              {inputValue.split('\n').length} {t.lines}
            </span>
          </div>
          <CodeEditor
            value={inputValue}
            onChange={onInputChange}
            segments={inputSegments}
            onSegmentClick={onSegmentClick}
            selectedSegmentIndex={selectedSegmentIndex}
            placeholder={inputPlaceholder}
            scrollRef={inputScrollRef}
            onScroll={handleInputScroll}
          />
        </div>

        {/* Output Editor */}
        {outputValue && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold text-foreground">{t.translatedCode}</h3>
              <span className="text-xs text-muted-foreground">
                {outputValue.split('\n').length} {t.lines}
              </span>
            </div>
            <CodeEditor
              value={outputValue}
              readOnly
              placeholder={outputPlaceholder}
              scrollRef={outputScrollRef}
              onScroll={handleOutputScroll}
            />
          </div>
        )}
      </div>
    </div>
  );
};
