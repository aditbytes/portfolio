/**
 * Identity, links and global copy.
 *
 * Every fact on this site is sourced from the April 2026 resume
 * (public/assets/resume/Aditya_Resume.pdf) or from public GitHub READMEs.
 * If you add something, keep that rule: no unverified numbers, titles or links.
 */
export const site = {
  name: 'Aditya',
  wordmark: 'ADITYA.',
  identity: 'AI/ML Engineer · Quant Researcher · Data/Systems Builder',
  shortIdentity: 'AI/ML × Quant × Systems',
  title: 'Aditya — AI/ML Engineer, Quant Researcher & Builder',
  description:
    'Aditya is a Computer Science and Data Analytics student at IIT Patna building AI/ML systems, quantitative research platforms, and production data applications.',
  location: 'Patna, Bihar, India',

  education: {
    degree: 'B.S. Computer Science & Data Analytics',
    short: 'B.S. CSDA',
    school: 'Indian Institute of Technology Patna',
    schoolShort: 'IIT Patna',
    period: '2025 – 2029',
    periodLong: 'Mar 2025 – Jun 2029',
  },

  email: 'kraditya9241@gmail.com',
  github: {
    handle: 'aditbytes',
    url: 'https://github.com/aditbytes',
  },
  // Verified: hyperlink embedded in the April 2026 resume PDF.
  linkedin: {
    handle: 'aditya-405437360',
    url: 'https://www.linkedin.com/in/aditya-405437360',
  },
  // April 2026 resume. Replace the file to update it (keep the same name).
  resumeUrl: '/assets/resume/Aditya_Resume.pdf',

  certifications: ['NISM Series VIII — Equity Derivatives Certification Examination'],
} as const;

export const navLinks = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const;
