import dayjs, { type Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export type CampaignKey =
  | 'sealRock'
  | 'fieldsOfGlory'
  | 'onsalHakair'
  | 'worqorChirteh'
  | 'borderlandRuins';

export type CampaignMeta = {
  key: CampaignKey;
  image: string;
};

export type RotationEntry = {
  campaign: CampaignMeta;
  windowStart: Dayjs;
  nextReset: Dayjs;
  index: number;
};

export const resetHourUtc = 15;

export const campaigns: Record<CampaignKey, CampaignMeta> = {
  sealRock: {
    key: 'sealRock',
    image: 'campaigns/seal-rock.png',
  },
  fieldsOfGlory: {
    key: 'fieldsOfGlory',
    image: 'campaigns/fields-of-glory.png',
  },
  onsalHakair: {
    key: 'onsalHakair',
    image: 'campaigns/onsal-hakair.png',
  },
  worqorChirteh: {
    key: 'worqorChirteh',
    image: 'campaigns/worqor-chirteh.png',
  },
  borderlandRuins: {
    key: 'borderlandRuins',
    image: 'campaigns/borderland-ruins.png',
  },
};

// Patch 7.5 changed Frontline to an eight-day sequence starting at the daily reset.
export const rotation: CampaignKey[] = [
  'sealRock',
  'fieldsOfGlory',
  'onsalHakair',
  'worqorChirteh',
  'sealRock',
  'borderlandRuins',
  'onsalHakair',
  'worqorChirteh',
];

const knownResetUtc = dayjs.utc('2026-04-28T15:00:00Z');
const knownRotationIndex = rotation.indexOf('borderlandRuins');

const positiveModulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

export function getRotationWindow(input: Date | Dayjs = new Date()): RotationEntry {
  const nowUtc = dayjs(input).utc();
  const resetToday = nowUtc.hour(resetHourUtc).minute(0).second(0).millisecond(0);
  const windowStart = nowUtc.isBefore(resetToday) ? resetToday.subtract(1, 'day') : resetToday;
  const elapsedDays = windowStart.diff(knownResetUtc, 'day');
  const index = positiveModulo(knownRotationIndex + elapsedDays, rotation.length);
  const key = rotation[index];

  return {
    campaign: campaigns[key],
    windowStart,
    nextReset: windowStart.add(1, 'day'),
    index,
  };
}

export function getUpcomingRotation(input: Date | Dayjs = new Date(), days = 7): RotationEntry[] {
  const current = getRotationWindow(input);

  return Array.from({ length: days }, (_, offset) => {
    const windowStart = current.windowStart.add(offset, 'day');
    const index = positiveModulo(current.index + offset, rotation.length);
    const key = rotation[index];

    return {
      campaign: campaigns[key],
      windowStart,
      nextReset: windowStart.add(1, 'day'),
      index,
    };
  });
}
