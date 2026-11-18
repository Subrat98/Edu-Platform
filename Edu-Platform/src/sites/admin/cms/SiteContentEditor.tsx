import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Home,
  Info,
  GraduationCap,
  Phone,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Building2,
  Calendar,
  Globe,
  Sliders,
  Award,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getFullSiteContent,
  saveFullSiteContent,
  resetFullSiteContent,
  DEFAULT_COLLEGE_CONTENT,
  DEFAULT_SCHOOL_CONTENT,
  type SiteContentBundle,
  type HeroSlideContent,
  type StatItemContent,
  type TimelineItemContent,
  type FormerLeaderContent,
} from "@/features/content/siteContentService";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import type { InstitutionType } from "@/types";

function ImageField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value?: string;
  onChange: (val: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image file is too large", {
        description: "Please select an image smaller than 4MB.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
        toast.success("Image selected and uploaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-3.5 rounded-xl border border-border/80 bg-background/60 space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ImageIcon className="size-3.5 text-primary" />
            <span>{label}</span>
          </Label>
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
          >
            <Upload className="size-3" />
            <span>Upload From Device</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {value ? (
          <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border-2 border-primary/20 bg-muted/30 shadow-xs flex items-center justify-center group">
            <img src={value} alt="Preview" className="size-full object-cover" />
          </div>
        ) : (
          <div className="size-16 shrink-0 rounded-lg border-2 border-dashed border-border/80 flex items-center justify-center text-muted-foreground bg-muted/20">
            <ImageIcon className="size-6 opacity-40" />
          </div>
        )}
        <div className="flex-1 w-full space-y-1">
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL (e.g. /college-logo.png, https://..., or data:image/...)"
            className="text-xs font-mono"
          />
          <p className="text-[10px] text-muted-foreground">
            Enter an image URL, path (/college-logo.png), or click <strong>Upload From Device</strong> to select any image from your computer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SiteContentEditor() {
  const { institutionId } = useInstitutionData();
  const [selectedWing, setSelectedWing] = useState<InstitutionType>(
    institutionId === "school" ? "school" : "college"
  );
  const [activeTab, setActiveTab] = useState<"branding" | "home" | "about" | "admissions" | "contact">("branding");
  const [content, setContent] = useState<SiteContentBundle>(() => getFullSiteContent(selectedWing));
  const [isDirty, setIsDirty] = useState(false);

  // Sync state when wing changes
  useEffect(() => {
    setContent(getFullSiteContent(selectedWing));
    setIsDirty(false);
  }, [selectedWing]);

  // Handle saving
  const handleSave = () => {
    saveFullSiteContent(selectedWing, content);
    setIsDirty(false);
    toast.success("Website content saved successfully!", {
      description: `All updates to the ${selectedWing === "college" ? "College" : "School"} website are now live.`,
    });
  };

  // Handle reset
  const handleReset = () => {
    resetFullSiteContent(selectedWing);
    const restored = selectedWing === "school" ? DEFAULT_SCHOOL_CONTENT : DEFAULT_COLLEGE_CONTENT;
    setContent(restored);
    setIsDirty(false);
    toast.info("Content reverted to factory default text.");
  };

  // Helper for updating Branding fields
  const updateBranding = (patch: Partial<SiteContentBundle["branding"]>) => {
    setContent((prev) => ({ ...prev, branding: { ...prev.branding, ...patch } }));
    setIsDirty(true);
  };

  // Helper for updating Home fields
  const updateHome = (patch: Partial<SiteContentBundle["home"]>) => {
    setContent((prev) => ({ ...prev, home: { ...prev.home, ...patch } }));
    setIsDirty(true);
  };

  // Helper for updating About fields
  const updateAbout = (patch: Partial<SiteContentBundle["about"]>) => {
    setContent((prev) => ({ ...prev, about: { ...prev.about, ...patch } }));
    setIsDirty(true);
  };

  // Helper for updating Admissions fields
  const updateAdmissions = (patch: Partial<SiteContentBundle["admissions"]>) => {
    setContent((prev) => ({ ...prev, admissions: { ...prev.admissions, ...patch } }));
    setIsDirty(true);
  };

  // Helper for updating Contact fields
  const updateContact = (patch: Partial<SiteContentBundle["contact"]>) => {
    setContent((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }));
    setIsDirty(true);
  };

  // Slide updater
  const updateSlide = (idx: number, patch: Partial<HeroSlideContent>) => {
    const updated = [...content.home.heroSlides];
    if (updated[idx]) {
      updated[idx] = { ...updated[idx], ...patch };
      updateHome({ heroSlides: updated });
    }
  };

  // Add slide
  const addSlide = () => {
    const newSlide: HeroSlideContent = {
      title: "New Featured Campus Highlight",
      subtitle: "Excellence in Higher Learning and Student Development",
      description: "Empowering scholars with cutting-edge academic infrastructure and holistic support.",
      badge: "Campus Update",
      image: selectedWing === "college" ? "/assets/college-hero.jpg" : "/assets/school-hero.jpg",
      primaryCta: { label: "Explore More", href: `/${selectedWing}/about` },
      secondaryCta: { label: "Contact Us", href: `/${selectedWing}/contact` },
    };
    updateHome({ heroSlides: [...content.home.heroSlides, newSlide] });
  };

  // Remove slide
  const removeSlide = (idx: number) => {
    if (content.home.heroSlides.length <= 1) {
      toast.warning("Keep at least one hero slide.");
      return;
    }
    const updated = content.home.heroSlides.filter((_, i) => i !== idx);
    updateHome({ heroSlides: updated });
  };

  // Stat updater
  const updateStat = (idx: number, patch: Partial<StatItemContent>) => {
    const updated = [...content.home.stats];
    if (updated[idx]) {
      updated[idx] = { ...updated[idx], ...patch };
      updateHome({ stats: updated });
    }
  };

  // Timeline updater
  const updateTimelineItem = (idx: number, patch: Partial<TimelineItemContent>) => {
    const updated = [...content.about.timeline];
    if (updated[idx]) {
      updated[idx] = { ...updated[idx], ...patch };
      updateAbout({ timeline: updated });
    }
  };

  const addTimelineItem = () => {
    const newItem: TimelineItemContent = {
      year: new Date().getFullYear().toString(),
      event: "New milestone achieved by the institution.",
    };
    updateAbout({ timeline: [...content.about.timeline, newItem] });
  };

  const removeTimelineItem = (idx: number) => {
    updateAbout({ timeline: content.about.timeline.filter((_, i) => i !== idx) });
  };

  // Former leaders updater
  const updateLeader = (idx: number, patch: Partial<FormerLeaderContent>) => {
    const updated = [...content.about.formerLeaders];
    if (updated[idx]) {
      updated[idx] = { ...updated[idx], ...patch };
      updateAbout({ formerLeaders: updated });
    }
  };

  const getLivePreviewUrl = () => {
    if (activeTab === "home") return `/${selectedWing}`;
    return `/${selectedWing}/${activeTab}`;
  };

  return (
    <div className="space-y-6 pb-20">
      <AdminPageHeader
        title="Website Content Editor (Super Admin Access)"
        description="Full access content management system. Edit headings, hero banners, statistics, timeline milestones, and contact information across the public website pages."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
              <Link to={getLivePreviewUrl()} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />
                <span>View Live Page</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs" onClick={handleReset}>
              <RotateCcw className="size-3.5" />
              <span>Reset Defaults</span>
            </Button>
            <Button size="sm" className="gap-1.5 text-xs shadow-xs" onClick={handleSave}>
              <Save className="size-3.5" />
              <span>Save All Changes</span>
            </Button>
          </div>
        }
      />

      {/* Campus Wing Switcher & Status Bar */}
      <Card className="border border-primary/20 bg-primary/5 shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Editing Campus Wing:</span>
              {isDirty && (
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-300">
                  Unsaved Changes
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select which campus portal's live website content you want to configure.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border/80">
            <button
              type="button"
              onClick={() => setSelectedWing("college")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedWing === "college"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="size-3.5" />
              <span>Our College Website</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedWing("school")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedWing === "school"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="size-3.5" />
              <span>Our School Website</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Page Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 p-1.5 bg-muted/60 rounded-xl h-auto gap-1">
          <TabsTrigger value="branding" className="gap-2 py-2 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <ImageIcon className="size-4 text-primary" />
            <span>Brand Logo (Every Page)</span>
          </TabsTrigger>
          <TabsTrigger value="home" className="gap-2 py-2 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <Home className="size-4 text-primary" />
            <span>Home Page</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2 py-2 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <Info className="size-4 text-primary" />
            <span>About Us</span>
          </TabsTrigger>
          <TabsTrigger value="admissions" className="gap-2 py-2 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <GraduationCap className="size-4 text-primary" />
            <span>Admissions</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2 py-2 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-xs">
            <Phone className="size-4 text-primary" />
            <span>Contact Details</span>
          </TabsTrigger>
        </TabsList>

        {/* ======================================================== */}
        {/* TAB 0: BRANDING & LOGO (PRESENT ON EVERY PAGE) */}
        {/* ======================================================== */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="size-4 text-primary" />
                <span>Header &amp; Footer Brand Identity (Present on Every Single Page)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                This logo and institution title appears prominently at the top header and footer of every single page across the website.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <ImageField
                label="Institution Official Logo / Crest"
                description="The primary institution emblem/logo shown in the navigation bar header and footer on every page."
                value={content.branding?.logoUrl || "/college-logo.png"}
                onChange={(val) => updateBranding({ logoUrl: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold">Institution Full Name</Label>
                  <Input
                    value={content.branding?.institutionName || ""}
                    onChange={(e) => updateBranding({ institutionName: e.target.value })}
                    className="mt-1 text-xs font-bold"
                  />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Displayed next to the logo in the header on every page.</p>
                </div>
                <div>
                  <Label className="text-xs font-bold">Tagline / Motto</Label>
                  <Input
                    value={content.branding?.tagline || ""}
                    onChange={(e) => updateBranding({ tagline: e.target.value })}
                    className="mt-1 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Displayed directly below the institution name.</p>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold">Affiliation &amp; Accreditation Badge Text</Label>
                <Input
                  value={content.branding?.affiliationBadge || ""}
                  onChange={(e) => updateBranding({ affiliationBadge: e.target.value })}
                  className="mt-1 text-xs"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">e.g. "Autonomous College · NAAC A+" or "CBSE Affiliation No. 3330123"</p>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-xl border-2 border-primary/20 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary text-[10px] font-bold">Live Header Preview</Badge>
                  <span className="text-[11px] text-muted-foreground">How it renders at the top of every page:</span>
                </div>
                <div className="p-3 rounded-lg border bg-card flex items-center gap-3">
                  {content.branding?.logoUrl ? (
                    <img
                      src={content.branding.logoUrl}
                      alt={content.branding?.institutionName || "Logo"}
                      className="size-14 shrink-0 rounded-lg object-contain border p-0.5 bg-background shadow-xs"
                    />
                  ) : (
                    <div className="size-14 shrink-0 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary">
                      LOGO
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-heading text-base font-bold block truncate text-foreground">
                      {content.branding?.institutionName || (selectedWing === "college" ? "Utkal Autonomous College" : "Our School")}
                    </span>
                    <span className="text-xs text-primary font-semibold block truncate">
                      {content.branding?.tagline || "Premier Higher Education Institution"}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {content.branding?.affiliationBadge || "Autonomous College · NAAC Grade A+"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 1: HOME PAGE CONTENT */}
        {/* ======================================================== */}
        <TabsContent value="home" className="space-y-6">
          {/* Announcement Ticker */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>1. Official Announcement Ticker Bar</span>
              </CardTitle>
              <CardDescription className="text-xs">
                The continuous animated alert headline shown directly below the top navigation bar.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <Label className="text-xs font-bold text-foreground">Ticker Headline Message</Label>
                <Input
                  value={content.home.tickerText}
                  onChange={(e) => updateHome({ tickerText: e.target.value })}
                  placeholder="Enter ticker message..."
                  className="mt-1 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hero Slider Carousel */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="size-4 text-primary" />
                  <span>2. Hero Banner Slider ({content.home.heroSlides.length} Slides)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Full-width main rotating carousel slides on the home screen.
                </CardDescription>
              </div>
              <Button size="xs" variant="outline" onClick={addSlide} className="gap-1 text-xs">
                <Plus className="size-3" /> Add Slide
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              {content.home.heroSlides.map((slide, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-primary">Slide #{idx + 1}</span>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => removeSlide(idx)}
                      className="text-destructive hover:bg-destructive/10 h-7 text-xs gap-1"
                    >
                      <Trash2 className="size-3" /> Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-bold">Slide Main Title</Label>
                      <Input
                        value={slide.title}
                        onChange={(e) => updateSlide(idx, { title: e.target.value })}
                        className="mt-1 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold">Accent Badge Text</Label>
                      <Input
                        value={slide.badge}
                        onChange={(e) => updateSlide(idx, { badge: e.target.value })}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[11px] font-bold">Subtitle / Highlight Tagline</Label>
                    <Input
                      value={slide.subtitle}
                      onChange={(e) => updateSlide(idx, { subtitle: e.target.value })}
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] font-bold">Description Paragraph</Label>
                    <Textarea
                      value={slide.description}
                      onChange={(e) => updateSlide(idx, { description: e.target.value })}
                      rows={2}
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 rounded-lg border bg-background space-y-2">
                      <Label className="text-[11px] font-bold text-primary">Primary Action Button (CTA)</Label>
                      <Input
                        value={slide.primaryCta.label}
                        onChange={(e) =>
                          updateSlide(idx, {
                            primaryCta: { ...slide.primaryCta, label: e.target.value },
                          })
                        }
                        placeholder="Button text"
                        className="text-xs"
                      />
                      <Input
                        value={slide.primaryCta.href}
                        onChange={(e) =>
                          updateSlide(idx, {
                            primaryCta: { ...slide.primaryCta, href: e.target.value },
                          })
                        }
                        placeholder="Link destination"
                        className="text-xs font-mono"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg border bg-background space-y-2">
                      <Label className="text-[11px] font-bold text-muted-foreground">Secondary Button (CTA)</Label>
                      <Input
                        value={slide.secondaryCta.label}
                        onChange={(e) =>
                          updateSlide(idx, {
                            secondaryCta: { ...slide.secondaryCta, label: e.target.value },
                          })
                        }
                        placeholder="Button text"
                        className="text-xs"
                      />
                      <Input
                        value={slide.secondaryCta.href}
                        onChange={(e) =>
                          updateSlide(idx, {
                            secondaryCta: { ...slide.secondaryCta, href: e.target.value },
                          })
                        }
                        placeholder="Link destination"
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>

                  <ImageField
                    label="Slide Background Banner Image"
                    description="The main background photograph shown on this slide in the hero section."
                    value={slide.image}
                    onChange={(val) => updateSlide(idx, { image: val })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Statistics Counters */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Award className="size-4 text-primary" />
                <span>3. Institutional Statistics Counters (8 Key Metrics)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                The numeric counter boxes displaying alumni, department counts, faculty, and legacy years.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {content.home.stats.map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-xl border bg-muted/10 space-y-2">
                    <div>
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Metric #{idx + 1} Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(idx, { label: e.target.value })}
                        className="mt-0.5 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Display Value</Label>
                      <Input
                        value={stat.val}
                        onChange={(e) => updateStat(idx, { val: e.target.value })}
                        className="mt-0.5 text-xs font-black text-primary font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Subtitle / Note</Label>
                      <Input
                        value={stat.sub}
                        onChange={(e) => updateStat(idx, { sub: e.target.value })}
                        className="mt-0.5 text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leadership Messages */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                <span>4. Executive Leadership Address &amp; Vision Messages</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Official quotes and popup address statements from university or school leadership.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              {/* Chancellor Message (College) or Principal Message (School) */}
              {selectedWing === "college" && content.home.chancellorMessage ? (
                <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                  <div className="font-bold text-xs text-amber-700 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>Hon'ble Chancellor &amp; Governor Address</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-bold">Dignitary Name</Label>
                      <Input
                        value={content.home.chancellorMessage.headName}
                        onChange={(e) =>
                          updateHome({
                            chancellorMessage: {
                              ...content.home.chancellorMessage!,
                              headName: e.target.value,
                            },
                          })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold">Office / Location</Label>
                      <Input
                        value={content.home.chancellorMessage.location}
                        onChange={(e) =>
                          updateHome({
                            chancellorMessage: {
                              ...content.home.chancellorMessage!,
                              location: e.target.value,
                            },
                          })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">Card Highlight Quote</Label>
                    <Textarea
                      value={content.home.chancellorMessage.shortQuote}
                      onChange={(e) =>
                        updateHome({
                          chancellorMessage: {
                            ...content.home.chancellorMessage!,
                            shortQuote: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      className="mt-1 text-xs italic"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">Full Modal Address</Label>
                    <Textarea
                      value={content.home.chancellorMessage.fullMessage}
                      onChange={(e) =>
                        updateHome({
                          chancellorMessage: {
                            ...content.home.chancellorMessage!,
                            fullMessage: e.target.value,
                          },
                        })
                      }
                      rows={4}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              ) : null}

              {/* Vice-Chancellor Message (College) */}
              {selectedWing === "college" && content.home.vcMessage ? (
                <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                  <div className="font-bold text-xs text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>Vice-Chancellor's Vision &amp; Secretariat</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-bold">Vice-Chancellor Name</Label>
                      <Input
                        value={content.home.vcMessage.headName}
                        onChange={(e) =>
                          updateHome({
                            vcMessage: {
                              ...content.home.vcMessage!,
                              headName: e.target.value,
                            },
                          })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold">Designation &amp; Credentials</Label>
                      <Input
                        value={content.home.vcMessage.subTitle}
                        onChange={(e) =>
                          updateHome({
                            vcMessage: {
                              ...content.home.vcMessage!,
                              subTitle: e.target.value,
                            },
                          })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">Card Highlight Quote</Label>
                    <Textarea
                      value={content.home.vcMessage.shortQuote}
                      onChange={(e) =>
                        updateHome({
                          vcMessage: {
                            ...content.home.vcMessage!,
                            shortQuote: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      className="mt-1 text-xs italic"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">Full Vision Message</Label>
                    <Textarea
                      value={content.home.vcMessage.fullMessage}
                      onChange={(e) =>
                        updateHome({
                          vcMessage: {
                            ...content.home.vcMessage!,
                            fullMessage: e.target.value,
                          },
                        })
                      }
                      rows={4}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              ) : null}

              {/* Principal Message (School) */}
              {selectedWing === "school" && content.home.principalMessage ? (
                <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                  <div className="font-bold text-xs text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>Principal's Desk Message</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-bold">Principal Name</Label>
                      <Input
                        value={content.home.principalMessage.headName}
                        onChange={(e) =>
                          updateHome({
                            principalMessage: {
                              ...content.home.principalMessage!,
                              headName: e.target.value,
                            },
                          })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold">Qualifications &amp; Office</Label>
                      <Input
                        value={content.home.principalMessage.subTitle}
                        onChange={(e) =>
                          updateHome({
                            principalMessage: {
                              ...content.home.principalMessage!,
                              subTitle: e.target.value,
                            },
                          })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">Quote Highlight</Label>
                    <Textarea
                      value={content.home.principalMessage.shortQuote}
                      onChange={(e) =>
                        updateHome({
                          principalMessage: {
                            ...content.home.principalMessage!,
                            shortQuote: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      className="mt-1 text-xs italic"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">Full Address Message</Label>
                    <Textarea
                      value={content.home.principalMessage.fullMessage}
                      onChange={(e) =>
                        updateHome({
                          principalMessage: {
                            ...content.home.principalMessage!,
                            fullMessage: e.target.value,
                          },
                        })
                      }
                      rows={4}
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 2: ABOUT US PAGE CONTENT */}
        {/* ======================================================== */}
        <TabsContent value="about" className="space-y-6">
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="size-4 text-primary" />
                <span>1. Hero Header &amp; Institutional Vision</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Configure the About page header title, subtitle, vision, and mission declarations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <ImageField
                label="About Page Top Hero Banner Image"
                description="The full-width header banner photo displayed at the top of the About Us page."
                value={content.about.heroImage}
                onChange={(val) => updateAbout({ heroImage: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold">Page Header Title</Label>
                  <Input
                    value={content.about.heroTitle}
                    onChange={(e) => updateAbout({ heroTitle: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold">Page Subtitle</Label>
                  <Input
                    value={content.about.heroSubtitle}
                    onChange={(e) => updateAbout({ heroSubtitle: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-xl border bg-muted/10 space-y-2">
                  <Label className="text-xs font-bold text-primary">Vision Statement</Label>
                  <Input
                    value={content.about.visionTitle}
                    onChange={(e) => updateAbout({ visionTitle: e.target.value })}
                    placeholder="Vision Heading"
                    className="text-xs font-bold"
                  />
                  <Textarea
                    value={content.about.visionText}
                    onChange={(e) => updateAbout({ visionText: e.target.value })}
                    rows={4}
                    placeholder="Vision statement details..."
                    className="text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl border bg-muted/10 space-y-2">
                  <Label className="text-xs font-bold text-primary">Mission Statement</Label>
                  <Input
                    value={content.about.missionTitle}
                    onChange={(e) => updateAbout({ missionTitle: e.target.value })}
                    placeholder="Mission Heading"
                    className="text-xs font-bold"
                  />
                  <Textarea
                    value={content.about.missionText}
                    onChange={(e) => updateAbout({ missionText: e.target.value })}
                    rows={4}
                    placeholder="Mission statement details..."
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-muted/10 space-y-2">
                <Label className="text-xs font-bold text-foreground">Heritage &amp; History Overview</Label>
                <Input
                  value={content.about.storyTitle}
                  onChange={(e) => updateAbout({ storyTitle: e.target.value })}
                  className="text-xs font-bold"
                />
                <Textarea
                  value={content.about.storyText}
                  onChange={(e) => updateAbout({ storyText: e.target.value })}
                  rows={3}
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Historical Timeline Milestones */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  <span>2. Historical Timeline Milestones ({content.about.timeline.length} Entries)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Year-by-year chronological achievements shown in the heritage roadmap.
                </CardDescription>
              </div>
              <Button size="xs" variant="outline" onClick={addTimelineItem} className="gap-1 text-xs">
                <Plus className="size-3" /> Add Milestone
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {content.about.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 rounded-xl border bg-muted/10">
                  <div className="w-24 shrink-0">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Year</Label>
                    <Input
                      value={item.year}
                      onChange={(e) => updateTimelineItem(idx, { year: e.target.value })}
                      className="mt-0.5 text-xs font-black text-primary font-mono"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Milestone Description</Label>
                    <Input
                      value={item.event}
                      onChange={(e) => updateTimelineItem(idx, { event: e.target.value })}
                      className="mt-0.5 text-xs"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeTimelineItem(idx)}
                    className="text-destructive hover:bg-destructive/10 size-8 mt-5 shrink-0"
                    title="Delete milestone"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Former Leaders Roll of Honour */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Award className="size-4 text-primary" />
                <span>3. Former Heads &amp; Principals Roll of Honour</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Distinguished past leadership displayed in the administration history section.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {content.about.formerLeaders.map((ldr, idx) => (
                  <div key={idx} className="p-3 rounded-xl border bg-muted/10 space-y-2">
                    <div>
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Name</Label>
                      <Input
                        value={ldr.name}
                        onChange={(e) => updateLeader(idx, { name: e.target.value })}
                        className="mt-0.5 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Tenure (e.g. 1943–1948)</Label>
                      <Input
                        value={ldr.tenure}
                        onChange={(e) => updateLeader(idx, { tenure: e.target.value })}
                        className="mt-0.5 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Field / Distinction</Label>
                      <Input
                        value={ldr.field}
                        onChange={(e) => updateLeader(idx, { field: e.target.value })}
                        className="mt-0.5 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 3: ADMISSIONS PAGE CONTENT */}
        {/* ======================================================== */}
        <TabsContent value="admissions" className="space-y-6">
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <GraduationCap className="size-4 text-primary" />
                <span>1. Admissions Announcement &amp; Guidelines</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Configure key admission highlights, eligibility criteria, and deadline date.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <ImageField
                label="Admissions Page Top Hero Banner Image"
                description="The full-width header banner photo displayed at the top of the Admissions page."
                value={content.admissions.heroImage}
                onChange={(val) => updateAdmissions({ heroImage: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold">Hero Title</Label>
                  <Input
                    value={content.admissions.heroTitle}
                    onChange={(e) => updateAdmissions({ heroTitle: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold">Application Deadline</Label>
                  <Input
                    value={content.admissions.deadline}
                    onChange={(e) => updateAdmissions({ deadline: e.target.value })}
                    placeholder="e.g. 31 July 2026"
                    className="mt-1 text-xs font-bold text-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold">Call-to-Action Announcement Title</Label>
                <Input
                  value={content.admissions.bannerTitle}
                  onChange={(e) => updateAdmissions({ bannerTitle: e.target.value })}
                  className="mt-1 text-xs font-bold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold">Admissions Summary Narrative</Label>
                <Textarea
                  value={content.admissions.bannerDescription}
                  onChange={(e) => updateAdmissions({ bannerDescription: e.target.value })}
                  rows={3}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold">Eligibility Summary</Label>
                <Input
                  value={content.admissions.eligibility}
                  onChange={(e) => updateAdmissions({ eligibility: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                <Label className="text-xs font-bold text-foreground">Application Steps (Step-by-Step Guide)</Label>
                {content.admissions.steps.map((st, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="size-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <Input
                      value={st}
                      onChange={(e) => {
                        const next = [...content.admissions.steps];
                        next[i] = e.target.value;
                        updateAdmissions({ steps: next });
                      }}
                      className="text-xs flex-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 4: CONTACT US CONTENT */}
        {/* ======================================================== */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <span>1. Official Campus Contact Coordinates</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Official institution telephone numbers, email channels, and campus postal address.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <ImageField
                label="Contact Us Page Top Hero Banner Image"
                description="The full-width header banner photo displayed at the top of the Contact page."
                value={content.contact.heroImage}
                onChange={(val) => updateContact({ heroImage: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold">Primary Telephone Number</Label>
                  <Input
                    value={content.contact.phone}
                    onChange={(e) => updateContact({ phone: e.target.value })}
                    className="mt-1 text-xs font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold">Alternate Phone / Hotline</Label>
                  <Input
                    value={content.contact.altPhone}
                    onChange={(e) => updateContact({ altPhone: e.target.value })}
                    className="mt-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold">Official Email Address</Label>
                  <Input
                    value={content.contact.email}
                    onChange={(e) => updateContact({ email: e.target.value })}
                    className="mt-1 text-xs font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold">Office Working Hours</Label>
                  <Input
                    value={content.contact.officeHours}
                    onChange={(e) => updateContact({ officeHours: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                <Label className="text-xs font-bold text-foreground">Campus Postal Address</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <Label className="text-[11px] text-muted-foreground">Street / Campus Landmark</Label>
                    <Input
                      value={content.contact.address}
                      onChange={(e) => updateContact({ address: e.target.value })}
                      className="mt-0.5 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">City</Label>
                    <Input
                      value={content.contact.city}
                      onChange={(e) => updateContact({ city: e.target.value })}
                      className="mt-0.5 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">State</Label>
                    <Input
                      value={content.contact.state}
                      onChange={(e) => updateContact({ state: e.target.value })}
                      className="mt-0.5 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">PIN Code</Label>
                    <Input
                      value={content.contact.pincode}
                      onChange={(e) => updateContact({ pincode: e.target.value })}
                      className="mt-0.5 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold">Google Map Directions Query</Label>
                <Input
                  value={content.contact.mapQuery}
                  onChange={(e) => updateContact({ mapQuery: e.target.value })}
                  placeholder="e.g. Bhubaneswar, Odisha, India"
                  className="mt-1 text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
