import { NewsArticle } from '../types';

const STORAGE_KEY = 'kasp_custom_news_v1';

export const INITIAL_HOMEPAGE_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    slug: 'academic-year-2026-launch',
    titleAr: 'فتح باب التقديم لبرنامج خادم الحرمين الشريفين للابتعاث للعام الأكاديمي 2026/2027',
    titleEn: 'Applications Open for KASP Scholarship Program Academic Year 2026/2027',
    summaryAr: 'أعلنت وزارة التعليم عن انطلاق التقديم والتسجيل عبر المسارات الستة المعتمدة لدعم ريادة الكفاءات وتأهيل الكوادر الوطنية في أفضل الجامعات العالمية.',
    summaryEn: 'Ministry of Education announces the opening of applications across all six national tracks to qualify national cadres.',
    contentAr: 'انطلاقاً من مستهدفات رؤية المملكة 2030 وبرنامج تنمية القدرات البشرية، أعلنت وزارة التعليم عن فتح باب التقديم لبرنامج خادم الحرمين الشريفين للابتعاث للعام الأكاديمي 2026/2027 عبر مساراته المعتمدة (الرواد، البحث والتطوير، إمداد، واعد، سياحة، فضاء). ويهدف البرنامج إلى تمكين الطلاب والطالبات من الالتحاق بأرقى 200 جامعة وكلية بحثية في العالم في التخصصات الاستراتيجية الواعدة.',
    contentEn: 'Stemming from Saudi Vision 2030 targets and the Human Capability Development Program, the Ministry of Education has opened applications for KASP...',
    category: 'announcement',
    publishDate: '2026-09-01',
    authorAr: 'الإدارة العامة للابتعاث',
    authorEn: 'General Directorate of Scholarships',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    status: 'published',
    readTimeMinutes: 3
  },
  {
    id: 'news-2',
    slug: 'expanded-top-universities-list',
    titleAr: 'تحديث قائمة الجامعات العالمية المتميزة وإضافة تخصصات الذكاء الاصطناعي وعلوم الفضاء',
    titleEn: 'Updated Top Global Universities List with Advanced AI & Aerospace Disciplines',
    summaryAr: 'شمل التحديث السنوي إدراج نخبة من أرقى المعاهد والمختبرات البحثية الدولية في مسارات الرواد والبحث والتطوير والابتكار.',
    summaryEn: 'The annual update includes top international research institutes across Pioneers and R&D tracks.',
    contentAr: 'أجرت اللجنة الفنية لمراجعة القوائم الأكاديمية مواءمة دقيقة مع أحدث معايير التصنيفات الدولية للجامعات، وأسفرت المراجعة عن إدراج مراكز تميز رائدة في أبحاث الحوسبة الكمومية، والذكاء الاصطناعي التوليدي، والطاقة المتجددة والهيدروجين الأخضر، بما يواكب مستهدفات الأولويات الوطنية.',
    contentEn: 'The technical committee for academic lists conducted thorough alignments with international ranking standards...',
    category: 'admission',
    publishDate: '2026-08-28',
    authorAr: 'لجنة المواءمة والتصنيف الأكاديمي',
    authorEn: 'Academic Alignment Committee',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    status: 'published',
    readTimeMinutes: 4
  },
  {
    id: 'news-3',
    slug: 'cultural-missions-orientation-webinar',
    titleAr: 'الملحقيات الثقافية تنظم ملتقيات إرشادية وتوجيهية افتراضية للمرشحين والمبتعثين الجدد',
    titleEn: 'Cultural Missions Organize Virtual Orientation Webinars for New Scholars',
    summaryAr: 'جلسات إرشادية تشمل متطلبات التأشيرة الدراسية، والتأمين الطبي، وفتح الحسابات المصرفية، وسبل التكيف الأكاديمي والمعيشي.',
    summaryEn: 'Interactive orientation sessions covering student visa protocols, housing, and healthcare abroad.',
    contentAr: 'أطلقت الملحقيات الثقافية لسفارات المملكة في الولايات المتحدة وبريطانيا وأستراليا واليابان وفرنسا وألمانيا سلسلة من ورش العمل التوجيهية الحية للطلبة الصادرة لهم قرارات الابتعاث، بهدف تقديم الدعم الكامل وتذليل كافة العقبات قبل وأثناء وصولهم لمقرات دراستهم.',
    contentEn: 'Saudi cultural missions in the US, UK, Australia, Japan, France, and Germany launched interactive briefing workshops...',
    category: 'event',
    publishDate: '2026-08-15',
    authorAr: 'وكالة العلاقات والملحقيات الثقافية',
    authorEn: 'Cultural Missions Agency',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    isFeatured: false,
    status: 'published',
    readTimeMinutes: 3
  },
  {
    id: 'news-4',
    slug: 'strategic-internship-alliances-2026',
    titleAr: 'توقيع شراكات تدريب استراتيجية مع كبرى الشركات والمؤسسات التقنية والصناعية العالمية',
    titleEn: 'Strategic Internship Alliances with Global Tech & Industrial Giants',
    summaryAr: 'إتاحة فرص التدريب التعاوني والمهني لطلبة مسار إمداد وواعد لربط المعرفة النظرية بأحدث متطلبات سوق العمل.',
    summaryEn: 'Enabling cooperative work experience for Imdad & Waed scholars with leading global partners.',
    contentAr: 'أبرمت وزارة التعليم اتفاقيات نوعية مع كبرى الشركات العالمية لتدريب وتمكين المبتعثين السعوديين خلال فترات دراستهم، وتشمل الشراكات برامج إشراف مهني وبحثي ومشاريع تطبيقية في قطاعات الطيران، والرقائق الإلكترونية، وسلاسل الإمداد المتقدمة.',
    contentEn: 'The Ministry of Education signed strategic agreements with international companies to train Saudi scholars...',
    category: 'strategy',
    publishDate: '2026-08-05',
    authorAr: 'الإدارة العامة للشراكات الاستراتيجية',
    authorEn: 'Strategic Partnerships Department',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
    isFeatured: false,
    status: 'published',
    readTimeMinutes: 5
  }
];

export class NewsService {
  public static getNews(): NewsArticle[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: NewsArticle[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_HOMEPAGE_NEWS;
  }

  public static async fetchFromServer(): Promise<NewsArticle[]> {
    try {
      const res = await fetch('/api/v1/news');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          // Merge with any local articles
          const local = this.getNews();
          const serverMap = new Map<string, NewsArticle>();
          json.data.forEach((item: NewsArticle) => serverMap.set(item.id, item));
          local.forEach((item: NewsArticle) => {
            if (!serverMap.has(item.id)) {
              serverMap.set(item.id, item);
            }
          });
          const merged = Array.from(serverMap.values()).sort(
            (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch {
      // Fallback to local
    }
    return this.getNews();
  }

  public static async addNews(article: Omit<NewsArticle, 'id' | 'slug' | 'publishDate'>): Promise<NewsArticle> {
    const id = `news-${Date.now()}`;
    const newArticle: NewsArticle = {
      ...article,
      id,
      slug: (article.titleEn || article.titleAr).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) || id,
      publishDate: new Date().toISOString().split('T')[0],
      readTimeMinutes: article.readTimeMinutes || Math.max(1, Math.ceil((article.contentAr || article.summaryAr || '').length / 300))
    };

    // Save locally
    const current = this.getNews();
    const updated = [newArticle, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Try posting to server
    try {
      await fetch('/api/v1/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
    } catch {
      // Server error ignored, local storage already persisted
    }

    return newArticle;
  }

  public static deleteNews(id: string): NewsArticle[] {
    const current = this.getNews().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  }
}
