import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, BarChart3, Clock, Eye, Image as ImageIcon, LayoutTemplate, List, MousePointerClick, Pencil, Plus, Quote, Sparkles, Trash2, Type, Upload, AlignLeft, Grid } from 'lucide-react';
import type { BlockType, DesignedPageData, PageBlock } from '../types/pageBlocks';
import { parsePageContent, plainTextToBlocks } from '../types/pageBlocks';

interface PageDesignerProps {
  value: string;
  pageTitle: string;
  apiBase: string;
  token: string;
  tenantSlug: string;
  onChange: (serializedJson: string) => void;
}

const SAMPLE_CAMPUS = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80';
const SAMPLE_LIBRARY = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80';
const SAMPLE_STUDENTS = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80';

function uid() {
  return `blk-${Math.random().toString(36).slice(2, 9)}`;
}

const TEMPLATES: { id: string; name: string; desc: string; build: (title: string) => PageBlock[] }[] = [
  {
    id: 'about-university',
    name: 'About College (University Style)',
    desc: 'Hero banner, stats strip, motto quote, history timeline, vision & mission',
    build: (title) => [
      { id: uid(), type: 'hero', title: title || 'About Our College', subtitle: 'A premier institution dedicated to academic excellence, empowering learners, research, and holistic nation-building.', image: SAMPLE_CAMPUS, buttonText: 'Explore Academics', link: '/academics/departments' },
      {
        id: uid(),
        type: 'stats',
        stats: [
          { value: '1964', label: 'Year Established' },
          { value: 'A+', label: 'NAAC Accredited' },
          { value: '5,000+', label: 'Students Enrolled' },
          { value: '18+', label: 'Academic Departments' },
        ],
      },
      { id: uid(), type: 'quote', title: 'सा विद्या या विमुक्तये', subtitle: '“Knowledge is that which liberates.” — Institutional Motto' },
      { id: uid(), type: 'image', image: SAMPLE_CAMPUS, caption: 'Main Academic Campus', align: 'right' },
      { id: uid(), type: 'heading', title: 'Heritage & Institutional Overview' },
      { id: uid(), type: 'text', text: 'Our College stands as a distinguished center of higher education committed to intellectual rigor, inclusivity, and community service. Over the decades, the institution has grown from humble beginnings into a vibrant hub of undergraduate, postgraduate, and doctoral scholarship.' },
      { id: uid(), type: 'text', text: 'With modern laboratories, a rich central library, dedicated faculty, and active student cells, we nurture confident, ethical, and future-ready graduates.' },
      {
        id: uid(),
        type: 'timeline',
        title: 'Milestones & Journey',
        timeline: [
          { year: '1964', title: 'Foundation', text: 'Established to expand access to quality higher education in the region.' },
          { year: '1999', title: 'Autonomous Recognition', text: 'Conferred autonomous status for academic innovation and curriculum leadership.' },
          { year: '2015', title: 'Center of Excellence', text: 'Upgraded infrastructure, research centers, and interdisciplinary programmes.' },
          { year: 'Present', title: 'Future-Ready Campus', text: 'NAAC A+ accredited institution advancing NEP 2020, digital learning, and global collaborations.' },
        ],
      },
      {
        id: uid(),
        type: 'cards',
        title: 'Vision, Mission & Core Pillars',
        cards: [
          { title: 'Our Vision', text: 'To foster intellectual growth, leadership, and self-reliance, molding students into progressive, responsible global citizens rooted in strong moral values.' },
          { title: 'Our Mission', text: 'To deliver inclusive, skill-oriented, and research-driven education through innovative teaching, modern facilities, and strategic collaborations.' },
          { title: 'Core Values', text: 'Academic integrity, equity, environmental stewardship, and active participation in community and nation-building.' },
        ],
      },
    ],
  },
  {
    id: 'vision-mission',
    name: 'Vision & Mission (University Style)',
    desc: 'Hero banner, motto quote, focus strip, Vision & Mission lists, and pillar cards',
    build: (title) => [
      { id: uid(), type: 'hero', title: title || 'Vision and Mission', subtitle: 'Guided by our motto of liberating knowledge, we are committed to academic excellence, inclusivity, innovation, and nation-building.', image: SAMPLE_LIBRARY, buttonText: 'About Our College', link: '/about/overview' },
      { id: uid(), type: 'quote', title: 'सा विद्या या विमुक्तये (Sa Vidya Ya Vimuktaya)', subtitle: '“Knowledge is that which liberates.” — Institutional Motto' },
      {
        id: uid(),
        type: 'stats',
        stats: [
          { value: 'Quality', label: 'Teaching & Research' },
          { value: 'Inclusive', label: 'Equitable Campus' },
          { value: 'Skill-Based', label: 'Future-Ready Courses' },
          { value: 'Global', label: 'Collaborations & Impact' },
        ],
      },
      {
        id: uid(),
        type: 'list',
        title: 'Our Vision',
        items: [
          'Holistic development of students through the promotion of quality teaching, mentorship, and interdisciplinary research.',
          'Enhancing global visibility in terms of academic quality, employability, inclusiveness, and student empowerment.',
          'Equipping and enabling learners with knowledge, confidence, and ethical values to lead a purposeful and meaningful life.',
        ],
      },
      {
        id: uid(),
        type: 'list',
        title: 'Our Mission',
        items: [
          'To strive for excellence by continuously enriching the curriculum and institutional work culture through innovative teaching, research, and extension activities.',
          'To ensure a stress-free and inclusive learning environment by providing accessible facilities and support to students from diverse backgrounds.',
          'To develop entrepreneurial skills and self-reliance among students through well-structured, skill-based, future-ready, and value-added courses.',
          'To build student capacity through hands-on experiential learning in collaboration with institutions of national and international repute.',
          'To maximize active student participation in leadership, community outreach, and nation-building initiatives.',
        ],
      },
      {
        id: uid(),
        type: 'cards',
        title: 'Core Values & Strategic Pillars',
        cards: [
          { title: 'Academic Excellence', text: 'Continuous curriculum enrichment, outcome-based education, and research rigor.', image: SAMPLE_CAMPUS },
          { title: 'Inclusiveness & Equity', text: 'A supportive, accessible, and stress-free campus welcoming learners from every background.', image: SAMPLE_LIBRARY },
          { title: 'Skill & Nation Building', text: 'Entrepreneurial mindset, industry readiness, and ethical leadership for society.', image: SAMPLE_STUDENTS },
        ],
      },
    ],
  },
  {
    id: 'administration',
    name: 'Administration (University Style)',
    desc: 'Hero banner, leadership cards, statutory bodies list, and key offices',
    build: (title) => [
      { id: uid(), type: 'hero', title: title || 'Administration', subtitle: 'Transparent governance, dedicated leadership, and efficient academic administration.', image: SAMPLE_CAMPUS, buttonText: 'Organogram', link: '/administration/organogram' },
      {
        id: uid(),
        type: 'stats',
        stats: [
          { value: 'Statutory', label: 'Senate & Syndicate' },
          { value: 'Academic', label: 'Council & Boards' },
          { value: 'Transparent', label: 'E-Governance' },
          { value: 'Student-First', label: 'Welfare & Support' },
        ],
      },
      {
        id: uid(),
        type: 'cards',
        title: 'Key Administrative Leadership',
        cards: [
          { title: 'Chancellor', text: 'Hon’ble Governor / Head of the Institution providing overarching guidance and patronage.', image: SAMPLE_CAMPUS },
          { title: 'Vice-Chancellor / Principal', text: 'Chief Executive and Academic Officer leading institutional strategy, quality, and growth.', image: SAMPLE_LIBRARY },
          { title: 'Registrar', text: 'Custodian of institutional records, statutory compliance, and general administration.', image: SAMPLE_STUDENTS },
        ],
      },
      {
        id: uid(),
        type: 'list',
        title: 'Statutory Bodies & Committees',
        items: [
          'Board of Management / Syndicate — apex executive governing body.',
          'Academic Council — oversees curricula, examinations, and academic standards.',
          'Finance Committee — manages budgeting, grants, and financial governance.',
          'Planning & Monitoring Board — steers infrastructure and strategic development.',
        ],
      },
    ],
  },
  {
    id: 'hero-overview',
    name: 'Hero Banner + Overview',
    desc: 'Top banner image with title, overview text & highlights',
    build: (title) => [
      { id: uid(), type: 'hero', title: title || 'Department & Campus Overview', subtitle: 'Excellence in higher education, research, and student development.', image: SAMPLE_CAMPUS, buttonText: 'View Notices', link: '/notices' },
      { id: uid(), type: 'heading', title: 'About This Section' },
      { id: uid(), type: 'text', text: 'Provide a clear introduction and key details for students, faculty, and visitors. You can edit any text or upload your own campus photos.' },
      { id: uid(), type: 'list', title: 'Key Highlights', items: ['Dedicated faculty and modern infrastructure', 'Student-centric academic support', 'Transparent policies and schedules'] },
    ],
  },
  {
    id: 'split-image',
    name: 'Text + Side Image',
    desc: 'Featured photo alongside structured text and bullet points',
    build: (title) => [
      { id: uid(), type: 'image', image: SAMPLE_CAMPUS, caption: title || 'Campus View', align: 'right' },
      { id: uid(), type: 'heading', title: title || 'Overview' },
      { id: uid(), type: 'text', text: 'Write your main section overview here. This layout pairs a clean photo with readable paragraphs.' },
      { id: uid(), type: 'list', title: 'Important Details', items: ['Eligibility and guidelines', 'Timings and contact office', 'Downloadable forms and circulars'] },
    ],
  },
  {
    id: 'cards-grid',
    name: 'Photo Cards Grid',
    desc: 'Showcase facilities, team members, or programmes in cards',
    build: (title) => [
      { id: uid(), type: 'heading', title: title || 'Facilities & Initiatives' },
      { id: uid(), type: 'text', text: 'Explore the key facilities, programmes, and initiatives available at Our College.' },
      {
        id: uid(),
        type: 'cards',
        title: 'Highlights',
        cards: [
          { title: 'Academic Excellence', text: 'Modern classrooms and well-equipped laboratories.', image: SAMPLE_CAMPUS },
          { title: 'Central Library', text: 'Extensive collection of books, journals, and digital resources.', image: SAMPLE_LIBRARY },
          { title: 'Student Life', text: 'Active clubs, sports, and community outreach.', image: SAMPLE_STUDENTS },
        ],
      },
    ],
  },
  {
    id: 'info-notice',
    name: 'Info & Action Button',
    desc: 'Clean informational page with guidelines and action button',
    build: (title) => [
      { id: uid(), type: 'heading', title: title || 'Guidelines & Information' },
      { id: uid(), type: 'text', text: 'Official instructions, circulars, and helpful information for students and staff.' },
      { id: uid(), type: 'list', title: 'Procedure & Checklist', items: ['Step 1: Review eligibility criteria', 'Step 2: Keep required documents ready', 'Step 3: Submit before the deadline'] },
      { id: uid(), type: 'button', buttonText: 'Contact Office', link: '/contact' },
    ],
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    desc: 'Start empty and add only the blocks you need',
    build: () => [],
  },
];

