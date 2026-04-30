import { defineVaporComponent } from "vue";

export const CampaignCrystal = defineVaporComponent(() => (
  <div class="campaign-crystal" aria-hidden="true">
    <img src={`${import.meta.env.BASE_URL}campaigns/frontline-swords.png`} alt="" />
  </div>
));
