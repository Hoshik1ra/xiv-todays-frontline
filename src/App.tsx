import { computed, defineComponent, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { CampaignCrystal } from "./components/CampaignCrystal";
import { getRotationWindow, getUpcomingRotation, rotation } from "./frontline";
import { localeOptions, type LocaleCode } from "./i18n";

const localeStorageKey = "xiv-todays-frontline-locale";

function isLocaleCode(value: string | null): value is LocaleCode {
  return localeOptions.some((option) => option.code === value);
}

function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getLocalResetDisplay(date: Date, locale: string): { time: string; zone: string } {
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  const timeZoneLabel = getLocalTimeZoneLabel(date);

  return {
    time,
    zone: locale === "zh-CN" ? timeZoneLabel.zh : timeZoneLabel.en,
  };
}

function getLocalTimeZoneLabel(date: Date): { zh: string; en: string } {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetLabel = getUtcOffsetLabel(date);
  const shortName = getShortTimeZoneName(date);

  if (timeZone === "UTC" || shortName === "UTC" || shortName === "GMT") {
    return { zh: "UTC", en: "UTC" };
  }

  if (timeZone === "Asia/Shanghai" || timeZone === "Asia/Chongqing" || timeZone === "Asia/Urumqi") {
    return { zh: "北京时间", en: offsetLabel };
  }

  if (timeZone === "Asia/Tokyo") {
    return { zh: "日本时间", en: "JST" };
  }

  if (timeZone === "America/Los_Angeles") {
    const isDaylight = shortName === "PDT";

    return {
      zh: isDaylight ? "美西夏令时" : "美西冬令时",
      en: shortName,
    };
  }

  return { zh: shortName || offsetLabel, en: shortName || offsetLabel };
}

function getShortTimeZoneName(date: Date): string {
  const part = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((item) => item.type === "timeZoneName");

  return part?.value ?? "";
}

function getUtcOffsetLabel(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }

  return `UTC${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

function getTimeLeftParts(
  target: Date,
  now: Date,
): { hours: number; minutes: number; seconds: number } {
  const remainingMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.ceil(remainingMs / 1_000);

  return {
    hours: Math.floor(totalSeconds / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default defineComponent(() => {
  const { t, locale } = useI18n();
  const now = ref(new Date());
  let timer: ReturnType<typeof setInterval> | undefined;

  const current = computed(() => getRotationWindow(now.value));
  const upcoming = computed(() => getUpcomingRotation(now.value, rotation.length));
  const currentCampaignKey = computed(() => current.value.campaign.key);
  const currentImage = computed(() => assetUrl(current.value.campaign.image));
  const timeLeft = computed(() => getTimeLeftParts(current.value.nextReset.toDate(), now.value));
  const nextResetDisplay = computed(() =>
    getLocalResetDisplay(current.value.nextReset.toDate(), locale.value),
  );
  const setLocale = (nextLocale: LocaleCode) => {
    locale.value = nextLocale;
    localStorage.setItem(localeStorageKey, nextLocale);
  };

  const formatWindowTime = (date: Date) => formatTime(date, locale.value);

  onMounted(() => {
    const storedLocale = localStorage.getItem(localeStorageKey);
    if (isLocaleCode(storedLocale)) {
      locale.value = storedLocale;
    }

    timer = setInterval(() => {
      now.value = new Date();
    }, 1_000);
  });

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  watchEffect(() => {
    document.documentElement.lang = locale.value;
    document.title = t("app.documentTitle");
  });

  return () => (
    <main class="min-h-screen text-[#f7ead1]">
      <section class="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-10">
        <div class="game-window mx-auto w-full max-w-5xl">
          <header class="game-titlebar">
            <div class="min-w-0">
              <h1>{t("app.title")}</h1>
            </div>
            <div class="title-actions">
              <div class="language-control">
                <mdui-dropdown class="language-dropdown" trigger="click" placement="bottom-end">
                  <mdui-button-icon
                    class="language-trigger"
                    variant="standard"
                    slot="trigger"
                    aria-label={t("app.language")}
                  >
                    <mdui-icon-translate></mdui-icon-translate>
                  </mdui-button-icon>
                  <mdui-menu class="language-menu" dense>
                    {localeOptions.map((option) => (
                      <mdui-menu-item
                        class="language-option"
                        value={option.code}
                        onClick={() => setLocale(option.code)}
                      >
                        <span class="language-option-content">
                          <span
                            class={
                              locale.value === option.code
                                ? "language-check language-check-visible"
                                : "language-check"
                            }
                          >
                            ✓
                          </span>
                          <span>{option.label}</span>
                        </span>
                      </mdui-menu-item>
                    ))}
                  </mdui-menu>
                </mdui-dropdown>
                <span class="language-hint">{t("app.language")}</span>
              </div>
            </div>
          </header>

          <div class="game-content">
            <section class="today-card">
              <div class="duty-card">
                <CampaignCrystal />
                <h2>{t(`campaigns.${currentCampaignKey.value}.fullName`)}</h2>
                <img
                  class="campaign-image"
                  src={currentImage.value}
                  alt={t(`campaigns.${currentCampaignKey.value}.fullName`)}
                  loading="eager"
                />
              </div>

              <div class="quick-info">
                <div class="countdown-box">
                  <span>{t("app.countdown")}</span>
                  <strong>{t("app.timeLeft", timeLeft.value)}</strong>
                </div>
              </div>

              <div class="tip-box">
                <span>{t("app.tipTitle")}</span>
                <div class="tip-lines">
                  <p>
                    {t("app.resetAtLocal", {
                      time: nextResetDisplay.value.time,
                      zone: nextResetDisplay.value.zone,
                    })}
                  </p>
                  <p>{t("app.localCalculation")}</p>
                </div>
              </div>
            </section>

            <aside class="side-panels">
              <section class="system-panel schedule-panel">
                <h3>{t("app.schedule")}</h3>
                <div class="schedule-list">
                  {upcoming.value.map((item, offset) => (
                    <article
                      class={offset === 0 ? "schedule-row schedule-row-active" : "schedule-row"}
                    >
                      <img
                        class="schedule-icon"
                        src={assetUrl("campaigns/frontline-swords.png")}
                        alt=""
                      />
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-bold text-[#f7ead1]">
                          {t(`campaigns.${item.campaign.key}.fullName`)}
                        </p>
                        <p class="truncate text-xs text-[#bdb7ac]">
                          {formatWindowTime(item.windowStart.toDate())}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
        <footer class="site-footer mx-auto w-full max-w-5xl" aria-label={t("legal.label")}>
          <p>{t("legal.line1")}</p>
          <p>{t("legal.line2")}</p>
          <p>{t("legal.copyright")}</p>
        </footer>
      </section>
    </main>
  );
});
