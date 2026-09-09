import React, { useEffect, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import { usePortfolioData } from '@/hooks/use-portfolio-data';
import { useTheme } from '@/contexts/ThemeContext';
import { useStrings, Strings } from '@/i18n/strings';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'muted' | 'accent' | 'error' | 'success';
type Line = { text: string; tone?: Tone };
type HistoryEntry = { id: number; command: string | null; lines: Line[] };
type PortfolioData = typeof portfolioData;
type ProjectFile = PortfolioData['projects']['items'][number] & { slug: string };

const PROMPT = 'bruno@carvalho:~$';
const EMAIL = 'brunocarvalhs@outlook.com.br';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/!/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

// Default (pt-BR) project slugs — the fallback candidate list for
// getCompletions() when called without an explicit list (e.g. tests).
// Inside the component, the current language's project slugs are passed in
// explicitly so tab-completion matches whatever's actually on screen.
const defaultProjectFiles: ProjectFile[] = portfolioData.projects.items.map((p) => ({ ...p, slug: slugify(p.title) }));

export const COMMANDS = [
  'help', 'whoami', 'about', 'ls', 'cat', 'skills', 'contact',
  'open', 'theme', 'date', 'sudo', 'clear', 'exit', 'close',
];

/**
 * Tab-completion, bash/fish-style: completes the command name itself, or
 * (for `open`/`cat`) the argument after it, against a fixed candidate list.
 * Returns all candidates matching the relevant prefix — the caller cycles
 * through them on repeated Tab presses.
 */
export function getCompletions(
  value: string,
  projectFiles: ProjectFile[] = defaultProjectFiles,
  aboutFileName = 'sobre.md'
): { candidates: string[]; replace: (choice: string) => string } {
  const trimmedStart = value.match(/^\s*/)?.[0] ?? '';
  const [cmd, ...rest] = value.trim().split(/\s+/);
  const hasTrailingSpace = /\s$/.test(value);

  if (rest.length === 0 && !hasTrailingSpace) {
    const candidates = COMMANDS.filter((c) => c.startsWith((cmd ?? '').toLowerCase()));
    return { candidates, replace: (choice) => `${trimmedStart}${choice} ` };
  }

  const argPrefix = (rest[rest.length - 1] ?? '').toLowerCase();
  let argCandidates: string[] = [];
  if (cmd === 'open') argCandidates = ['github', 'linkedin'];
  if (cmd === 'cat') argCandidates = [aboutFileName, ...projectFiles.map((p) => `${p.slug}.md`)];

  const candidates = argCandidates.filter((c) => c.startsWith(argPrefix));
  return {
    candidates,
    replace: (choice) => `${trimmedStart}${cmd} ${[...rest.slice(0, -1), choice].join(' ')} `,
  };
}

function findSocial(hero: PortfolioData['hero'], name: string) {
  return hero.socialLinks.find((l) => l.name.toLowerCase() === name.toLowerCase());
}

function buildHelp(ts: Strings['terminal']): Line[] {
  const cmdWidth = Math.max(...ts.helpLines.map((l) => l.cmd.length)) + 2;
  const keysWidth = Math.max(...ts.helpShortcuts.map((s) => s.keys.length)) + 2;
  return [
    { text: ts.helpCommandsHeader, tone: 'accent' },
    ...ts.helpLines.map((l) => ({ text: `  ${l.cmd.padEnd(cmdWidth, ' ')}${l.desc}` })),
    { text: '' },
    { text: ts.helpShortcutsHeader, tone: 'accent' },
    ...ts.helpShortcuts.map((s) => ({ text: `  ${s.keys.padEnd(keysWidth, ' ')}${s.desc}` })),
  ];
}

function buildWhoami(hero: PortfolioData['hero']): Line[] {
  return [
    { text: hero.name, tone: 'accent' },
    { text: hero.title },
    { text: '' },
    { text: hero.description, tone: 'muted' },
  ];
}

function buildAbout(about: PortfolioData['about']): Line[] {
  return [
    { text: about.description },
    { text: '' },
    { text: about.journey.title, tone: 'accent' },
    { text: about.journey.description1, tone: 'muted' },
    { text: '' },
    { text: about.journey.description2, tone: 'muted' },
  ];
}

function buildProjectList(projectFiles: ProjectFile[], ts: Strings['terminal']): Line[] {
  return [
    { text: projectFiles.map((p) => `${p.slug}.md`).join('   '), tone: 'accent' },
    { text: '' },
    { text: ts.lsHint, tone: 'muted' },
  ];
}

function buildProject(slugArg: string, projectFiles: ProjectFile[], ts: Strings['terminal']): Line[] {
  const clean = slugArg.replace(/\.md$/i, '');
  const project = projectFiles.find((p) => p.slug === clean);
  if (!project) {
    return [
      { text: ts.catNotFound(slugArg), tone: 'error' },
      { text: ts.catHint, tone: 'muted' },
    ];
  }
  return [
    { text: `# ${project.title}`, tone: 'accent' },
    { text: '' },
    { text: project.description },
    { text: '' },
    { text: ts.projectTech(project.technologies.join(', ')) },
    { text: ts.projectGithub(project.github) },
    { text: ts.projectLive(project.live ?? ts.projectLiveUnavailable) },
  ];
}

function buildSkills(skills: PortfolioData['skills']): Line[] {
  const lines: Line[] = [];
  skills.categories.forEach((category) => {
    lines.push({ text: `## ${category.title}`, tone: 'accent' });
    [...category.skills]
      .sort((a, b) => b.level - a.level)
      .forEach((skill) => {
        const filled = Math.round(skill.level / 10);
        const bar = '█'.repeat(filled).padEnd(10, '░');
        lines.push({ text: `  ${skill.name.padEnd(22, ' ')} ${bar} ${skill.level}%` });
      });
    lines.push({ text: '' });
  });
  return lines;
}

function buildContact(hero: PortfolioData['hero'], ts: Strings['terminal']): Line[] {
  return [
    { text: `${ts.emailLabel}    ${EMAIL}` },
    ...hero.socialLinks.map((link) => ({ text: `${link.name.toLowerCase()}:${' '.repeat(Math.max(1, 10 - link.name.length))}${link.url}` })),
    { text: '' },
    { text: ts.contactHint, tone: 'muted' as Tone },
  ];
}

interface TerminalProps {
  className?: string;
  /** Custom trigger UI. Receives `onClick` to wire up; falls back to the
   * default small `bruno@carvalho:~$` prompt line when omitted. */
  trigger?: (props: { onClick: () => void }) => React.ReactNode;
}

const Terminal: React.FC<TerminalProps> = ({ className, trigger }) => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const tabStateRef = useRef<{ base: string; candidates: string[]; index: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const { theme, toggleTheme } = useTheme();
  const { hero, about, projects, skills } = usePortfolioData();
  const t = useStrings();
  const ts = t.terminal;
  const projectFiles: ProjectFile[] = projects.items.map((p) => ({ ...p, slug: slugify(p.title) }));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, open]);

  const openTerminal = () => {
    setOpen(true);
    if (entries.length === 0) {
      setEntries([
        {
          id: idRef.current++,
          command: null,
          lines: [
            { text: ts.welcome(hero.name), tone: 'accent' },
            { text: ts.typeHelpHint, tone: 'muted' },
          ],
        },
      ]);
    }
  };

  const execute = (raw: string) => {
    const trimmed = raw.trim();
    const entryId = idRef.current++;

    if (!trimmed) {
      setEntries((prev) => [...prev, { id: entryId, command: '', lines: [] }]);
      return;
    }

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(' ');
    const command = cmd.toLowerCase();

    let lines: Line[] = [];
    let clearOutput = false;
    let shouldClose = false;

    switch (command) {
      case 'help':
        lines = buildHelp(ts);
        break;
      case 'whoami':
        lines = buildWhoami(hero);
        break;
      case 'about':
        lines = buildAbout(about);
        break;
      case 'ls':
        lines = buildProjectList(projectFiles, ts);
        break;
      case 'cat':
        if (!arg) {
          lines = [{ text: ts.catUsage, tone: 'error' }];
        } else if (arg === ts.aboutFileName || arg === ts.aboutFileName.replace(/\.md$/i, '')) {
          lines = buildAbout(about);
        } else {
          lines = buildProject(arg, projectFiles, ts);
        }
        break;
      case 'skills':
        lines = buildSkills(skills);
        break;
      case 'contact':
        lines = buildContact(hero, ts);
        break;
      case 'open': {
        const target = rest[0]?.toLowerCase();
        const social = target ? findSocial(hero, target) : undefined;
        if (social) {
          window.open(social.url, '_blank', 'noopener,noreferrer');
          lines = [{ text: ts.openOpening(social.url), tone: 'success' }];
        } else {
          lines = [
            { text: ts.openUnknown(arg || ''), tone: 'error' },
            { text: ts.openHint, tone: 'muted' },
          ];
        }
        break;
      }
      case 'theme': {
        const wasLight = theme === 'light';
        toggleTheme();
        lines = [{ text: ts.themeChanged(wasLight ? ts.themeDark : ts.themeLight), tone: 'success' }];
        break;
      }
      case 'date':
        lines = [{ text: new Date().toLocaleString(ts.dateLocale, { dateStyle: 'full', timeStyle: 'short' }) }];
        break;
      case 'sudo':
        if (arg.toLowerCase() === 'hire-me') {
          lines = [
            { text: ts.sudoPassword, tone: 'muted' },
            { text: ts.sudoVerifying, tone: 'muted' },
            { text: ts.sudoHiring, tone: 'accent' },
            { text: ts.sudoCongrats, tone: 'success' },
            { text: ts.sudoEmail(EMAIL), tone: 'success' },
          ];
        } else {
          lines = [{ text: ts.sudoDenied, tone: 'error' }];
        }
        break;
      case 'clear':
        clearOutput = true;
        break;
      case 'exit':
      case 'close':
        shouldClose = true;
        lines = [{ text: ts.exitMessage, tone: 'muted' }];
        break;
      default:
        lines = [
          { text: ts.commandNotFound(command), tone: 'error' },
          { text: ts.typeHelpHint, tone: 'muted' },
        ];
    }

    if (clearOutput) {
      setEntries([]);
    } else {
      setEntries((prev) => [...prev, { id: entryId, command: trimmed, lines }]);
    }

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);

    if (shouldClose) {
      window.setTimeout(() => setOpen(false), 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+L — clear, like a real terminal (doesn't touch command history).
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      e.stopPropagation();
      setEntries([]);
      return;
    }

    // Ctrl+C — abort the current line: echo it with a `^C` marker and start fresh.
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      e.stopPropagation();
      setEntries((prev) => [...prev, { id: idRef.current++, command: `${input}^C`, lines: [] }]);
      setInput('');
      setHistoryIndex(null);
      tabStateRef.current = null;
      return;
    }

    if (e.key === 'Tab') {
      // Radix's Dialog FocusScope traps Tab for its own focus-cycling —
      // stopPropagation is required, not just preventDefault, or the
      // keydown still reaches that handler and moves focus off the input.
      e.preventDefault();
      e.stopPropagation();
      const prevTab = tabStateRef.current;
      const isContinuing = prevTab && prevTab.base === input;
      const { candidates, replace } = getCompletions(
        isContinuing ? prevTab.base : input,
        projectFiles,
        ts.aboutFileName
      );

      if (candidates.length === 0) return;

      const base = isContinuing ? prevTab.base : input;
      const index = isContinuing ? (prevTab.index + 1) % candidates.length : 0;
      tabStateRef.current = { base, candidates, index };
      setInput(replace(candidates[index]));
      return;
    }

    // Any other key resets tab-cycling, so the next Tab press starts a fresh match.
    if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Meta') {
      tabStateRef.current = null;
    }

    if (e.key === 'Enter') {
      execute(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      setHistoryIndex((prev) => {
        const next = prev === null ? commandHistory.length - 1 : Math.max(0, prev - 1);
        setInput(commandHistory[next] ?? '');
        return next;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const next = prev + 1;
        if (next >= commandHistory.length) {
          setInput('');
          return null;
        }
        setInput(commandHistory[next] ?? '');
        return next;
      });
    }
  };

  const toneClass = (tone?: Tone) => {
    switch (tone) {
      case 'accent':
        return 'text-emerald-400';
      case 'muted':
        return 'text-slate-400';
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-sky-400';
      default:
        return 'text-slate-200';
    }
  };

  return (
    <>
      {trigger ? (
        trigger({ onClick: openTerminal })
      ) : (
        <button
          type="button"
          onClick={openTerminal}
          aria-label={ts.triggerAriaLabel}
          className={cn(
            '-mx-1 -my-2 inline-flex w-fit items-center gap-1.5 rounded-md px-1 py-2 font-mono text-sm text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50 group',
            className
          )}
        >
          <span className="text-emerald-400/90">{PROMPT}</span>
          <span
            aria-hidden="true"
            className="inline-block h-4 w-[7px] translate-y-[1px] bg-slate-300 animate-caret-blink group-hover:bg-emerald-400"
          />
        </button>
      )}

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              inputRef.current?.focus();
            }}
            className="fixed left-1/2 top-1/2 z-[101] flex h-[88vh] w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-[#0b1120] shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:h-[75vh]"
          >
            <DialogPrimitive.Title className="sr-only">{ts.dialogTitle}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {ts.dialogDescription(hero.name)}
            </DialogPrimitive.Description>

            {/* Chrome */}
            <div className="flex items-center gap-2 border-b border-slate-700/50 bg-[#111827] px-4 py-3">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <p className="flex-1 text-center font-mono text-xs text-slate-400">bruno@carvalho: ~</p>
              <DialogPrimitive.Close
                aria-label={ts.closeAriaLabel}
                className="flex h-11 w-11 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-white active:bg-slate-700/70"
              >
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            {/* Body */}
            <div
              ref={scrollRef}
              onClick={() => inputRef.current?.focus()}
              className="terminal-scrollbar flex-1 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:text-sm"
            >
              {entries.map((entry) => (
                <div key={entry.id} className="mb-3">
                  {entry.command !== null && entry.command !== '' && (
                    <p className="text-slate-200">
                      <span className="text-emerald-400">{PROMPT}</span> {entry.command}
                    </p>
                  )}
                  {entry.lines.map((line, i) => (
                    <p key={i} className={cn('whitespace-pre-wrap break-words', toneClass(line.tone))}>
                      {line.text || ' '}
                    </p>
                  ))}
                </div>
              ))}

              {/* Input line */}
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label={ts.inputAriaLabel}
                  className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none [caret-color:#34d399]"
                />
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
};

export default Terminal;
