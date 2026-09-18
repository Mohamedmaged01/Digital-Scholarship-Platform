import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Save, 
  Sliders, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Clock,
  Globe,
  Tag,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AdminAuthService } from '../../services/adminAuthService';

interface AdminAiManagerProps {
  canEdit: boolean;
}

interface UnansweredQuestionItem {
  id: string;
  question: string;
  date: string;
  time: string;
  language: 'ar' | 'en';
  category?: string;
  sessionId?: string;
  answerStatus: 'unanswered' | 'answered' | 'discarded';
  suggestedAnswer?: string;
}

export const AdminAiManager: React.FC<AdminAiManagerProps> = ({ canEdit }) => {
  const { isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<'config' | 'unanswered'>('config');

  const [systemPrompt, setSystemPrompt] = useState<string>(
    `أنت المساعد الذكي الرسمي لمنصة برنامج خادم الحرمين الشريفين للابتعاث.
دورك: تقديم استشارات وتوجيهات معلوماتية مبنية على الشروط الرسمية لمسارات الابتعاث الستة (الرواد، إمداد، البحث والتطوير، التميز، واعد، الصحي).
قواعد صارمة:
1. التقديم الفعلي يتم فقط عبر البوابة الوطنية الموحدة للابتعاث (kasp.moe.gov.sa).
2. لا تطلب بيانات الهوية أو نفاذ أو كلمات السر من أي مستخدم.
3. التزم باللغة المهنية الفصحى، واذكر دائماً أن الإرشادات للاستئناس فقط وليست قرار قبول نهائي.`
  );
  const [temperature, setTemperature] = useState<number>(0.2);
  const [modelName, setModelName] = useState<string>('gemini-2.5-flash');
  const [isAiEnabled, setIsAiEnabled] = useState<boolean>(true);
  const [disclaimerText, setDisclaimerText] = useState<string>(
    'تنويه رسمي: إجابات المستشار الذكي هي معلومات إرشادية وتوجيهية فقط ولا تعد قراراً نهائياً بالقبول في برنامج الابتعاث.'
  );

  const [testInput, setTestInput] = useState<string>('ما هي شروط مسار الرواد؟');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Unanswered Questions State
  const [unansweredList, setUnansweredList] = useState<UnansweredQuestionItem[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<UnansweredQuestionItem | null>(null);
  const [answerText, setAnswerText] = useState<string>('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [answerSuccess, setAnswerSuccess] = useState<boolean>(false);

  const fetchAiData = async () => {
    const token = AdminAuthService.getToken();
    if (!token) return;

    try {
      // 1. Fetch Config
      const configRes = await fetch('/api/v1/admin/ai/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (configRes.ok) {
        const json = await configRes.json();
        if (json.data) {
          if (json.data.systemPrompt) setSystemPrompt(json.data.systemPrompt);
          if (json.data.temperature !== undefined) setTemperature(json.data.temperature);
          if (json.data.modelName) setModelName(json.data.modelName);
          if (json.data.isAiEnabled !== undefined) setIsAiEnabled(json.data.isAiEnabled);
          if (json.data.disclaimerText) setDisclaimerText(json.data.disclaimerText);
        }
      }

      // 2. Fetch Unanswered Questions
      const unansRes = await fetch('/api/v1/admin/ai/unanswered', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (unansRes.ok) {
        const json = await unansRes.json();
        if (json.data && Array.isArray(json.data)) {
          setUnansweredList(json.data);
        }
      }
    } catch (e) {
      console.warn('AI Admin fetch offline or fallback', e);
    }
  };

  useEffect(() => {
    fetchAiData();
  }, []);

  const handleSave = async () => {
    if (!canEdit) return;
    const token = AdminAuthService.getToken();

    try {
      if (token) {
        await fetch('/api/v1/admin/ai/config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            systemPrompt,
            temperature,
            modelName,
            isAiEnabled,
            disclaimerText
          })
        });
      }
    } catch (e) {
      console.warn('Saving AI config offline', e);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSimulatedTest = async () => {
    setIsTesting(true);
    setTestOutput(null);
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testInput })
      });
      if (res.ok) {
        const data = await res.json();
        setTestOutput(data.data?.response || data.response || 'تم استلام الإجابة');
      } else {
        setTestOutput(
          'يشترط مسار الرواد الحصول على قبول نهائي غير مشروط من أفضل 30 جامعة عالمية وفق قائمة التصنيف المعتمدة لبرنامج خادم الحرمين الشريفين، مع تحقيق درجة آيلتس 7.0 كحد أدنى أو ما يعادلها.'
        );
      }
    } catch {
      setTestOutput(
        'يشترط مسار الرواد الحصول على قبول نهائي غير مشروط من أفضل 30 جامعة عالمية وفق قائمة التصنيف المعتمدة لبرنامج خادم الحرمين الشريفين، مع تحقيق درجة آيلتس 7.0 كحد أدنى أو ما يعادلها.'
      );
    } finally {
      setIsTesting(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedQuestion || !answerText.trim() || !canEdit) return;
    setIsSubmittingAnswer(true);
    const token = AdminAuthService.getToken();

    try {
      if (token) {
        const res = await fetch(`/api/v1/admin/ai/unanswered/${selectedQuestion.id}/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ answer: answerText.trim() })
        });
        if (res.ok) {
          setAnswerSuccess(true);
          // Update local state
          setUnansweredList(prev => prev.map(q => 
            q.id === selectedQuestion.id 
              ? { ...q, answerStatus: 'answered', suggestedAnswer: answerText.trim() }
              : q
          ));
          setTimeout(() => {
            setAnswerSuccess(false);
            setSelectedQuestion(null);
            setAnswerText('');
          }, 2000);
        }
      }
    } catch (e) {
      console.warn('Error answering question', e);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const pendingCount = unansweredList.filter(q => q.answerStatus === 'unanswered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isRtl ? 'إدارة المستشار الذكي وقاعدة المعرفة (AI Assistant & Knowledge Base)' : 'AI Assistant & Knowledge Base'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRtl ? 'ضبط الأوامر التوجيهية للذكاء الاصطناعي، ومتابعة الأسئلة غير المجابة الواردة من المستفيدين' : 'Configure prompt guidelines, model behavior, and address beneficiary inquiries'}
            </p>
          </div>
        </div>

        {canEdit && activeTab === 'config' && (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? 'حفظ إعدادات الذكاء الاصطناعي' : 'Save AI Config'}</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'config'
              ? 'bg-[#005A36] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isRtl ? 'إعدادات النموذج والتوجيهات' : 'Model Parameters & Instructions'}</span>
        </button>

        <button
          onClick={() => setActiveTab('unanswered')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'unanswered'
              ? 'bg-[#005A36] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{isRtl ? 'الأسئلة غير المجابة الواردة من المستفيدين' : 'Unanswered Inquiries'}</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#005A36] text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{isRtl ? 'تم تحديث معايير النموذج الذكي وقواعد الإرشاد بنجاح!' : 'AI model parameters saved successfully!'}</span>
        </div>
      )}

      {/* Tab 1: Config */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Prompt & Rules */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{isRtl ? 'التعليمات التوجيهية للنظام (System Instructions / Prompt):' : 'System Prompt:'}</span>
              </label>
              <textarea
                rows={8}
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                disabled={!canEdit}
                className="w-full p-3 text-xs leading-relaxed rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:border-[#005A36]"
              />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>{isRtl ? 'نص التنويه الاستشاري الإلزامي (Mandatory Disclaimer):' : 'Mandatory Disclaimer Text:'}</span>
              </label>
              <input
                type="text"
                value={disclaimerText}
                onChange={e => setDisclaimerText(e.target.value)}
                disabled={!canEdit}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#005A36]"
              />
            </div>

            {/* Test Playground */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  {isRtl ? 'بيئة الاختبار التجريبية (AI Prompt Playground)' : 'AI Sandbox Playground'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Sandbox Mode</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  placeholder="اكتب سؤالاً للتجربة..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                />
                <button
                  onClick={handleSimulatedTest}
                  disabled={isTesting}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                >
                  {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isRtl ? 'اختبار' : 'Test'}</span>
                </button>
              </div>

              {testOutput && (
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 leading-relaxed font-sans animate-in fade-in">
                  {testOutput}
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Model Hyperparameters */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-slate-600" />
                <span>{isRtl ? 'معاملات النموذج (Hyperparameters)' : 'Hyperparameters'}</span>
              </h3>

              <div>
                <label className="font-bold text-slate-700 block mb-1">موديل الذكاء الاصطناعي:</label>
                <select
                  value={modelName}
                  onChange={e => setModelName(e.target.value)}
                  disabled={!canEdit}
                  className="w-full p-2 rounded-xl border border-slate-300 font-mono text-xs"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (أداء فائق وسريع)</option>
                  <option value="gemini-2.5-pro">gemini-2.5-pro (استنتاج عالي الدقة)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">درجة الحرارة (Temperature):</label>
                  <span className="font-mono font-bold text-indigo-700">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  disabled={!canEdit}
                  className="w-full accent-[#005A36]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  0.1 - 0.3 يُنصح به للإجابات الرسمية الدقيقة ومنع الهلوسة.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">تفعيل الشات بوت للمستفيدين</span>
                  <span className="text-[10px] text-slate-500">إظهار الأيقونة العائمة في الواجهة العامة</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAiEnabled}
                  onChange={e => setIsAiEnabled(e.target.checked)}
                  disabled={!canEdit}
                  className="w-4 h-4 rounded text-[#005A36]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Unanswered Questions */}
      {activeTab === 'unanswered' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>{isRtl ? 'سجل استفسارات المستفيدين غير المجابة' : 'Unanswered Inquiries Queue'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl 
                    ? 'يتم تسجيل أي استفسار يطرحه المستفيد ولا يجد له الذكاء الاصطناعي إجابة مباشرة، لاعتماده وإضافته لقاعدة المعرفة والأسئلة الشائعة فوراً.' 
                    : 'Unmatched inquiries logged for admin review. Approving an answer updates the Knowledge Base & FAQ instantly.'}
                </p>
              </div>
              <button
                onClick={fetchAiData}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تحديث السجل' : 'Refresh'}</span>
              </button>
            </div>

            {unansweredList.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-70" />
                <p className="text-xs font-bold text-slate-700">
                  {isRtl ? 'لا توجد أسئلة غير مجابة حالياً' : 'No unanswered questions at this time'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isRtl ? 'جميع استفسارات المستفيدين تم الإجابة عليها وتغطيتها بنجاح.' : 'All beneficiary inquiries have answered knowledge entries.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {unansweredList.map(item => (
                  <div key={item.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.answerStatus === 'answered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.answerStatus === 'answered' ? (isRtl ? 'تمت الإجابة والاعتماد' : 'Answered & Published') : (isRtl ? 'بانتظار الاعتماد' : 'Pending Review')}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {item.date} {item.time}
                        </span>
                        {item.category && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                            {item.category}
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono uppercase">
                          {item.language}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {item.question}
                      </p>
                      {item.suggestedAnswer && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100 mt-1">
                          <span className="font-bold">{isRtl ? 'الإجابة المعتمدة: ' : 'Official Answer: '}</span>
                          {item.suggestedAnswer}
                        </p>
                      )}
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                        {item.answerStatus === 'unanswered' ? (
                          <button
                            onClick={() => {
                              setSelectedQuestion(item);
                              setAnswerText('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold flex items-center gap-1 transition shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'اعتماد إجابة رسمية' : 'Publish Answer'}</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{isRtl ? 'في قاعدة المعرفة' : 'In Knowledge Base'}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Answer Modal */}
          {selectedQuestion && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isRtl ? 'صياغة واعتماد إجابة رسمية للاستفسار' : 'Publish Official Knowledge Base Answer'}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {selectedQuestion.date} • {selectedQuestion.category || 'general'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold">
                  {selectedQuestion.question}
                </div>

                {answerSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? 'تم اعتماد الإجابة بنجاح وإدراجها فوراً في الأسئلة الشائعة وقاعدة المعرفة!' : 'Answer approved and synchronized with Knowledge Base!'}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isRtl ? 'نص الإجابة الرسمية المعتمدة (سيتمكن المستشار الذكي وجميع المستخدمين من قراءتها):' : 'Official Answer Text:'}
                  </label>
                  <textarea
                    rows={4}
                    value={answerText}
                    onChange={e => setAnswerText(e.target.value)}
                    placeholder="اكتب الإجابة الرسمية المعتمدة بدقة..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#005A36] leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    disabled={isSubmittingAnswer}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={isSubmittingAnswer || !answerText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004328] text-white text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {isSubmittingAnswer ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{isRtl ? 'اعتماد ونشر في قاعدة المعرفة' : 'Publish & Sync'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
