import { useEffect, useId, useMemo, useRef, useState } from 'react';
import MaterialIcon from './MaterialIcon';
import { addDaysISO, todayISO } from '../../utils/bookingsStorage';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISO(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(iso) {
  const date = parseISO(iso);
  if (!date) return 'Select';
  return date.toLocaleDateString('en-AE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBeforeDay(a, b) {
  const aa = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return aa < bb;
}

function isInRange(day, start, end) {
  if (!start || !end) return false;
  const t = day.getTime();
  const a = Math.min(start.getTime(), end.getTime());
  const b = Math.max(start.getTime(), end.getTime());
  return t > a && t < b;
}

function dayOverlapsConflicts(iso, conflicts = []) {
  return conflicts.some((c) => iso >= c.pickupDate && iso <= c.returnDate);
}

function buildMonthGrid(viewMonth) {
  const first = startOfMonth(viewMonth);
  const startPad = first.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startPad; i += 1) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

/**
 * Custom pickup → return date range picker.
 * @param {{
 *   startDate: string,
 *   endDate: string,
 *   onChange: (next: { startDate: string, endDate: string }) => void,
 *   minDate?: string,
 *   conflicts?: { pickupDate: string, returnDate: string }[],
 *   label?: string,
 *   variant?: 'booking' | 'hero',
 *   error?: boolean,
 * }} props
 */
export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  conflicts = [],
  label = 'Rental dates',
  variant = 'booking',
  error = false,
}) {
  const id = useId();
  const rootRef = useRef(null);
  const min = minDate || todayISO();
  const minDay = parseISO(min);

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => parseISO(startDate) || new Date());
  const [draftStart, setDraftStart] = useState(startDate || '');
  const [draftEnd, setDraftEnd] = useState(endDate || '');
  const [hoverISO, setHoverISO] = useState('');

  useEffect(() => {
    if (!open) {
      setDraftStart(startDate || '');
      setDraftEnd(endDate || '');
    }
  }, [startDate, endDate, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const start = parseISO(draftStart);
  const end = parseISO(draftEnd);
  const hover = parseISO(hoverISO);
  const previewEnd =
    start && !end && hover && !isBeforeDay(hover, start) ? hover : end;

  const nights =
    draftStart && draftEnd
      ? Math.max(
          1,
          Math.round(
            (parseISO(draftEnd).getTime() - parseISO(draftStart).getTime()) / 86400000,
          ),
        )
      : 0;

  const selectDay = (day) => {
    if (!day) return;
    const iso = toISO(day);
    if (minDay && isBeforeDay(day, minDay)) return;
    if (dayOverlapsConflicts(iso, conflicts)) return;

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(iso);
      setDraftEnd('');
      setHoverISO('');
      return;
    }

    if (isBeforeDay(day, start)) {
      setDraftStart(iso);
      setDraftEnd('');
      return;
    }

    // Reject ranges that cover a conflict
    const spansConflict = conflicts.some(
      (c) => c.pickupDate <= iso && c.returnDate >= draftStart,
    );
    if (spansConflict) return;

    setDraftEnd(iso);
    onChange({ startDate: draftStart, endDate: iso });
    setOpen(false);
  };

  const applyQuick = (days) => {
    const startISO = min;
    const endISO = addDaysISO(startISO, days);
    setDraftStart(startISO);
    setDraftEnd(endISO);
    onChange({ startDate: startISO, endDate: endISO });
    setViewMonth(parseISO(startISO));
    setOpen(false);
  };

  const clearDates = () => {
    setDraftStart('');
    setDraftEnd('');
    onChange({ startDate: '', endDate: '' });
  };

  return (
    <div
      className={`gre-cal gre-cal--${variant} ${open ? 'is-open' : ''} ${error ? 'is-error' : ''}`}
      ref={rootRef}
    >
      {variant === 'booking' && (
        <span className="gre-cal__field-label" id={`${id}-label`}>
          {label}
        </span>
      )}

      <button
        type="button"
        className="gre-cal__trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-labelledby={variant === 'booking' ? `${id}-label` : undefined}
        onClick={() => {
          setOpen((v) => !v);
          setViewMonth(parseISO(startDate) || parseISO(min) || new Date());
        }}
      >
        <span className="gre-cal__trigger-icon" aria-hidden>
          <MaterialIcon name="calendar_month" />
        </span>
        <span className="gre-cal__trigger-dates">
          <span className="gre-cal__trigger-col">
            <span className="gre-cal__trigger-kicker">Pickup</span>
            <span className={`gre-cal__trigger-value ${startDate ? '' : 'is-empty'}`}>
              {formatDisplay(startDate)}
            </span>
          </span>
          <span className="gre-cal__trigger-arrow" aria-hidden>
            <MaterialIcon name="arrow_forward" />
          </span>
          <span className="gre-cal__trigger-col">
            <span className="gre-cal__trigger-kicker">Return</span>
            <span className={`gre-cal__trigger-value ${endDate ? '' : 'is-empty'}`}>
              {formatDisplay(endDate)}
            </span>
          </span>
        </span>
        {nights > 0 && (
          <span className="gre-cal__nights">
            {nights} {nights === 1 ? 'day' : 'days'}
          </span>
        )}
      </button>

      {open && (
        <div className="gre-cal__popover" role="dialog" aria-label="Choose rental dates">
          <div className="gre-cal__popover-head">
            <div>
              <p className="gre-cal__popover-title">Select dates</p>
              <p className="gre-cal__popover-hint">
                {draftStart && !draftEnd
                  ? 'Now choose your return day'
                  : 'Tap pickup, then return'}
              </p>
            </div>
            <button
              type="button"
              className="gre-cal__icon-btn"
              aria-label="Close calendar"
              onClick={() => setOpen(false)}
            >
              <MaterialIcon name="close" />
            </button>
          </div>

          <div className="gre-cal__month-nav">
            <button
              type="button"
              className="gre-cal__icon-btn"
              aria-label="Previous month"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
            >
              <MaterialIcon name="chevron_left" />
            </button>
            <p className="gre-cal__month-label">
              {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </p>
            <button
              type="button"
              className="gre-cal__icon-btn"
              aria-label="Next month"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
            >
              <MaterialIcon name="chevron_right" />
            </button>
          </div>

          <div className="gre-cal__weekdays">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="gre-cal__grid">
            {cells.map((day, index) => {
              if (!day) {
                return <span key={`e-${index}`} className="gre-cal__day is-empty" />;
              }
              const iso = toISO(day);
              const disabled =
                (minDay && isBeforeDay(day, minDay)) || dayOverlapsConflicts(iso, conflicts);
              const isStart = start && isSameDay(day, start);
              const isEnd = previewEnd && isSameDay(day, previewEnd);
              const inRange = start && previewEnd && isInRange(day, start, previewEnd);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  className={[
                    'gre-cal__day',
                    disabled ? 'is-disabled' : '',
                    isStart || isEnd ? 'is-edge' : '',
                    isStart ? 'is-start' : '',
                    isEnd ? 'is-end' : '',
                    inRange ? 'is-in-range' : '',
                    isToday ? 'is-today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => selectDay(day)}
                  onMouseEnter={() => {
                    if (draftStart && !draftEnd) setHoverISO(iso);
                  }}
                  onMouseLeave={() => setHoverISO('')}
                >
                  <span>{day.getDate()}</span>
                </button>
              );
            })}
          </div>

          <div className="gre-cal__footer">
            <div className="gre-cal__quick">
              <button type="button" onClick={() => applyQuick(1)}>
                1 day
              </button>
              <button type="button" onClick={() => applyQuick(3)}>
                3 days
              </button>
              <button type="button" onClick={() => applyQuick(7)}>
                1 week
              </button>
            </div>
            <button type="button" className="gre-cal__clear" onClick={clearDates}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
