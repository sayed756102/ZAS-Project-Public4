import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Eye, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranslationRecord {
  id: string;
  source_code: string;
  source_lang: string;
  target_langs: string[];
  translated_content: any;
  created_at: string;
}

export const HistoryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<TranslationRecord | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('translation_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        variant: 'destructive',
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل تحميل السجل' : 'Failed to load history',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translation_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(history.filter((record) => record.id !== id));
      toast({
        title: language === 'ar' ? 'تم!' : 'Success!',
        description: language === 'ar' ? 'تم حذف الترجمة' : 'Translation deleted',
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        variant: 'destructive',
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل حذف الترجمة' : 'Failed to delete translation',
      });
    }
  };

  const handleView = (record: TranslationRecord) => {
    setSelectedRecord(record);
    setShowDialog(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {language === 'ar' ? 'سجل الترجمات' : 'Translation History'}
        </h1>

        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {language === 'ar' ? 'لا يوجد سجل ترجمات بعد' : 'No translation history yet'}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="mt-4"
            >
              {language === 'ar' ? 'ابدأ الترجمة' : 'Start Translating'}
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {history.map((record) => (
              <Card key={record.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(record.created_at)}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {record.source_lang.toUpperCase()}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      {record.target_langs.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {record.source_code.substring(0, 150)}
                      {record.source_code.length > 150 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(record)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {language === 'ar' ? 'تفاصيل الترجمة' : 'Translation Details'}
              </DialogTitle>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedRecord.created_at)}
                </div>
                <Tabs defaultValue="original">
                  <TabsList className="grid w-full grid-cols-auto">
                    <TabsTrigger value="original">
                      {language === 'ar' ? 'الأصلي' : 'Original'} ({selectedRecord.source_lang.toUpperCase()})
                    </TabsTrigger>
                    {selectedRecord.target_langs.map((lang) => (
                      <TabsTrigger key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="original">
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <pre className="text-sm">
                        <code>{selectedRecord.source_code}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  {selectedRecord.target_langs.map((lang) => (
                    <TabsContent key={lang} value={lang}>
                      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        <pre className="text-sm">
                          <code>{selectedRecord.translated_content[lang]}</code>
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
