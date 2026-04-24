/**
 * Time conflict checks for courses with `term` and `meets` strings.
 * Empty `meets` never conflicts. See assignment for meeting string format.
 */

type CourseScheduleFields = {
  term: string;
  meets: string;
};

type TimeRange = { startMin: number; endMin: number };

type ParsedMeeting = {
  days: Set<string>;
  range: TimeRange;
};

const MEETING_LINE = /^(.+?)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/;

const timeToMinutes = (t: string): number | null => {
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
};

/** Pulls day tokens from a compact string like MWF or TuTh (spaces already removed). */
const parseDayTokens = (compact: string): string[] | null => {
  const out: string[] = [];
  let i = 0;
  while (i < compact.length) {
    const rest = compact.slice(i);
    if (rest.startsWith("Tu")) {
      out.push("Tu");
      i += 2;
      continue;
    }
    if (rest.startsWith("Th")) {
      out.push("Th");
      i += 2;
      continue;
    }
    if (rest.startsWith("Sa")) {
      out.push("Sa");
      i += 2;
      continue;
    }
    if (rest.startsWith("Su")) {
      out.push("Su");
      i += 2;
      continue;
    }
    const ch = compact[i];
    if (ch === "M" || ch === "W" || ch === "F") {
      out.push(ch);
      i += 1;
      continue;
    }
    return null;
  }
  return out;
};

const parseMeeting = (meets: string): ParsedMeeting | null => {
  const trimmed = meets.trim();
  if (!trimmed) return null;

  const m = trimmed.match(MEETING_LINE);
  if (!m) return null;

  const dayPart = m[1].replace(/\s/g, "");
  const startMin = timeToMinutes(m[2]);
  const endMin = timeToMinutes(m[3]);
  if (startMin === null || endMin === null) return null;
  if (startMin >= endMin) return null;

  const tokens = parseDayTokens(dayPart);
  if (!tokens || tokens.length === 0) return null;

  return {
    days: new Set(tokens),
    range: { startMin, endMin },
  };
};

const daySetsOverlap = (a: Set<string>, b: Set<string>): boolean => {
  for (const d of a) {
    if (b.has(d)) return true;
  }
  return false;
};

/** Half-open ranges [start, end) in minutes — adjacent slots do not overlap. */
const rangesOverlap = (a: TimeRange, b: TimeRange): boolean =>
  a.startMin < b.endMin && b.startMin < a.endMin;

const meetingsConflict = (a: ParsedMeeting, b: ParsedMeeting): boolean =>
  daySetsOverlap(a.days, b.days) && rangesOverlap(a.range, b.range);

const timeConflictBetween = (courseA: CourseScheduleFields, courseB: CourseScheduleFields): boolean => {
  if (courseA.term !== courseB.term) return false;

  const pA = parseMeeting(courseA.meets);
  const pB = parseMeeting(courseB.meets);
  if (!pA || !pB) return false;

  return meetingsConflict(pA, pB);
};

/**
 * True if `candidate` overlaps in schedule with any course in `selected`
 * (same term, shared day, overlapping times). Empty meeting strings never conflict.
 */
export const conflictsWithSelection = (
  candidate: CourseScheduleFields,
  selected: readonly CourseScheduleFields[],
): boolean => selected.some((other) => timeConflictBetween(candidate, other));
