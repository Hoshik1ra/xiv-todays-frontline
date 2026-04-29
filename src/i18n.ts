import { createI18n } from 'vue-i18n';

export const messages = {
  'zh-CN': {
    app: {
      title: '今天战场是什么',
      documentTitle: '今天战场是什么',
      schedule: '战场轮换',
      countdown: '距离切换',
      resetAtLocal: '每日 {time} 切换 （{zone}）',
      localCalculation: '时间按当前设备时区显示',
      timeLeft: '{hours}小时 {minutes}分 {seconds}秒',
      tipTitle: '提示',
      language: '语言',
    },
    campaigns: {
      sealRock: {
        fullName: '尘封秘岩（争夺战）',
      },
      fieldsOfGlory: {
        fullName: '荣誉野（碎冰战）',
      },
      onsalHakair: {
        fullName: '昂萨哈凯尔（竞争战）',
      },
      worqorChirteh: {
        fullName: '沃刻其特（演习战）',
      },
      borderlandRuins: {
        fullName: '周边遗迹群（阵地战）',
      },
    },
  },
  'en-US': {
    app: {
      title: "Today's Frontline",
      documentTitle: 'XIV Todays Frontline',
      schedule: 'Frontline Rotation',
      countdown: 'Until Reset',
      resetAtLocal: 'Resets daily at {time} {zone}',
      localCalculation: "Times use this device's local time",
      timeLeft: '{hours}h {minutes}m {seconds}s',
      tipTitle: 'Notes',
      language: 'Language',
    },
    campaigns: {
      sealRock: {
        fullName: 'Seal Rock (Seize)',
      },
      fieldsOfGlory: {
        fullName: 'The Fields of Glory (Shatter)',
      },
      onsalHakair: {
        fullName: 'Onsal Hakair (Danshig Naadam)',
      },
      worqorChirteh: {
        fullName: 'Worqor Chirteh (Triumph)',
      },
      borderlandRuins: {
        fullName: 'The Borderland Ruins (Secure)',
      },
    },
  },
} as const;

export type LocaleCode = keyof typeof messages;

export const localeOptions: Array<{ code: LocaleCode; label: string }> = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en-US', label: 'English' },
];

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages,
});
