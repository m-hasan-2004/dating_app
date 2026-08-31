/**
 * Localization Formatters (Shamsi / Jalali Dates, Units, and Values)
 */

export function formatDate(
  dateVal: string | Date | null | undefined,
  isRTL: boolean = true
): string {
  if (!dateVal) return '';

  try {
    // If it's a date string like "1995-05-21", ensure UTC or safe parsing
    let d: Date;
    if (typeof dateVal === 'string') {
      if (dateVal.includes('T')) {
        d = new Date(dateVal);
      } else {
        const parts = dateVal.split('-');
        if (parts.length === 3) {
          d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        } else {
          d = new Date(dateVal);
        }
      }
    } else {
      d = dateVal;
    }

    if (isNaN(d.getTime())) {
      return String(dateVal);
    }

    if (isRTL) {
      // Use native Persian Solar Hijri (Shamsi) calendar formatter
      return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(d);
    }
  } catch (e) {
    return String(dateVal);
  }
}

export function formatHeight(
  val: number | string | null | undefined,
  isRTL: boolean = true
): string {
  if (val === null || val === undefined || val === '') return '';
  const num = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(num)) return String(val);
  const clean = Number.isInteger(num) ? String(num) : num.toFixed(0);
  return isRTL ? `${clean} سانتی‌متر` : `${clean} cm`;
}

export function formatWeight(
  val: number | string | null | undefined,
  isRTL: boolean = true
): string {
  if (val === null || val === undefined || val === '') return '';
  const num = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(num)) return String(val);
  const clean = Number.isInteger(num) ? String(num) : num.toFixed(0);
  return isRTL ? `${clean} کیلوگرم` : `${clean} kg`;
}

export function formatBoolean(
  val: boolean | null | undefined,
  isRTL: boolean = true
): string {
  if (val === null || val === undefined) return '';
  return isRTL ? (val ? 'بله' : 'خیر') : (val ? 'Yes' : 'No');
}