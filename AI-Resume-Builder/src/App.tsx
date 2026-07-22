import { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export type ResumeSectionItem = {
  id: string;
  title: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  description: string;
};

export type ResumeState = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  linkedIn: string;
  github: string;
  summary: string;
  languages: string;
  hobbies: string;
  photo: string;
  education: ResumeSectionItem[];
  experience: ResumeSectionItem[];
  skills: string[];
  projects: ResumeSectionItem[];
  certifications: ResumeSectionItem[];
};

const baseState: ResumeState = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  address: '',
  linkedIn: '',
  github: '',
  summary: '',
  languages: '',
  hobbies: '',
  photo: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: []
};

const createItem = (type: string): ResumeSectionItem => ({
  id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: '',
  institution: '',
  startDate: '',
  endDate: '',
  description: ''
});

const InputRow = ({
  label,
  value,
  placeholder,
  onChange,
  type = 'text'
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <label className="space-y-2 text-sm text-slate-700">
    <span className="font-medium">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      required
    />
  </label>
);

const TextAreaRow = ({
  label,
  value,
  placeholder,
  onChange,
  rows = 4
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  rows?: number;
}) => (
  <label className="space-y-2 text-sm text-slate-700">
    <span className="font-medium">{label}</span>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
    />
  </label>
);

const SectionList = ({
  title,
  items,
  onAdd,
  onRemove,
  onChange,
  showDescription = true
}: {
  title: string;
  items: ResumeSectionItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof ResumeSectionItem, value: string) => void;
  showDescription?: boolean;
}) => (
  <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">Add and update items in this section.</p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        + Add
      </button>
    </div>

    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">{title} {index + 1}</h4>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={item.title}
              onChange={(e) => onChange(item.id, 'title', e.target.value)}
              placeholder="Title / Role"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <input
              value={item.institution}
              onChange={(e) => onChange(item.id, 'institution', e.target.value)}
              placeholder="Company / School"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={item.startDate}
              onChange={(e) => onChange(item.id, 'startDate', e.target.value)}
              placeholder="Start Date"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <input
              value={item.endDate}
              onChange={(e) => onChange(item.id, 'endDate', e.target.value)}
              placeholder="End Date"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          {showDescription && (
            <textarea
              rows={3}
              value={item.description}
              onChange={(e) => onChange(item.id, 'description', e.target.value)}
              placeholder="Description / accomplishments"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

const ListChips = ({
  items,
  onAdd,
  onRemove,
  onChange,
  placeholder,
  title
}: {
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  placeholder: string;
  title: string;
}) => (
  <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">Add custom items to this list.</p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        + Add
      </button>
    </div>
    <div className="space-y-3">
      {items.map((skill, index) => (
        <div key={`${skill}-${index}`} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
          <input
            value={skill}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
);

const App = () => {
  const [resume, setResume] = useState<ResumeState>(baseState);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const overviewRef = useRef<HTMLParagraphElement | null>(null);

  const updateItem = (
    section: 'education' | 'experience' | 'projects' | 'certifications',
    id: string,
    field: keyof ResumeSectionItem,
    value: string
  ) => {
    setResume((curr) => ({
      ...curr,
      [section]: curr[section].map((item) => (item.id === id ? { ...item, [field]: value } : item))
    }));
  };

  const addItem = (section: 'education' | 'experience' | 'projects' | 'certifications') => {
    setResume((curr) => ({ ...curr, [section]: [...curr[section], createItem(section)] }));
  };

  const removeItem = (section: 'education' | 'experience' | 'projects' | 'certifications', id: string) => {
    setResume((curr) => ({ ...curr, [section]: curr[section].filter((item) => item.id !== id) }));
  };

  const addListItem = (section: 'skills') => {
    setResume((curr) => ({ ...curr, [section]: [...curr[section], ''] }));
  };

  const removeListItem = (section: 'skills', index: number) => {
    setResume((curr) => ({
      ...curr,
      [section]: curr[section].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (section: 'skills', index: number, value: string) => {
    setResume((curr) => ({
      ...curr,
      [section]: curr[section].map((item, i) => (i === index ? value : item))
    }));
  };

  const handlePhotoUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setResume((curr) => ({ ...curr, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const clearForm = () => setResume(baseState);

  const isFormValid = useMemo(
    () => resume.fullName.trim() && resume.title.trim() && resume.email.trim() && resume.phone.trim(),
    [resume]
  );

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    const element = previewRef.current;

    // Temporarily hide the overview title so it doesn't appear in the exported PDF
    const prevDisplay = overviewRef.current?.style.display || '';
    if (overviewRef.current) overviewRef.current.style.display = 'none';

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });

    // restore overview visibility immediately after rendering
    if (overviewRef.current) overviewRef.current.style.display = prevDisplay;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // scale to fit entire canvas into one page while preserving aspect ratio
    const scale = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
    const imgWidth = canvasWidth * scale;
    const imgHeight = canvasHeight * scale;

    // center the image on the PDF page
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save('resume.pdf');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8 lg:p-12">
      <div className="mx-auto max-w-[1600px] space-y-8">
        <div className="rounded-[32px] bg-white p-6 shadow-soft transition-all sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Resume Builder</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Build a refined resume that stands out professionally</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">A smart resume creator for students and professionals with responsive preview, export, and clean page layout.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadPDF}
                disabled={!isFormValid}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Export PDF
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Print
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputRow
                  label="Full Name"
                  value={resume.fullName}
                  placeholder="Enter your name"
                  onChange={(value) => setResume((curr) => ({ ...curr, fullName: value }))}
                />
                <InputRow
                  label="Professional Title"
                  value={resume.title}
                  placeholder="e.g. Software Engineer"
                  onChange={(value) => setResume((curr) => ({ ...curr, title: value }))}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Profile Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e.target.files?.[0] ?? null)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputRow
                  label="Email"
                  value={resume.email}
                  placeholder="example@mail.com"
                  onChange={(value) => setResume((curr) => ({ ...curr, email: value }))}
                  type="email"
                />
                <InputRow
                  label="Phone Number"
                  value={resume.phone}
                  placeholder="(123) 456-7890"
                  onChange={(value) => setResume((curr) => ({ ...curr, phone: value }))}
                  type="tel"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputRow
                  label="Address"
                  value={resume.address}
                  placeholder="City, Country"
                  onChange={(value) => setResume((curr) => ({ ...curr, address: value }))}
                />
                <InputRow
                  label="LinkedIn"
                  value={resume.linkedIn}
                  placeholder="linkedin.com/in/username"
                  onChange={(value) => setResume((curr) => ({ ...curr, linkedIn: value }))}
                />
                <InputRow
                  label="GitHub"
                  value={resume.github}
                  placeholder="github.com/username"
                  onChange={(value) => setResume((curr) => ({ ...curr, github: value }))}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <TextAreaRow
                label="Career Objective"
                value={resume.summary}
                placeholder="Write a short professional summary to introduce yourself."
                onChange={(value) => setResume((curr) => ({ ...curr, summary: value }))}
                rows={6}
              />
            </div>

            <SectionList
              title="Education"
              items={resume.education}
              onAdd={() => addItem('education')}
              onRemove={(id) => removeItem('education', id)}
              onChange={(id, field, value) => updateItem('education', id, field, value)}
            />
            <SectionList
              title="Work Experience"
              items={resume.experience}
              onAdd={() => addItem('experience')}
              onRemove={(id) => removeItem('experience', id)}
              onChange={(id, field, value) => updateItem('experience', id, field, value)}
            />
            <SectionList
              title="Projects"
              items={resume.projects}
              onAdd={() => addItem('projects')}
              onRemove={(id) => removeItem('projects', id)}
              onChange={(id, field, value) => updateItem('projects', id, field, value)}
            />
            <SectionList
              title="Certifications"
              items={resume.certifications}
              onAdd={() => addItem('certifications')}
              onRemove={(id) => removeItem('certifications', id)}
              onChange={(id, field, value) => updateItem('certifications', id, field, value)}
              showDescription={false}
            />
            <ListChips
              title="Skills"
              items={resume.skills}
              onAdd={() => addListItem('skills')}
              onRemove={(index) => removeListItem('skills', index)}
              onChange={(index, value) => updateListItem('skills', index, value)}
              placeholder="Skill name"
            />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextAreaRow
                  label="Languages"
                  value={resume.languages}
                  placeholder="English, Spanish, ..."
                  onChange={(value) => setResume((curr) => ({ ...curr, languages: value }))}
                  rows={3}
                />
                <TextAreaRow
                  label="Hobbies"
                  value={resume.hobbies}
                  placeholder="Hiking, Photography, Reading..."
                  onChange={(value) => setResume((curr) => ({ ...curr, hobbies: value }))}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-5 shadow-soft xl:p-8">
            <div ref={previewRef} className="mx-auto w-full max-w-[900px] rounded-[28px] bg-white p-8 text-slate-900 shadow-none print:bg-white print:p-0">
              <div className="flex flex-col items-center gap-6 border-b border-slate-200 pb-6 print:border-b-0">
                <div className="h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
                  {resume.photo ? (
                    <img src={resume.photo} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-full bg-slate-100 text-slate-400 text-sm uppercase tracking-[0.28em]">
                      Profile
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p ref={overviewRef} className="text-sky-600 tracking-[0.28em] text-sm uppercase">Resume Overview</p>
                  <h2 className="mt-3 text-4xl font-semibold text-slate-900">{resume.fullName || 'Your Name Here'}</h2>
                  <p className="mt-2 text-lg text-slate-600">{resume.title || 'Professional Title'}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Email</p>
                    <p className="mt-2 text-sm text-slate-700">{resume.email || 'your.email@mail.com'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Phone</p>
                    <p className="mt-2 text-sm text-slate-700">{resume.phone || '(123) 456-7890'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Location</p>
                    <p className="mt-2 text-sm text-slate-700">{resume.address || 'City, Country'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Connect</p>
                    <p className="mt-2 text-sm text-slate-700">{resume.linkedIn || 'linkedin.com/in/username'}</p>
                    <p className="mt-1 text-sm text-slate-700">{resume.github || 'github.com/username'}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 pt-8 lg:grid-cols-[0.95fr_0.45fr]">
                <main className="space-y-6">
                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-xl font-semibold text-slate-900">Profile</h3>
                    <p className="mt-3 leading-7 text-slate-700">{resume.summary || 'A motivated and detail-oriented professional with a strong focus on delivering quality results, collaborating effectively, and building meaningful growth in every engagement.'}</p>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-700 grid place-items-center">
                        <span className="text-lg">•</span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Work Experience</h3>
                    </div>
                    <div className="space-y-6">
                      {resume.experience.length ? (
                        resume.experience.map((item) => (
                          <div key={item.id} className="space-y-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <h4 className="text-lg font-semibold text-slate-900">{item.title || 'Position Title'}</h4>
                              <span className="text-sm text-slate-500">{item.startDate || 'Start Date'} – {item.endDate || 'End Date'}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700">{item.institution || 'Organization / Company'}</p>
                            <p className="text-sm leading-6 text-slate-600">{item.description || 'Summarize your role, impact, and results using strong, professional language.'}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm leading-6 text-slate-600">Add work experience to present your key responsibilities and achievements clearly.</p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-900 text-white grid place-items-center">
                        <span className="text-base">E</span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Education</h3>
                    </div>
                    <div className="space-y-6">
                      {resume.education.length ? (
                        resume.education.map((item) => (
                          <div key={item.id} className="space-y-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <h4 className="text-lg font-semibold text-slate-900">{item.title || 'Degree or Program'}</h4>
                              <span className="text-sm text-slate-500">{item.startDate || 'Start Date'} – {item.endDate || 'End Date'}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700">{item.institution || 'School / University'}</p>
                            <p className="text-sm leading-6 text-slate-600">{item.description || 'Your academic focus, honors, or relevant coursework.'}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm leading-6 text-slate-600">Add education details with school, degree, and dates.</p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-700 grid place-items-center">
                        <span className="text-base">P</span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Projects</h3>
                    </div>
                    <div className="space-y-6">
                      {resume.projects.length ? (
                        resume.projects.map((item) => (
                          <div key={item.id} className="space-y-2">
                            <h4 className="text-lg font-semibold text-slate-900">{item.title || 'Project Title'}</h4>
                            <p className="text-sm font-medium text-slate-700">{item.institution || 'Role, technology, or team'}</p>
                            <p className="text-sm leading-6 text-slate-600">{item.description || 'Describe the outcome, your contributions, and the results achieved with clear metrics when possible.'}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm leading-6 text-slate-600">Add projects to showcase initiative and technical execution.</p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-900 text-white grid place-items-center">
                        <span className="text-base">C</span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Certifications</h3>
                    </div>
                    <div className="space-y-5">
                      {resume.certifications.length ? (
                        resume.certifications.map((item) => (
                          <div key={item.id} className="space-y-1">
                            <h4 className="text-lg font-semibold text-slate-900">{item.title || 'Certification Title'}</h4>
                            <p className="text-sm leading-6 text-slate-600">{item.institution || 'Issuing organization or credential ID'}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm leading-6 text-slate-600">List certifications to reinforce your professional profile.</p>
                      )}
                    </div>
                  </section>
                </main>

                <aside className="space-y-6">
                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-xl font-semibold text-slate-900">Details</h3>
                    <div className="mt-4 space-y-4 text-sm text-slate-700">
                      <div>
                        <p className="font-semibold text-slate-900">Address</p>
                        <p className="mt-1">{resume.address || '12 Market St, San Francisco, CA'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Email</p>
                        <p className="mt-1">{resume.email || 'your.email@mail.com'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Phone</p>
                        <p className="mt-1">{resume.phone || '(123) 456-7890'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">LinkedIn</p>
                        <p className="mt-1">{resume.linkedIn || 'linkedin.com/in/username'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">GitHub</p>
                        <p className="mt-1">{resume.github || 'github.com/username'}</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-xl font-semibold text-slate-900">Skills</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {resume.skills.length ? (
                        resume.skills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                            {skill || 'Skill'}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm leading-6 text-slate-600">Add skills to highlight your core strengths.</p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-xl font-semibold text-slate-900">Languages</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{resume.languages || 'English, Spanish, ...'}</p>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-xl font-semibold text-slate-900">Hobbies</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{resume.hobbies || 'Hiking, Reading, Photography'}</p>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