export default function PageDesigner({ value, pageTitle, apiBase, token, tenantSlug, onChange }: PageDesignerProps) {
  const [template, setTemplate] = useState<string>('custom');
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const parsed = parsePageContent(value);
    if (parsed) {
      setTemplate(parsed.template || 'custom');
      setBlocks(parsed.blocks);
    } else {
      setTemplate('custom');
      setBlocks(plainTextToBlocks(value));
    }
  }, [value]);

  function commit(nextBlocks: PageBlock[], nextTemplate = template) {
    setBlocks(nextBlocks);
    setTemplate(nextTemplate);
    const data: DesignedPageData = { version: 1, template: nextTemplate, blocks: nextBlocks };
    onChange(JSON.stringify(data));
  }

  function applyTemplate(tplId: string) {
    const tpl = TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;
    if (blocks.length > 0 && !confirm(`Replace current blocks with the "${tpl.name}" template?`)) return;
    commit(tpl.build(pageTitle), tpl.id);
  }

  function addBlock(type: BlockType) {
    const base: Record<BlockType, PageBlock> = {
      hero: { id: uid(), type: 'hero', title: pageTitle || 'Banner Title', subtitle: 'Subtitle goes here', image: SAMPLE_CAMPUS, buttonText: 'Learn More', link: '/contact' },
      heading: { id: uid(), type: 'heading', title: 'Section Heading' },
      text: { id: uid(), type: 'text', text: 'Write your paragraph content here...' },
      image: { id: uid(), type: 'image', image: SAMPLE_CAMPUS, caption: '', align: 'center' },
      list: { id: uid(), type: 'list', title: 'Key Points', items: ['First item', 'Second item'] },
      cards: { id: uid(), type: 'cards', title: 'Featured Cards', cards: [{ title: 'Card Title', text: 'Card description', image: SAMPLE_CAMPUS }] },
      stats: { id: uid(), type: 'stats', stats: [{ value: '1964', label: 'Established' }, { value: 'A+', label: 'NAAC Grade' }, { value: '5,000+', label: 'Students' }, { value: '18+', label: 'Departments' }] },
      quote: { id: uid(), type: 'quote', title: 'सा विद्या या विमुक्तये', subtitle: '“Knowledge is that which liberates.”' },
      timeline: { id: uid(), type: 'timeline', title: 'Milestones', timeline: [{ year: '1964', title: 'Foundation', text: 'Institution founded.' }] },
      button: { id: uid(), type: 'button', buttonText: 'Open Link', link: '/notices' },
    };
    commit([...blocks, base[type]]);
  }

  function updateBlock(id: string, patch: Partial<PageBlock>) {
    commit(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    commit(copy);
  }

  function removeBlock(id: string) {
    commit(blocks.filter((b) => b.id !== id));
  }

  async function handleUpload(file: File, keyId: string, onUrl: (url: string) => void) {
    setUploadError('');
    setUploadingId(keyId);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${apiBase}/upload-image/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Slug': tenantSlug,
        },
        body: fd,
      });
      if (!res.ok) throw new Error('Image upload failed');
      const data = await res.json();
      if (data?.url) onUrl(data.url);
    } catch (err: any) {
      setUploadError(err.message || 'Could not upload image');
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="page-designer">
      <div className="designer-header">
        <div>
          <span className="eyebrow">PAGE DESIGNER & TEMPLATES</span>
          <p className="designer-sub">Choose a starter template or add images, text, cards, and buttons below.</p>
        </div>
        <div className="designer-mode-tabs">
          <button type="button" className={!previewMode ? 'active' : ''} onClick={() => setPreviewMode(false)}>
            <Pencil size={14} /> Design Blocks
          </button>
          <button type="button" className={previewMode ? 'active' : ''} onClick={() => setPreviewMode(true)}>
            <Eye size={14} /> Live Preview
          </button>
        </div>
      </div>

      {!previewMode ? (
        <>
          <div className="template-picker">
            <div className="template-picker-label"><LayoutTemplate size={14} /> Default Templates</div>
            <div className="template-grid">
              {TEMPLATES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`template-card ${template === t.id ? 'selected' : ''}`}
                  onClick={() => applyTemplate(t.id)}
                >
                  <b>{t.name}</b>
                  <small>{t.desc}</small>
                </button>
              ))}
            </div>
          </div>

          {uploadError && <div className="admin-error">{uploadError}</div>}

          <div className="block-toolbar">
            <span>Add element:</span>
            <button type="button" onClick={() => addBlock('hero')}><Sparkles size={13} /> Hero</button>
            <button type="button" onClick={() => addBlock('heading')}><Type size={13} /> Heading</button>
            <button type="button" onClick={() => addBlock('text')}><AlignLeft size={13} /> Text</button>
            <button type="button" onClick={() => addBlock('image')}><ImageIcon size={13} /> Image</button>
            <button type="button" onClick={() => addBlock('list')}><List size={13} /> List</button>
            <button type="button" onClick={() => addBlock('cards')}><Grid size={13} /> Cards</button>
            <button type="button" onClick={() => addBlock('stats')}><BarChart3 size={13} /> Stats</button>
            <button type="button" onClick={() => addBlock('quote')}><Quote size={13} /> Motto/Quote</button>
            <button type="button" onClick={() => addBlock('timeline')}><Clock size={13} /> Timeline</button>
            <button type="button" onClick={() => addBlock('button')}><MousePointerClick size={13} /> Button</button>
          </div>

          <div className="blocks-list">
            {blocks.length === 0 && (
              <div className="blocks-empty">
                No blocks yet. Select a <b>Default Template</b> above or click an element button to start designing!
              </div>
            )}

            {blocks.map((blk, idx) => (
              <div className="block-item" key={blk.id}>
                <div className="block-item-head">
                  <span className="block-badge">{blk.type.toUpperCase()}</span>
                  <div className="block-controls">
                    <button type="button" onClick={() => moveBlock(idx, -1)} disabled={idx === 0} title="Move up"><ArrowUp size={13} /></button>
                    <button type="button" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} title="Move down"><ArrowDown size={13} /></button>
                    <button type="button" className="danger" onClick={() => removeBlock(blk.id)} title="Remove block"><Trash2 size={13} /></button>
                  </div>
                </div>

                {blk.type === 'hero' && (
                  <div className="block-fields">
                    <input placeholder="Banner Heading" value={blk.title || ''} onChange={(e) => updateBlock(blk.id, { title: e.target.value })} />
                    <input placeholder="Banner Subtitle" value={blk.subtitle || ''} onChange={(e) => updateBlock(blk.id, { subtitle: e.target.value })} />
                    <div className="img-upload-row">
                      <input placeholder="Image URL (or upload)" value={blk.image || ''} onChange={(e) => updateBlock(blk.id, { image: e.target.value })} />
                      <label className="upload-btn">
                        <Upload size={13} /> {uploadingId === blk.id ? 'Uploading…' : 'Upload'}
                        <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, blk.id, (url) => updateBlock(blk.id, { image: url })); }} />
                      </label>
                    </div>
                    {blk.image && <img src={blk.image} alt="Hero preview" className="block-img-preview" />}
                    <div className="two-inputs">
                      <input placeholder="Button Label (optional)" value={blk.buttonText || ''} onChange={(e) => updateBlock(blk.id, { buttonText: e.target.value })} />
                      <input placeholder="Button Link (e.g. /notices)" value={blk.link || ''} onChange={(e) => updateBlock(blk.id, { link: e.target.value })} />
                    </div>
                  </div>
                )}

                {blk.type === 'heading' && (
                  <div className="block-fields">
                    <input placeholder="Heading text" value={blk.title || ''} onChange={(e) => updateBlock(blk.id, { title: e.target.value })} />
                  </div>
                )}

                {blk.type === 'text' && (
                  <div className="block-fields">
                    <textarea rows={3} placeholder="Paragraph text..." value={blk.text || ''} onChange={(e) => updateBlock(blk.id, { text: e.target.value })} />
                  </div>
                )}

                {blk.type === 'image' && (
                  <div className="block-fields">
                    <div className="img-upload-row">
                      <input placeholder="Image URL (or upload)" value={blk.image || ''} onChange={(e) => updateBlock(blk.id, { image: e.target.value })} />
                      <label className="upload-btn">
                        <Upload size={13} /> {uploadingId === blk.id ? 'Uploading…' : 'Upload'}
                        <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, blk.id, (url) => updateBlock(blk.id, { image: url })); }} />
                      </label>
                    </div>
                    {blk.image && <img src={blk.image} alt="Preview" className="block-img-preview" />}
                    <div className="two-inputs">
                      <input placeholder="Caption (optional)" value={blk.caption || ''} onChange={(e) => updateBlock(blk.id, { caption: e.target.value })} />
                      <select value={blk.align || 'center'} onChange={(e) => updateBlock(blk.id, { align: e.target.value as any })}>
                        <option value="full">Full Width</option>
                        <option value="center">Centered</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                )}

                {blk.type === 'list' && (
                  <div className="block-fields">
                    <input placeholder="List Title" value={blk.title || ''} onChange={(e) => updateBlock(blk.id, { title: e.target.value })} />
                    <textarea
                      rows={3}
                      placeholder="One bullet point per line..."
                      value={(blk.items || []).join('\n')}
                      onChange={(e) => updateBlock(blk.id, { items: e.target.value.split('\n') })}
                    />
                  </div>
                )}

                {blk.type === 'cards' && (
                  <div className="block-fields">
                    <input placeholder="Section Title (optional)" value={blk.title || ''} onChange={(e) => updateBlock(blk.id, { title: e.target.value })} />
                    <div className="cards-editor">
                      {(blk.cards || []).map((card, cIdx) => (
                        <div className="card-edit-box" key={cIdx}>
                          <div className="card-edit-top">
                            <b>Card #{cIdx + 1}</b>
                            <button type="button" onClick={() => updateBlock(blk.id, { cards: (blk.cards || []).filter((_, i) => i !== cIdx) })}><Trash2 size={12} /></button>
                          </div>
                          <input placeholder="Card title" value={card.title} onChange={(e) => {
                            const next = [...(blk.cards || [])];
                            next[cIdx] = { ...card, title: e.target.value };
                            updateBlock(blk.id, { cards: next });
                          }} />
                          <input placeholder="Card description" value={card.text} onChange={(e) => {
                            const next = [...(blk.cards || [])];
                            next[cIdx] = { ...card, text: e.target.value };
                            updateBlock(blk.id, { cards: next });
                          }} />
                          <div className="img-upload-row">
                            <input placeholder="Card image URL" value={card.image || ''} onChange={(e) => {
                              const next = [...(blk.cards || [])];
                              next[cIdx] = { ...card, image: e.target.value };
                              updateBlock(blk.id, { cards: next });
                            }} />
                            <label className="upload-btn">
                              <Upload size={12} /> {uploadingId === `${blk.id}-${cIdx}` ? '…' : 'Upload'}
                              <input type="file" accept="image/*" hidden onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleUpload(f, `${blk.id}-${cIdx}`, (url) => {
                                  const next = [...(blk.cards || [])];
                                  next[cIdx] = { ...card, image: url };
                                  updateBlock(blk.id, { cards: next });
                                });
                              }} />
                            </label>
                          </div>
                        </div>
                      ))}
                      <button type="button" className="add-card-btn" onClick={() => updateBlock(blk.id, { cards: [...(blk.cards || []), { title: 'New Card', text: 'Description', image: SAMPLE_CAMPUS }] })}>
                        <Plus size={13} /> Add Card
                      </button>
                    </div>
                  </div>
                )}

                {blk.type === 'stats' && (
                  <div className="block-fields">
                    <div className="cards-editor">
                      {(blk.stats || []).map((st, sIdx) => (
                        <div className="two-inputs" key={sIdx}>
                          <input placeholder="Value (e.g. 1964, A+)" value={st.value} onChange={(e) => {
                            const next = [...(blk.stats || [])];
                            next[sIdx] = { ...st, value: e.target.value };
                            updateBlock(blk.id, { stats: next });
                          }} />
                          <div className="img-upload-row">
                            <input placeholder="Label (e.g. Established)" value={st.label} onChange={(e) => {
                              const next = [...(blk.stats || [])];
                              next[sIdx] = { ...st, label: e.target.value };
                              updateBlock(blk.id, { stats: next });
                            }} />
                            <button type="button" className="block-controls-del" onClick={() => updateBlock(blk.id, { stats: (blk.stats || []).filter((_, i) => i !== sIdx) })}><Trash2 size={13} /></button>
                          </div>
                        </div>
                      ))}
                      <button type="button" className="add-card-btn" onClick={() => updateBlock(blk.id, { stats: [...(blk.stats || []), { value: '100+', label: 'Stat Label' }] })}>
                        <Plus size={13} /> Add Stat
                      </button>
                    </div>
                  </div>
                )}

                {blk.type === 'quote' && (
                  <div className="block-fields">
                    <input placeholder="Motto / Quote Text" value={blk.title || ''} onChange={(e) => updateBlock(blk.id, { title: e.target.value })} />
                    <input placeholder="Translation / Attribution" value={blk.subtitle || ''} onChange={(e) => updateBlock(blk.id, { subtitle: e.target.value })} />
                  </div>
                )}

                {blk.type === 'timeline' && (
                  <div className="block-fields">
                    <input placeholder="Timeline Section Title" value={blk.title || ''} onChange={(e) => updateBlock(blk.id, { title: e.target.value })} />
                    <div className="cards-editor">
                      {(blk.timeline || []).map((tm, tIdx) => (
                        <div className="card-edit-box" key={tIdx}>
                          <div className="card-edit-top">
                            <b>Milestone #{tIdx + 1}</b>
                            <button type="button" onClick={() => updateBlock(blk.id, { timeline: (blk.timeline || []).filter((_, i) => i !== tIdx) })}><Trash2 size={12} /></button>
                          </div>
                          <div className="two-inputs">
                            <input placeholder="Year (e.g. 1964)" value={tm.year} onChange={(e) => {
                              const next = [...(blk.timeline || [])];
                              next[tIdx] = { ...tm, year: e.target.value };
                              updateBlock(blk.id, { timeline: next });
                            }} />
                            <input placeholder="Milestone Title" value={tm.title} onChange={(e) => {
                              const next = [...(blk.timeline || [])];
                              next[tIdx] = { ...tm, title: e.target.value };
                              updateBlock(blk.id, { timeline: next });
                            }} />
                          </div>
                          <input placeholder="Description" value={tm.text} onChange={(e) => {
                            const next = [...(blk.timeline || [])];
                            next[tIdx] = { ...tm, text: e.target.value };
                            updateBlock(blk.id, { timeline: next });
                          }} />
                        </div>
                      ))}
                      <button type="button" className="add-card-btn" onClick={() => updateBlock(blk.id, { timeline: [...(blk.timeline || []), { year: '2026', title: 'New Milestone', text: 'Description' }] })}>
                        <Plus size={13} /> Add Milestone
                      </button>
                    </div>
                  </div>
                )}

                {blk.type === 'button' && (
                  <div className="block-fields two-inputs">
                    <input placeholder="Button text" value={blk.buttonText || ''} onChange={(e) => updateBlock(blk.id, { buttonText: e.target.value })} />
                    <input placeholder="Link (e.g. /notices)" value={blk.link || ''} onChange={(e) => updateBlock(blk.id, { link: e.target.value })} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="designer-preview-box">
          {blocks.length === 0 ? <p className="muted">Nothing added yet.</p> : blocks.map((blk) => (
            <div className="pv-block" key={blk.id}>
              {blk.type === 'hero' && (
                <div className="pv-hero" style={{ backgroundImage: blk.image ? `linear-gradient(rgba(15,28,50,.7),rgba(15,28,50,.7)),url("${blk.image}")` : undefined }}>
                  <h3>{blk.title}</h3>
                  {blk.subtitle && <p>{blk.subtitle}</p>}
                  {blk.buttonText && <span className="pv-btn">{blk.buttonText}</span>}
                </div>
              )}
              {blk.type === 'heading' && <h4>{blk.title}</h4>}
              {blk.type === 'text' && <p>{blk.text}</p>}
              {blk.type === 'image' && blk.image && (
                <figure className={`pv-fig align-${blk.align || 'center'}`}>
                  <img src={blk.image} alt={blk.caption || 'Page image'} />
                  {blk.caption && <figcaption>{blk.caption}</figcaption>}
                </figure>
              )}
              {blk.type === 'list' && (
                <div>
                  {blk.title && <b>{blk.title}</b>}
                  <ul>{(blk.items || []).filter(Boolean).map((it, i) => <li key={i}>{it}</li>)}</ul>
                </div>
              )}
              {blk.type === 'cards' && (
                <div>
                  {blk.title && <h4>{blk.title}</h4>}
                  <div className="pv-cards">
                    {(blk.cards || []).map((c, i) => (
                      <div className="pv-card" key={i}>
                        {c.image && <img src={c.image} alt={c.title} />}
                        <b>{c.title}</b>
                        <p>{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {blk.type === 'stats' && (
                <div className="pv-stats">
                  {(blk.stats || []).map((s, i) => <div className="pv-stat" key={i}><strong>{s.value}</strong><span>{s.label}</span></div>)}
                </div>
              )}
              {blk.type === 'quote' && (
                <blockquote className="pv-quote"><strong>{blk.title}</strong>{blk.subtitle && <small>{blk.subtitle}</small>}</blockquote>
              )}
              {blk.type === 'timeline' && (
                <div>
                  {blk.title && <h4>{blk.title}</h4>}
                  <div className="pv-timeline">
                    {(blk.timeline || []).map((t, i) => <div className="pv-tl-item" key={i}><span>{t.year}</span><div><b>{t.title}</b><p>{t.text}</p></div></div>)}
                  </div>
                </div>
              )}
              {blk.type === 'button' && blk.buttonText && <span className="pv-btn">{blk.buttonText}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
