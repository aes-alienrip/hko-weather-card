import {
  LitElement,
  html,
} from "https://unpkg.com/lit-element@3.2.0/lit-element.js?module";

// #### Add card info to console
console.info(
  `%cHKO-WEATHER-CARD\n%cVersion 1.1.4       `,
  "color: #043ff6; font-weight: bold; background: white",
  "color: white; font-weight: bold; background: #043ff6"
);

// #### Add to Custom-Card Picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: "hko-weather-card",
  name: "HKO Animated Weather Card",
  preview: false, // Optional - defaults to false
  description: "A custom card made by @DavidFW1960 and modified by @aes-alienrip" // Optional
});

// #####
// ##### Custom Card Definition begins
// #####

class HKOWeatherCard extends LitElement {

// #####
// ##### Define Render Template
// #####

  render() {
    if (!this.config || !this._hass) return html``;
//  Handle Configuration Flags
//    var icons = this.config.static_icons ? "static" : "animated";
    var currentText = this.config.entity_current_text ? html`<span class="currentText" id="current-text">${this._hass.states[this.config.entity_current_text] !== undefined ? this._hass.states[this.config.entity_current_text].state : "Config Error"}</span>` : ``;
    var apparentTemp = this.config.entity_apparent_temp ? html`<span class="apparent">${this.localeText.feelsLike} <span id="apparent-text">${this.currentApparent}</span>${this.getUOM("temperature")}</span>` : ``;
    var biggerIcon = this.currentConditions !== undefined ? html`<span class="icon bigger" id="icon-bigger" style="background: none, url(${this._hass.hassUrl("/local/icons/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this.currentConditions] + ".svg")}) no-repeat; background-size: contain;">${this.currentConditions}</span>` : html`<div class="eicon"><ha-icon style="top: 50%; margin: 0; -ms-transform: translateY(-50%); transform: translateY(-50%);" icon="mdi:alert"></ha-icon></div>`;
    var summary = this.config.entity_daily_summary ? html`${this._hass.states[this.config.entity_daily_summary] !== undefined ? this._hass.states[this.config.entity_daily_summary].state : "Config Error"}` : ``;
    var separator = this.config.show_separator ? html`<hr class=line>` : ``;
    var uv_alert = this.config.entity_uv_alert ? html`${this._hass.states[this.config.entity_uv_alert] !== undefined ? this._hass.states[this.config.entity_uv_alert].state : "UV: Config Error"}` : ``;
    var fire_danger = this.config.entity_fire_danger ? html`${this._hass.states[this.config.entity_fire_danger] !== undefined ? this._hass.states[this.config.entity_fire_danger].state !== "Fire Danger: unknown" ? this._hass.states[this.config.entity_fire_danger].state : "" : "Fire Danger: Config Error"}` : ``;
    var slot_section = (this.config.use_old_column_format === true) ? html`<ul class="variations-ugly"><li>${this.getSlot().l1}${this.getSlot().l2}${this.getSlot().l3}${this.getSlot().l4}${this.getSlot().l5}</li><li>${this.getSlot().r1}${this.getSlot().r2}${this.getSlot().r3}${this.getSlot().r4}${this.getSlot().r5}</li></ul>` : html`<ul class="variations"><li class="slotlist">${this.getSlot().l1}${this.getSlot().l2}${this.getSlot().l3}${this.getSlot().l4}${this.getSlot().l5}</li><li class="slotlist">${this.getSlot().r1}${this.getSlot().r2}${this.getSlot().r3}${this.getSlot().r4}${this.getSlot().r5}</li></ul>`;

// Build HTML
    return html`
      <style>
      ${this.style()}
      </style>
      <ha-card class = "card">
        <div>
          ${biggerIcon}
          <span class="temp" id="temperature-text">${this.currentTemperature}</span><span class="tempc">${this.getUOM('temperature')}</span>
          ${currentText}
          ${apparentTemp}
        </div>
        ${separator}
        <span>${slot_section}</span>
        <div class="forecast clear">
          ${this.forecast.map(daily => html`
            <div class="day fcasttooltip">
              <span class="dayname" id="fcast-date-${daily.dayIndex}">${(daily.date).toLocaleDateString(this.config.locale,{month: 'numeric', day: 'numeric'})}</span><br>
              <span class="dayname" id="fcast-weekday-${daily.dayIndex}">${(daily.date).toLocaleDateString(this.config.locale,{weekday: 'short'})}</span>
              <br>${this._hass.states[daily.condition] !== undefined 
                ? 
                  html`<i class="icon" id="fcast-icon-${daily.dayIndex}" style="background: none, url(${this._hass.hassUrl("/local/icons/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this._hass.states[daily.condition].state] + ".svg").replace("-night", "-day")}) no-repeat; background-size: contain;"></i><br>` 
                : 
                  html `<div class="eicon"><ha-icon style="top: 50%; margin: 0; -ms-transform: translateY(-50%); transform: translateY(-50%);" icon="mdi:alert"></ha-icon></div>`}
              ${this.config.old_daily_format 
                ? 
                  html`<span class="highTemp" id="fcast-high-${daily.dayIndex}">${this._hass.states[daily.temphigh] !== undefined ? Math.round(this._hass.states[daily.temphigh].state)+this.getUOM("temperature") : 'Err'}</span><br><span class="lowTemp" id="fcast-low-${daily.dayIndex}">${this._hass.states[daily.templow] !== undefined ? Math.round(this._hass.states[daily.templow].state)+this.getUOM("temperature") : 'Err'}</span>`
                : 
                  this.config.tempformat ==="highlow" 
                    ?
                      html`<span class="highTemp" id="fcast-high-${daily.dayIndex}">${this._hass.states[daily.temphigh] !== undefined ? Math.round(this._hass.states[daily.temphigh].state) : "Err"}</span> / <span class="lowTemp" id="fcast-low-${daily.dayIndex}">${this._hass.states[daily.templow] !== undefined ? Math.round(this._hass.states[daily.templow].state) : "Err"}${this.getUOM("temperature")}</span>`
                    :
                      html`<span class="lowTemp" id="fcast-low-${daily.dayIndex}">${this._hass.states[daily.templow] !== undefined ? Math.round(this._hass.states[daily.templow].state) : "Err"}</span> / <span class="highTemp" id="fcast-high-${daily.dayIndex}">${this._hass.states[daily.temphigh] !== undefined ? Math.round(this._hass.states[daily.temphigh].state) : "Err"}${this.getUOM("temperature")}</span>`}
              ${this.config.entity_pop_1 && this.config.entity_pop_2 && this.config.entity_pop_3 && this.config.entity_pop_4 && this.config.entity_pop_5 ? html`<br><span class="pop" id="fcast-pop-${daily.dayIndex}">${this._hass.states[daily.pop] ? this._hass.states[daily.pop].state : "Err"}</span>` : ``}
              ${this.config.entity_pos_1 && this.config.entity_pos_2 && this.config.entity_pos_3 && this.config.entity_pos_4 && this.config.entity_pos_5 ? html`<br><span class="pos" id="fcast-pos-${daily.dayIndex}">${this._hass.states[daily.pos] !== undefined ? this._hass.states[daily.pos].state : "Err"}</span><span class="unit">${this.getUOM('precipitation')}</span>` : ``}
              <div class="fcasttooltiptext" id="fcast-summary-${daily.dayIndex}">${ this.config.tooltips ? this._hass.states[daily.summary] !== undefined ? this._hass.states[daily.summary].state : "Config Error" : ""}</div>
            </div>`)}
          </div>
        <div class="summary clear" id="daily-summary-text">
          ${summary} ${uv_alert} ${fire_danger}
          </div>
      </ha-card>
    `;
  }


// #####
// ##### slots - returns the value to be displyed in a specific current condition slot
// #####

  getSlot() {
    return {
      'r1' : this.slotValue('r1',this.config.slot_r1),
      'r2' : this.slotValue('r2',this.config.slot_r2),
      'r3' : this.slotValue('r3',this.config.slot_r3),
      'r4' : this.slotValue('r4',this.config.slot_r4),
      'r5' : this.slotValue('r5',this.config.slot_r5),
      'l1' : this.slotValue('l1',this.config.slot_l1),
      'l2' : this.slotValue('l2',this.config.slot_l2),
      'l3' : this.slotValue('l3',this.config.slot_l3),
      'l4' : this.slotValue('l4',this.config.slot_l4),
      'l5' : this.slotValue('l5',this.config.slot_l5),
    }
  }

// #####
// ##### slots - calculates the specific slot value
// #####

  slotValue(slot,value) {
    switch (value) {
      case 'pop': return this.pop;
      case 'popforecast': return this.popforecast;
      case 'possible_today': return this.possibleToday;
      case 'possible_tomorrow': return this.possibleTomorrow;
      case 'rainfall' : return this.rainToday;
      case 'humidity': return this.humidity;
      case 'pressure': return this.pressure;
      case 'daytime_high': return this.daytimeHigh;
      case 'daytime_low': return this.daytimeLow;
      case 'temp_next': return this.tempNext;
      case 'temp_following': return this.tempFollowing;
      case 'uv_summary' : return this.uvSummary;
      case 'fire_summary' : return this.fireSummary;
      case 'wind': return this.wind;
      case 'wind_kt': return this.windKt;
      case 'visibility': return this.visibility;
      case 'sun_next': return this.sunNext;
      case 'sun_following': return this.sunFollowing;
      case 'custom1': return this.custom1;
      case 'custom2': return this.custom2;
      case 'empty': return html`&nbsp;`;
      case 'remove': return ``;
    }

    // If no value can be matched pass back a default for the slot
    switch (slot) {
      case 'l1': return this.sunNext;
      case 'l2': return this.daytimeHigh;
      case 'l3': return this.daytimeLow;
      case 'l4': return this.wind;
      case 'l5': return this.pressure;
      case 'r1': return this.sunFollowing;
      case 'r2': return this.humidity;
      case 'r3': return this.pop;
      case 'r4': return this.uvSummary;
      case 'r5': return this.fireSummary;
    }
  }

  get pop() {
    try {
      var intensity = this.config.entity_pop_intensity && !this.config.entity_pop_intensity_rate ? html`<span id="intensity-text"> - ${(Number(this._hass.states[this.config.entity_pop_intensity].state)).toLocaleString()}</span><span class="unit">${this.getUOM('precipitation')}</span>` : this.config.entity_pop_intensity_rate && !this.config.entity_pop_intensity ? html`<span id="intensity-text"> - ${(Number(this._hass.states[this.config.entity_pop_intensity_rate].state)).toLocaleString()}</span><span class="unit">${this.getUOM('intensity')}</span>` : ` Config Error`;
      if (this.config.alt_pop) {
        return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="alt-pop">${this._hass.states[this.config.alt_pop].state}</span></li>`;
      } else {
        return this.config.entity_pop ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">${this._hass.states[this.config.entity_pop] !== undefined ? Math.round(this._hass.states[this.config.entity_pop].state) : "Config Error"}</span><span class="unit">%</span><span>${intensity}</span></li>` : ``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">Config Error</span></li>`;
    }
  }

  get popforecast() {
    try {
      if (this.config.alt_pop) {
        return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="alt-pop">${this._hass.states[this.config.alt_pop].state}</span></li>`;
      } else {
        return this.config.entity_pop && this.config.entity_possible_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">${Math.round(this._hass.states[this.config.entity_pop].state)}</span><span class="unit">%</span><span> - <span id="pop-text-today">${this._hass.states[this.config.entity_possible_today].state}</span></span><span class="unit">${this.getUOM('precipitation')}</span></li>` : ``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">Config Error</span></li>`;
    }
  }

  get possibleToday() {
    try {
      return this.config.entity_possible_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span>${this.localeText.posToday} <span id="possible_today-text">${this._hass.states[this.config.entity_possible_today].state}</span><span class="unit">${this.getUOM('precipitation')}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="possible_today-text">Config Error</span></li>`;
    }
  }

  get possibleTomorrow() {
    try {
      return this.config.entity_pos_1 ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span>${this.localeText.posTomorrow} <span id="possible_tomorrow-text">${this._hass.states[this.config.entity_pos_1].state}</span><span class="unit">${this.getUOM('precipitation')}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="possible_tomorrow-text">Config Error</span></li>`;
    }
  }

  get rainToday() {
    try {
      return this.config.entity_rain_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="rain-today-text">${this._hass.states[this.config.entity_rain_today].state}</span><span class="unit">${this.getUOM('precipitation')}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="rain-today-text">Config Error</span></li>`;
    }
  }

  get humidity() {
    try {
      if (this.config.alt_humidity) {
        return html`<li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span><span id="alt-humidity">${this._hass.states[this.config.alt_humidity].state}</span></li>`;
      } else {
        return this.config.entity_humidity ? html`<li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span><span id="humidity-text">${this.currentHumidity}</span><span class="unit">%</span></li>` : ``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span><span id="humidity-text">Config Error</span></li>`;
    }
  }

  get pressure() {
    try {
      if (this.config.alt_pressure) {
        return html`<li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span><span id="alt-pressure">${this._hass.states[this.config.alt_pressure].state}</span></li>`;
      } else {
        return this.config.entity_pressure ? html`<li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span><span id="pressure-text">${this.currentPressure} </span><span class="unit">${this.config.pressure_units ? this.config.pressure_units : this.getUOM('air_pressure')}</span></li>` : ``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span><span id="pressure-text">Config Error</span></li>`;
    }
  }

  get daytimeHigh() {
    try {
      if (this.config.alt_daytime_high) {
        return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-high"></ha-icon></span><span id="alt-daytime-high">${this._hass.states[this.config.alt_daytime_high].state}</span></li>`;
      } else {
        return this.config.entity_daytime_high && this.config.show_decimals_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-high"></ha-icon></span>${this.localeText.maxToday} <span id="daytime-high-text">${(Number(this._hass.states[this.config.entity_daytime_high].state)).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</span><span>${this.getUOM('temperature')}</span></li>` : this.config.entity_daytime_high && !this.config.show_decimals_today ?html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-high"></ha-icon></span>${this.localeText.maxToday} <span id="daytime-high-text">${(Number(this._hass.states[this.config.entity_daytime_high].state).toFixed(0)).toLocaleString()}</span><span>${this.getUOM('temperature')}</span></li>` : ``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-high"></ha-icon></span><span id="daytime-high-text">Config Error</span></li>`;
    }
  }

  get daytimeLow() {
    try {
      if (this.config.alt_daytime_low) {
        return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-low"></ha-icon></span><span id="alt-daytime-low">${this._hass.states[this.config.alt_daytime_low].state}</span></li>`;
      } else {
        return this.config.entity_daytime_low && this.config.show_decimals_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-low"></ha-icon></span>${this.localeText.minToday} <span id="daytime-low-text">${(Number(this._hass.states[this.config.entity_daytime_low].state)).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</span><span>${this.getUOM('temperature')}</span></li>` : this.config.entity_daytime_low && !this.config.show_decimals_today ?html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-low"></ha-icon></span>${this.localeText.minToday} <span id="daytime-low-text">${(Number(this._hass.states[this.config.entity_daytime_low].state).toFixed(0)).toLocaleString()}</span><span> ${this.getUOM('temperature')}</span></li>` : ``;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-low"></ha-icon></span><span id="daytime-low-text">Config Error</span></li>`;
    }
  }

  get tempNext() {
    try {
      return this.config.entity_temp_next && this.config.entity_temp_next_label ? html`<li><span class="ha-icon"><ha-icon id="temp-next-icon" icon="${this.tempNextIcon}"></ha-icon></span><span id="temp-next-text">${this.tempNextText}</span><span>${this.getUOM('temperature')}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer"></ha-icon></span><span id="temp-next-text">Config Error</span></li>`;
    }
  }

  get tempNextIcon() {
    return this._hass.states[this.config.entity_temp_next_label].state.includes("Min") ? "mdi:thermometer-low" : "mdi:thermometer-high";
  }

  get tempNextText() {
    return this.config.entity_temp_next && this.config.entity_temp_next_label ? `${this._hass.states[this.config.entity_temp_next_label].state} ${this._hass.states[this.config.entity_temp_next].state}` : ``;
  }

  get tempFollowing() {
    try {
      return this.config.entity_temp_following && this.config.entity_temp_following_label ? html`<li><span class="ha-icon"><ha-icon id="temp-following-icon" icon="${this.tempFollowingIcon}"></ha-icon></span><span id="temp-following-text">${this.tempFollowingText}</span><span>${this.getUOM('temperature')}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer"></ha-icon></span><span id="temp-following-text">Config Error</span></li>`;
    }
  }

  get tempFollowingIcon() {
    return this._hass.states[this.config.entity_temp_following_label].state.includes("Min") ? "mdi:thermometer-low" : "mdi:thermometer-high";
  }

  get tempFollowingText() {
    return this.config.entity_temp_following && this.config.entity_temp_following_label ? `${this._hass.states[this.config.entity_temp_following_label].state} ${this._hass.states[this.config.entity_temp_following].state}` : ``;
  }

  get uvSummary() {
    try {
      return this.config.entity_uv_alert_summary ? html`<li><span class="ha-icon"><ha-icon icon="mdi:sun-wireless-outline"></ha-icon></span>${this.localeText.uvRating} <span id="daytime-uv-text">${this._hass.states[this.config.entity_uv_alert_summary].state}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:sun-wireless-outline"></ha-icon></span><span id="daytime-uv-text">Config Error</span></li>`;
    }
  }

  get fireSummary() {
    try {
      return this.config.entity_fire_danger_summary ? html`<li><span class="ha-icon"><ha-icon icon="mdi:fire"></ha-icon></span>${this.localeText.fireDanger} <span id="daytime-firedanger-text">${this._hass.states[this.config.entity_fire_danger_summary].state !== 'unknown' ? this._hass.states[this.config.entity_fire_danger_summary].state : 'N/A'}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:fire"></ha-icon></span><span id="daytime-firedanger-text">Config Error</span></li>`;
    }
  }

  get wind() {
    try {
      var windBearing = this.config.entity_wind_bearing ? html`<span id="wind-bearing-text">${this.currentWindBearing}</span>` : ``;
      var beaufortRating = this.config.entity_wind_speed ? html`<span id="beaufort-text">${this.currentBeaufort}</span>` : ``;
      return this.config.alt_wind ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span id="alt-wind">${this._hass.states[this.config.alt_wind].state}</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed && this.config.entity_wind_gust ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span>${beaufortRating}</span><span>${windBearing}</span><span id="wind-speed-text"> ${this.currentWindSpeed}</span><span class="unit">${this.getUOM('length')}/h</span><span id="wind-gust-text"> (Gust ${this.currentWindGust}</span><span class="unit">${this.getUOM('length')}/h)</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span>${beaufortRating}</span><span>${windBearing}</span><span id="wind-speed-text"> ${this.currentWindSpeed}</span><span class="unit"> ${this.getUOM('length')}/h</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span id="wind-error-text">Config Error</span></li>`;
    }
  }

  get windKt() {
    try {
      var windBearing = this.config.entity_wind_bearing ? html`<span id="wind-bearing-kt-text">${this.currentWindBearing}</span>` : ``;
      var beaufortRatingKt = this.config.entity_wind_speed_kt ? html`<span id="beaufort-kt-text">${this.currentBeaufortkt}</span>` : ``;
      return this.config.entity_wind_bearing && this.config.entity_wind_speed_kt && this.config.entity_wind_gust_kt ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span>${beaufortRatingKt}</span><span>${windBearing}</span><span id="wind-speed-kt-text"> ${this.currentWindSpeedKt}</span><span class="unit">kt</span><span id="wind-gust-kt-text"> (Gust ${this.currentWindGustKt}</span><span class="unit">kt)</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed_kt ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span>${beaufortRatingKt}</span><span>${windBearing}</span><span id="wind-speed-kt-text">${this.currentWindSpeedKt}</span><span class="unit">kt</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span id="wind-error-text">Config Error</span></li>`;
    }
  }

  get visibility() {
    try {
      return this.config.alt_visibility ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span><span id="alt-visibility">${this._hass.states[this.config.alt_visibility].state}</span></li>` : this.config.entity_visibility ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span><span id="visibility-text">${this.currentVisibility}</span><span class="unit"> ${this.getUOM('length')}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span><span id="visibility-text">Config Error</span></li>`;
    }
  }

  get sunNext() {
    try {
      if (this.config.alt_sun_next) {
        return html`<li><span id="alt-sun-next">${this._hass.states[this.config.alt_sun_next].state}</span></li>`;
      } else {
        return this.config.entity_sun ? this.sunSet.next : "";
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunset"></ha-icon></span><span id="sun-next-text">Config Error</span></li>`;
    }
  }

  get sunFollowing() {
    try {
      if (this.config.alt_sun_following) {
        return html`<li><span id="alt-sun-following">${this._hass.states[this.config.alt_sun_following].state}</span></li>`;
      } else {
        return this.config.entity_sun ? this.sunSet.following : "";
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunset"></ha-icon></span><span id="sun-following-text">Config Error</span></li>`;
    }
  }

  get custom1() {
    try {
      var icon = this.config.custom1_icon ? this.config.custom1_icon : 'mdi:help-box';
      var value = this.config.custom1_value ? this._hass.states[this.config.custom1_value].state : 'unknown';
      var unit = this.config.custom1_units ? this.config.custom1_units : '';
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-1-text">${value}</span><span class="unit">${unit}</span></li>`;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-1-text">Config Error</span></li>`;
    }
  }

  get custom2() {
    try {
      var icon = this.config.custom2_icon ? this.config.custom2_icon : 'mdi:help-box';
      var value = this.config.custom2_value ? this._hass.states[this.config.custom2_value].state : 'unknown';
      var unit = this.config.custom2_units ? this.config.custom2_units : '';
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-2-text">${value}</span><span class="unit">${unit}</span></li>`;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-2-text">Config Error</span></li>`;
    }
  }

// #####
// ##### windDirections - returns set of possible wind directions by specified language
// #####

  get windDirections() {
    const windDirections_en = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N'];
    const windDirections_zh = ['北','東北偏北','東北','東北偏東','東','東南偏東','東南','東南偏南','南','西南偏南','西南','西南偏西','西','西北偏西','西北','西北偏北','北'];

    switch (this.config.locale) {
      case "zh" :
        return windDirections_zh;
      default :
        return windDirections_en;
    }
  }

// #####
// ##### feelsLikeText returns set of possible "Feels Like" text by specified language
// #####

  get localeText() {
    switch (this.config.locale) {
      case "zh" :
        return {
          feelsLike: "體感",
          maxToday: "最高",
          minToday: "最低",
          Humidity: "濕度",
          uvRating: "紫外線"
        }
      default :
        return {
          feelsLike: "Feels like",
          maxToday: "Today's High",
          minToday: "Today's Low",
          posToday: "Forecast",
          posTomorrow: "Fore Tom",
          uvRating: "UV",
          fireDanger: "Fire"
        }
    }
  }

// #####
// ##### dayOrNight : returns day or night depending on the position of the sun.
// #####

  get dayOrNight() {
    const transformDayNight = { "below_horizon": "night", "above_horizon": "day", };
    return this.config.entity_sun && this._hass.states[this.config.entity_sun] !== undefined ? transformDayNight[this._hass.states[this.config.entity_sun].state] : 'day';
  }


// #####
// ##### weatherIcons: returns icon names based on current conditions text
// #####

  get weatherIcons() {
    var iconStyle = (this.config.old_icon ==="hybrid") ? `hybrid` : (this.config.old_icon ==="false") ? `false` : `true`;
    var sunny = `sunny-day`;
    var mostly_clear = `fair-${this.dayOrNight}`;
    var partlycloudy_day = `cloudy-day-3`;
    var light_showers = `fair-day-rain`;
    var showers = `rainy-3`;
    var cloudy = `cloudy`;
    var overcast = `overcast`;
    var light_rain = `rainy-4`;
    var rainy = `rainy-6`;
    var pouring = `rainy-8`;
    var lightning_rainy = `thunderstorms`;
    var clear_night = `night`;
    var partlycloudy_night = `cloudy-night-3`;
    var windy = `wind`;
    var dry = `dry`;
    var humid = `humid`;
    var fog = `fog`;
    var mist = `mist`;
    var haze = `haze`;
    var hot = `hot`;
    var warm = `warm`;
    var cool = `cool`;
    var cold = `cold`;
    var exceptional = `exceptional`;
    var partlycloudy = `cloudy-${this.dayOrNight}-3`;
    var lightning = `thunder`;
    return {
      '50': sunny,
      '51': mostly_clear,
      '52': partlycloudy,
      '53': light_showers,
      '54': showers,
      '60': cloudy,
      '61': overcast,
      '62': light_rain,
      '63': rainy,
      '64': pouring,
      '65': lightning_rainy,
      '70': clear_night,
      '71': clear_night,
      '72': clear_night,
      '73': clear_night,
      '74': clear_night,
      '75': clear_night,
      '76': partlycloudy,
      '77': mostly_clear,
      '80': windy,
      '81': dry,
      '82': humid,
      '83': fog,
      '84': mist,
      '85': haze,
      '90': hot,
      '91': warm,
      '92': cool,
      '93': cold,
      'unavailable': exceptional
    }
  }

// #####
// ##### forecast : returns forcasted weather information for the next 5 days
// ##### HKO API update forecastDate 1 to forecastDate 0 at 12:00pm so you will see today's forecast weather before 12:00pm
// #####

  get forecast() {
    var now = new Date().getHours();
    var forecastDate1 = new Date();
    var forecastDate2 = new Date();
    var forecastDate3 = new Date();
    var forecastDate4 = new Date();
    var forecastDate5 = new Date();
    if (now < 12 ) {
      forecastDate1.setDate(forecastDate1.getDate());
      forecastDate2.setDate(forecastDate2.getDate()+1);
      forecastDate3.setDate(forecastDate3.getDate()+2);
      forecastDate4.setDate(forecastDate4.getDate()+3);
      forecastDate5.setDate(forecastDate5.getDate()+4);
      }
    else {
        forecastDate1.setDate(forecastDate1.getDate()+1);
        forecastDate2.setDate(forecastDate2.getDate()+2);
        forecastDate3.setDate(forecastDate3.getDate()+3);
        forecastDate4.setDate(forecastDate4.getDate()+4);
        forecastDate5.setDate(forecastDate5.getDate()+5);
      }

    const forecast1 = { date: forecastDate1,
                      dayIndex: '1',
                      condition: this.config.entity_forecast_icon_1,
                                        temphigh:  this.config.entity_forecast_high_temp_1,
                                        templow:  this.config.entity_forecast_low_temp_1,
                                        pop: this.config.entity_pop_1,
                                        pos: this.config.entity_pos_1,
                                        summary: this.config.entity_summary_1, };
    const forecast2 = { date: forecastDate2,
                      dayIndex: '2',
                      condition: this.config.entity_forecast_icon_2,
                                        temphigh: this.config.entity_forecast_high_temp_2,
                                        templow:  this.config.entity_forecast_low_temp_2,
                                        pop: this.config.entity_pop_2,
                                        pos: this.config.entity_pos_2,
                                        summary: this.config.entity_summary_2, };
    const forecast3 = { date: forecastDate3,
                      dayIndex: '3',
                      condition: this.config.entity_forecast_icon_3,
                                        temphigh: this.config.entity_forecast_high_temp_3,
                                        templow:  this.config.entity_forecast_low_temp_3,
                                        pop: this.config.entity_pop_3,
                                        pos: this.config.entity_pos_3,
                                        summary: this.config.entity_summary_3, };
    const forecast4 = { date: forecastDate4,
                      dayIndex: '4',
                      condition: this.config.entity_forecast_icon_4,
                                        temphigh: this.config.entity_forecast_high_temp_4,
                                        templow:  this.config.entity_forecast_low_temp_4,
                                        pop: this.config.entity_pop_4,
                                        pos: this.config.entity_pos_4,
                                        summary: this.config.entity_summary_4, };
    const forecast5 = { date: forecastDate5,
                      dayIndex: '5',
                      condition: this.config.entity_forecast_icon_5,
                                        temphigh: this.config.entity_forecast_high_temp_5,
                                        templow:  this.config.entity_forecast_low_temp_5,
                                        pop: this.config.entity_pop_5,
                                        pos: this.config.entity_pos_5,
                                        summary: this.config.entity_summary_5, };

      return [forecast1, forecast2, forecast3, forecast4, forecast5];
  }


// #####
// ##### current : Returns current weather information
// #####

  get currentConditions() {
    try {
      return this._hass.states[this.config.entity_current_conditions].state;
    } catch (e) {
      return undefined;
    }
  }

  get currentHumidity() {
    return this.config.entity_humidity ? (Number(this._hass.states[this.config.entity_humidity].state)).toLocaleString() : 0;
  }

  get currentPressure() {
    var places = this.config.show_decimals_pressure ? Math.max(Math.min(this.config.show_decimals_pressure, 3) ,0) : 0;
    return this.config.entity_pressure ? (Number(this._hass.states[this.config.entity_pressure].state)).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places}) : 0;
  }

  get currentTemperature() {
    try {
      var places = this.config.show_decimals ? 1 : 0;
      return Number(this._hass.states[this.config.entity_temperature].state).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places});
    } catch (e) {
      return "Config Error";
    }
  }

  get currentVisibility() {
    return this.config.entity_visibility ? (Number(this._hass.states[this.config.entity_visibility].state)).toLocaleString() : 0;
  }

  get currentWindBearing() {
    return this.config.entity_wind_bearing ? isNaN(this._hass.states[this.config.entity_wind_bearing].state) ? this._hass.states[this.config.entity_wind_bearing].state : this.windDirections[(Math.round((this._hass.states[this.config.entity_wind_bearing].state / 360) * 16))] : 0;
  }

  get currentWindSpeed() {
    return this.config.entity_wind_speed ? Math.round(this._hass.states[this.config.entity_wind_speed].state) : 0;
  }

  get currentWindGust() {
    return this.config.entity_wind_gust ? Math.round(this._hass.states[this.config.entity_wind_gust].state) : 0;
  }

  get currentWindSpeedKt() {
    return this.config.entity_wind_speed_kt ? Math.round(this._hass.states[this.config.entity_wind_speed_kt].state) : 0;
  }

  get currentWindGustKt() {
    return this.config.entity_wind_gust_kt ? Math.round(this._hass.states[this.config.entity_wind_gust_kt].state) : 0;
  }

  get currentApparent() {
    try {
      var places = this.config.show_decimals_apparent ? 1 : 0;
      return this.config.entity_apparent_temp ? Number(this._hass.states[this.config.entity_apparent_temp].state).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places}) : 0;
    } catch (e) {
      return "Config Error";
    }
  }

  get currentBeaufort() {
    return this.config.show_beaufort ? html`Bft: ${this.beaufortWind} - ` : ``;
  }

  get currentBeaufortkt() {
    return this.config.show_beaufort ? html`Bft: ${this.beaufortWindKt} - ` : ``;
  }

  // #####
// ##### sunSetAndRise: returns set and rise information
// #####

get sunSet() {
    var sun = this._hass.states[this.config.entity_sun];
    var nextSunSet;
    var nextSunRise;
    if (this.is12Hour) {
      nextSunSet = new Date(sun.attributes.next_setting).toLocaleTimeString(this.config.locale, {hour: 'numeric', minute: '2-digit', hour12: true});
      nextSunRise = new Date(sun.attributes.next_rising).toLocaleTimeString(this.config.locale, {hour: 'numeric', minute: '2-digit', hour12: true});
    } else {
      nextSunSet = new Date(sun.attributes.next_setting).toLocaleTimeString(this.config.locale, {hour: '2-digit', minute: '2-digit', hour12: false});
      nextSunRise = new Date(sun.attributes.next_rising).toLocaleTimeString(this.config.locale, {hour: '2-digit', minute: '2-digit', hour12: false});
    }
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    if (sun.state == "above_horizon" ) {
      nextSunRise = nextDate.toLocaleDateString(this.config.locale,{weekday: 'short'}) + " " + nextSunRise;
      return {
      'next': html`<li><span class="ha-icon"><ha-icon id="sun-next-icon" icon="mdi:weather-sunset-down"></ha-icon></span><span id="sun-next-text">${nextSunSet}</span></li>`,
      'following': html`<li><span class="ha-icon"><ha-icon id="sun-following-icon" icon="mdi:weather-sunset-up"></ha-icon></span><span id="sun-following-text">${nextSunRise}</span></li>`,
      'nextText': nextSunSet,
      'followingText': nextSunRise,
      'nextIcon': "mdi:weather-sunset-down",
      'followingIcon': "mdi:weather-sunset-up",
      };
    } else {
      if (new Date().getDate() != new Date(sun.attributes.next_rising).getDate()) {
        nextSunRise = nextDate.toLocaleDateString(this.config.locale,{weekday: 'short'}) + " " + nextSunRise;
        nextSunSet = nextDate.toLocaleDateString(this.config.locale,{weekday: 'short'}) + " " + nextSunSet;
      }
      return {
      'next': html`<li><span class="ha-icon"><ha-icon id="sun-next-icon" icon="mdi:weather-sunset-up"></ha-icon></span><span id="sun-next-text">${nextSunRise}</span></li>`,
      'following': html`<li><span class="ha-icon"><ha-icon id="sun-following-icon" icon="mdi:weather-sunset-down"></ha-icon></span><span id="sun-following-text">${nextSunSet}</span></li>`,
      'nextText': nextSunRise,
      'followingText': nextSunSet,
      'nextIcon': "mdi:weather-sunset-up",
      'followingIcon': "mdi:weather-sunset-down",
      };
    }
}


// #####
// ##### beaufortWind - returns the wind speed on the beaufort scale
// ##### reference https://en.wikipedia.org/wiki/Beaufort_scale
// #####

get beaufortWind() {
  var WindSpeed = this._hass.states[this.config.entity_wind_speed].state;
  if (this.config.entity_wind_speed) {
    switch (this._hass.states[this.config.entity_wind_speed].attributes.unit_of_measurement) {
      default: // Assume km/h
        if (WindSpeed >= 118) return 12;
        if (WindSpeed >= 103) return 11;
        if (WindSpeed >= 89) return 10;
        if (WindSpeed >= 75) return 9;
        if (WindSpeed >= 62) return 8;
        if (WindSpeed >= 50) return 7;
        if (WindSpeed >= 39) return 6;
        if (WindSpeed >= 29) return 5;
        if (WindSpeed >= 20) return 4;
        if (WindSpeed >= 12) return 3;
        if (WindSpeed >= 6) return 2;
        if (WindSpeed >= 2) return 1;
    }
  }
  return 0;
}

get beaufortWindKt() {
  var WindSpeedKT = this._hass.states[this.config.entity_wind_speed_kt].state;
  if (this.config.entity_wind_speed_kt) {
      if (WindSpeedKT >= 64) return 12;
      if (WindSpeedKT >= 56) return 11;
      if (WindSpeedKT >= 48) return 10;
      if (WindSpeedKT >= 41) return 9;
      if (WindSpeedKT >= 34) return 8;
      if (WindSpeedKT >= 28) return 7;
      if (WindSpeedKT >= 22) return 6;
      if (WindSpeedKT >= 17) return 5;
      if (WindSpeedKT >= 11) return 4;
      if (WindSpeedKT >= 7) return 3;
      if (WindSpeedKT >= 4) return 2;
      if (WindSpeedKT >= 1) return 1;
  }
  return 0;
}


// #####
// ##### is12Hour - returns true if 12 hour clock or false if 24
// #####

get is12Hour() {
  var hourFormat= this.config.time_format ? this.config.time_format : 12
  switch (hourFormat) {
    case 24:
      return false;
    default:
      return true;
  }
}


// #####
// ##### style: returns the CSS style classes for the card
// ####

style() {

  // Get config flags or set defaults if not configured
  var tooltipBGColor = this.config.tooltip_bg_color || "rgb( 75,155,239)";
  var tooltipFGColor = this.config.tooltip_fg_color || "#fff";
  var tooltipBorderColor = this.config.tooltip_border_color || "rgb(255,161,0)";
  var tooltipBorderWidth = this.config.tooltip_border_width || "1";
  var tooltipCaretSize = this.config.tooltip_caret_size || "5";
  var tooltipWidth = this.config.tooltip_width || "110";
  var tooltipLeftOffset = this.config.tooltip_left_offset || "-12";
  var tooltipVisible = this.config.tooltips ? "visible" : "hidden";
  var tempTopMargin = this.config.temp_top_margin || "9px";
  var tempFontWeight = this.config.temp_font_weight || "300";
  var tempFontSize = this.config.temp_font_size || "4em";
  var tempRightPos = this.config.temp_right_pos || "0.7em";
  var tempUOMTopMargin = this.config.temp_uom_top_margin || "-3px";
  var tempUOMRightMargin = this.config.temp_uom_right_margin || "-4px";
  var apparentTopMargin = this.config.apparent_top_margin || "55px";
  var apparentRightPos =  this.config.apparent_right_pos || "0.3em";
  var apparentRightMargin = this.config.apparent_right_margin || "1em";
  var currentTextTopMargin = this.config.current_text_top_margin || "0.8em";
  var currentTextLeftPos = this.config.current_text_left_pos || "0px";
  var currentTextFontSize = this.config.current_text_font_size || "2em";
  var currentTextWidth = this.config.current_text_width || "100%";
  var currentTextAlignment = this.config.current_text_alignment || "center";
  var largeIconTopMargin = this.config.large_icon_top_margin || "-3em";
  var largeIconLeftPos = this.config.large_icon_left_pos || "0px";
  var currentDataTopMargin = this.config.current_data_top_margin ? this.config.current_data_top_margin : this.config.show_separator ? "0em" : "10em";
  var separatorTopMargin = this.config.separator_top_margin || "6em";
  var summaryTopPadding = this.config.summary_top_padding || "1em";
  var summaryFontSize = this.config.summary_font_size || "1em";

  return html`
      .clear {
        clear: both;
        line-height:1.2;
      }

      .card {
        margin: auto;
        padding-top: 2em;
        padding-bottom: 1em;
        padding-left: 1em;
        padding-right: 1em;
        position: relative;
      }

      .ha-icon {
        height: 18px;
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }

      .ha-icon2 {
        height: 50px;
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }

      .line {
        margin-top: ${separatorTopMargin};
        margin-left: 0.3em;
        margin-right: 0.3em;
      }

      .temp {
        font-weight: ${tempFontWeight};
        font-size: ${tempFontSize};
        color: var(--primary-text-color);
        position: absolute;
        right: ${tempRightPos};
        margin-top: ${tempTopMargin} !important;
      }

      .tempc {
        font-weight: ${tempFontWeight};
        font-size: 1.5em;
        vertical-align: super;
        color: var(--primary-text-color);
        position: absolute;
        right: 1em;
        margin-top: ${tempUOMTopMargin} !important;
        margin-right: ${tempUOMRightMargin} !important;
      }

      .apparent {
        color: var(--primary-text-color);
        position: absolute;
        right: ${apparentRightPos};
        margin-top: ${apparentTopMargin};
        margin-right: ${apparentRightMargin};
      }

      .currentText {
        font-size: ${currentTextFontSize};
        color: var(--secondary-text-color);
        position: absolute;
        white-space: nowrap;
        left: ${currentTextLeftPos};
        margin-top: ${currentTextTopMargin};
        text-align: ${currentTextAlignment};
        width: ${currentTextWidth};
        padding-bottom: 0.2em;
      }

      .pop {
        font-weight: 400;
        color: var(--primary-text-color);
      }

      .pos {
        font-weight: 400;
        color: var(--primary-text-color);
      }

      .variations {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        font-weight: 400;
        color: var(--primary-text-color);
        list-style: none;
        padding: 0.2em;
        margin-top: ${currentDataTopMargin};
      }

      .slotlist {
        flex-grow: 1;
      }

      .variations-ugly {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        font-weight: 400;
        color: var(--primary-text-color);
        list-style: none;
        padding: 0.2em;
        margin-top: ${currentDataTopMargin};
      }

      .unit {
        font-size: 1em;
      }

      .summary {
        font-size: ${summaryFontSize};
        padding-top: ${summaryTopPadding};
      }

      .forecast {
        width: 100%;
        margin: 0 auto;
        height: 9em;
      }

      .day {
        display: block;
        width: 20%;
        float: left;
        text-align: center;
        color: var(--primary-text-color);
        border-right: .1em solid #d9d9d9;
        line-height: 1.5;
        box-sizing: border-box;
        margin-top: 1em;
      }

      .dayname {
        text-transform: uppercase;
      }

      .forecast .day:first-child {
        margin-left: 20;
      }

      .forecast .day:nth-last-child(1) {
        border-right: none;
        margin-right: 0;
      }

      .highTemp {
        font-weight: bold;
      }

      .lowTemp {
        color: var(--secondary-text-color);
      }

      .icon.bigger {
        width: 10em;
        height: 10em;
        margin-top: ${largeIconTopMargin};
        position: absolute;
        left: ${largeIconLeftPos};
      }

      .icon {
        width: 50px;
        height: 50px;
        margin: auto;
        display: inline-block;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        text-indent: -9999px;
      }

      .eicon {
        width: 50px;
        height: 50px;
        margin: 0px;
        padding: 6px 12px 0px;
      }

      .weather {
        font-weight: 300;
        font-size: 1.5em;
        color: var(--primary-text-color);
        text-align: left;
        position: absolute;
        top: -0.5em;
        left: 6em;
        word-wrap: break-word;
        width: 30%;
      }

      .fcasttooltip {
        position: relative;
        display: inline-block;
      }

      .fcasttooltip .fcasttooltiptext {
        visibility: hidden;
        width: ${tooltipWidth}px;
        background-color: ${tooltipBGColor};
        color: ${tooltipFGColor};
        text-align: center;
        border-radius: 6px;
        border-style: solid;
        border-color: ${tooltipBorderColor};
        border-width: ${tooltipBorderWidth}px;
        padding: 5px 0;

        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        bottom: 50%;
        left: 0%;
        margin-left: ${tooltipLeftOffset}px;
      }

      .fcasttooltip .fcasttooltiptext:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -${tooltipCaretSize}px;
        border-width: ${tooltipCaretSize}px;
        border-style: solid;
        border-color: ${tooltipBorderColor} transparent transparent transparent;
      }

      .fcasttooltip:hover .fcasttooltiptext {
        visibility: ${tooltipVisible};
      }
      `
}
// #####
// ##### getUOM: gets UOM for specified measure in either metric or imperial
// #####

  getUOM(measure) {

    const lengthUnit = this._hass.config.unit_system.length;

    switch (measure) {
      case 'air_pressure':
        return this._hass.states[this.config.entity_pressure] !== undefined && this._hass.states[this.config.entity_pressure].attributes.unit_of_measurement !== undefined ? this._hass.states[this.config.entity_pressure].attributes.unit_of_measurement : lengthUnit === 'km' ? 'hPa' : 'mbar';
      case 'length':
        return lengthUnit;
      case 'precipitation':
        return lengthUnit === 'km' ? 'mm' : 'in';
      case 'intensity':
        return lengthUnit === 'km' ? 'mm/h' : 'in/h';
      default:
        return this._hass.config.unit_system[measure] || '';
    }
  }

  // Watch this._hass and this.config - with the following, any changes to these properties will call render() again
  static get properties() {
    return {
      _hass: {},
      config: {},
    };
  }

// #####
// ##### Assign the external hass object to an internal class var.
// ##### This is called everytime a state change occurs in HA
// #####

  set hass(hass) {

    var interval = this.config.refresh_interval || 30;
    var doRefresh = false;

    // Make sure hass is assigned first time.
    if (!this._initialized) {
      this._initialized= true;
      this._lastRefresh = new Date();
      doRefresh = true;
    }

    var now = new Date();

    // Check if refresh interval has been exceeded and refresh if necessary
    if (Math.round((now - this._lastRefresh)/1000) > interval ) { doRefresh = true; }

    if (doRefresh) {
      this._lastRefresh = new Date();
      this._hass = hass;
      if (this.shadowRoot) {this.updateValues();}
    }
  }

// #####
// updateValues - Updates card values as changes happen in the hass object
// #####

  updateValues() {
    const root = this.shadowRoot;
    if (root.childElementCount > 0) {

// Current Conditions
      root.getElementById("temperature-text").textContent = `${this.currentTemperature}`;
      root.getElementById("icon-bigger").textContent = `${this.currentConditions !== undefined ? this.currentConditions : "Config Error"}`;
      root.getElementById("icon-bigger").style.backgroundImage = `none, url(${this._hass.hassUrl("/local/icons/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this.currentConditions] + ".svg")})`;

// Forecast blocks
      this.forecast.forEach((daily) => {
        root.getElementById("fcast-date-" + daily.dayIndex).textContent = `${(daily.date).toLocaleDateString(this.config.locale,{month: 'numeric', day: 'numeric'})}`;
        root.getElementById("fcast-weekday-" + daily.dayIndex).textContent = `${(daily.date).toLocaleDateString(this.config.locale,{weekday: 'short'})}`;
        if (this._hass.states[daily.condition] !== undefined) {
          root.getElementById("fcast-icon-" + daily.dayIndex).style.backgroundImage = `none, url(${this._hass.hassUrl("/local/icons/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this._hass.states[daily.condition].state] + ".svg").replace("-night", "-day")})`;
        }
        root.getElementById("fcast-high-" + daily.dayIndex).textContent = `${this._hass.states[daily.temphigh] !== undefined ? Math.round(this._hass.states[daily.temphigh].state) : "Config Error"}${this.config.tempformat ? "" : this.getUOM("temperature")}`;
        root.getElementById("fcast-low-" + daily.dayIndex).textContent = `${this._hass.states[daily.templow] !== undefined ? Math.round(this._hass.states[daily.templow].state) : "Config Error"}${this.config.old_daily_format ? this.getUOM("temperature") : this.config.tempformat ? this.getUOM("temperature") : ""}`;
        if (this.config.entity_pop_1 && this.config.entity_pop_2 && this.config.entity_pop_3 && this.config.entity_pop_4 && this.config.entity_pop_5) root.getElementById("fcast-pop-" + daily.dayIndex).textContent = `${this._hass.states[daily.pop] !== undefined ? this._hass.states[daily.pop].state : "Err"}`;
        if (this.config.entity_pos_1 && this.config.entity_pos_2 && this.config.entity_pos_3 && this.config.entity_pos_4 && this.config.entity_pos_5) { root.getElementById("fcast-pos-" + daily.dayIndex).textContent = `${this._hass.states[daily.pos] !== undefined ? this._hass.states[daily.pos].state : "Err"}`}
        root.getElementById("fcast-summary-" + daily.dayIndex).textContent = `${this._hass.states[daily.summary] !== undefined ? this._hass.states[daily.summary].state : "Err"}`;
     });

// Optional Entities
      if (this.config.entity_current_text && (root.getElementById("current-text") !== null)) try { root.getElementById("current-text").textContent = `${this._hass.states[this.config.entity_current_text].state}` } catch(e) {}
      if (this.config.entity_apparent_temp && (root.getElementById("apparent-text") !== null)) try { root.getElementById("apparent-text").textContent = `${this.currentApparent}` } catch(e) {}
      if (this.config.entity_wind_bearing && !this.config.alt_wind && (root.getElementById("wind-bearing-text") !== null)) try { root.getElementById("wind-bearing-text").textContent = `${this.currentWindBearing}` } catch(e) {}
      if (this.config.entity_wind_speed && !this.config.alt_wind && (root.getElementById("wind-speed-text") !== null)) try { root.getElementById("wind-speed-text").textContent = ` ${this.currentWindSpeed}` } catch(e) {}
      if (this.config.entity_wind_gust && !this.config.alt_wind && (root.getElementById("wind-gust-text") !== null)) try { root.getElementById("wind-gust-next").textContent = ` (Gust ${this.currentWindGust}` } catch(e) {}
      if (this.config.entity_wind_bearing && !this.config.alt_wind && (root.getElementById("wind-bearing-kt-text") !== null)) try { root.getElementById("wind-bearing-kt-text").textContent = `${this.currentWindBearing}` } catch(e) {}
      if (this.config.entity_wind_speed_kt && !this.config.alt_wind && (root.getElementById("wind-speed-kt-text") !== null)) try { root.getElementById("wind-speed-kt-text").textContent = ` ${this.currentWindSpeedKt}` } catch(e) {}
      if (this.config.entity_wind_gust_kt && !this.config.alt_wind && (root.getElementById("wind-gust-kt-text") !== null)) try { root.getElementById("wind-gust-kt-text").textContent = ` (Gust ${this.currentWindGustKt}` } catch(e) {}
      if (this.config.entity_visibility && !this.config.alt_visibility && (root.getElementById("visibility-text") !== null)) try { root.getElementById("visibility-text").textContent = `${this.currentVisibility}` } catch(e) {}
      if (this.config.entity_pop_intensity && !this.config.entity_pop_intensity_rate && (root.getElementById("intensity-text") !== null)) try { root.getElementById("intensity-text").textContent = ` - ${(Number(this._hass.states[this.config.entity_pop_intensity].state)).toLocaleString()}` } catch(e) {}
      if (this.config.entity_pop_intensity_rate && !this.config.entity_pop_intensity && (root.getElementById("intensity-text") !== null)) try { root.getElementById("intensity-text").textContent = ` - ${(Number(this._hass.states[this.config.entity_pop_intensity_rate].state)).toLocaleString()}` } catch(e) {}
      if (this.config.entity_pop && !this.config.alt_pop && (root.getElementById("pop-text") !== null)) try { root.getElementById("pop-text").textContent = `${Math.round(this._hass.states[this.config.entity_pop].state)}` } catch(e) {}
      if (this.config.entity_pop && this.config.entity_possible_today && !this.config.alt_pop && (root.getElementById("pop-text-today") !== null)) try { root.getElementById("pop-text-today").textContent = `${this._hass.states[this.config.entity_possible_today].state}` } catch(e) {}
      if (this.config.entity_rain_today && (root.getElementById("rain-today-text") !== null)) try { root.getElementById("rain-today-text").textContent = `${this._hass.states[this.config.entity_rain_today].state}` } catch(e) {}
      var places = this.config.show_decimals_today ? 1 : 0;
      if (this.config.entity_daytime_high && !this.config.alt_daytime_high && (root.getElementById("daytime-high-text") !== null)) try { root.getElementById("daytime-high-text").textContent = `${Number(this._hass.states[this.config.entity_daytime_high].state).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places})}` } catch(e) {}
      if (this.config.entity_daytime_low && !this.config.alt_daytime_low && (root.getElementById("daytime-low-text") !== null)) try { root.getElementById("daytime-low-text").textContent = `${Number(this._hass.states[this.config.entity_daytime_low].state).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places})}` } catch(e) {}
      if (this.config.entity_temp_next && (root.getElementById("temp-next-text") !== null)) try { 
        root.getElementById("temp-next-text").textContent = `${this.tempNextText}`;
        root.getElementById("temp-next-icon").icon = `${this.tempNextIcon}`;
      } catch(e) {}
      if (this.config.entity_temp_following && (root.getElementById("temp-following-text") !== null)) try { 
        root.getElementById("temp-following-text").textContent = `${this.tempFollowingText}`;
        root.getElementById("temp-following-icon").icon = `${this.tempFollowingIcon}`;
      } catch(e) {}
      if (this.config.entity_sun && !this.config.alt_sun_next && (root.getElementById("sun-next-text") !== null)) try { 
        root.getElementById("sun-next-text").textContent = `${this.sunSet.nextText}`;
        root.getElementById("sun-next-icon").icon = `${this.sunSet.nextIcon}`;
      } catch(e) {}
      if (this.config.entity_sun && !this.config.alt_sun_following && (root.getElementById("sun-following-text") !== null)) try { 
        root.getElementById("sun-following-text").textContent = `${this.sunSet.followingText}`;
        root.getElementById("sun-following-icon").icon = `${this.sunSet.followingIcon}`;
      } catch(e) {}
      if (this.config.entity_daily_summary && (root.getElementById("daily-summary-text") !== null)) try {
        root.getElementById("daily-summary-text").textContent = 
          `${this._hass.states[this.config.entity_daily_summary].state} ` + 
          (this.config.entity_uv_alert ?    `${this._hass.states[this.config.entity_uv_alert].state} `    : ``) + 
          (this.config.entity_fire_danger ? `${this._hass.states[this.config.entity_fire_danger].state}` : ``)
      } catch(e) {}
      if (this.config.entity_pressure && !this.config.alt_pressure && (root.getElementById("pressure-text") !== null)) try { root.getElementById("pressure-text").textContent = `${this.currentPressure}` } catch(e) {}
      if (this.config.entity_humidity && !this.config.alt_humidity && (root.getElementById("humidity-text") !== null)) try { root.getElementById("humidity-text").textContent = `${this.currentHumidity}` } catch(e) {}
      if (this.config.show_beaufort  && !this.config.alt_wind && (root.getElementById("beaufort-km-text") !== null)) try { root.getElementById("beaufort-km-text").textContent =  `Bft: ${this.beaufortWind} - ` } catch(e) {}
      if (this.config.show_beaufort  && !this.config.alt_wind && (root.getElementById("beaufort-kt-text") !== null)) try { root.getElementById("beaufort-kt-text").textContent =  `Bft: ${this.beaufortWindKt} - ` } catch(e) {}
      if (this.config.entity_possible_today && (root.getElementById("possible_today-text") !== null)) try { root.getElementById("possible_today-text").textContent = `${this._hass.states[this.config.entity_possible_today].state}` } catch(e) {}
      if (this.config.entity_pos_1 && (root.getElementById("possible_tomorrow-text") !== null)) try { root.getElementById("possible_tomorrow-text").textContent = `${this._hass.states[this.config.entity_pos_1].state}` } catch(e) {}
      if (this.config.custom1_value && (root.getElementById("custom-1-text") !== null)) try { root.getElementById("custom-1-text").textContent = `${this._hass.states[this.config.custom1_value].state}` } catch(e) {}
      if (this.config.custom2_value && (root.getElementById("custom-2-text") !== null)) try { root.getElementById("custom-2-text").textContent = `${this._hass.states[this.config.custom2_value].state}` } catch(e) {}

// Alt Text
      if (this.config.alt_sun_next) try { root.getElementById("alt-sun-next").textContent = `${this._hass.states[this.config.alt_sun_next].state}` } catch(e) {}
      if (this.config.alt_sun_following) try { root.getElementById("alt-sun-following").textContent = `${this._hass.states[this.config.alt_sun_following].state}` } catch(e) {}
      if (this.config.alt_pop) try { root.getElementById("alt-pop").textContent = `${this._hass.states[this.config.alt_pop].state}` } catch(e) {}
      if (this.config.alt_wind) try { root.getElementById("alt-wind").textContent = `${this._hass.states[this.config.alt_wind].state}` } catch(e) {}
      if (this.config.alt_pressure) try { root.getElementById("alt-pressure").textContent = `${this._hass.states[this.config.alt_pressure].state}` } catch(e) {}
      if (this.config.alt_humidity) try { root.getElementById("alt-humidity").textContent = `${this._hass.states[this.config.alt_humidity].state}` } catch(e) {}
      if (this.config.alt_daytime_high) try { root.getElementById("alt-daytime-high").textContent = `${this._hass.states[this.config.alt_daytime_high].state}` } catch(e) {}
      if (this.config.alt_visibility) try { root.getElementById("alt-visibility").textContent = `${this._hass.states[this.config.alt_visibility].state}` } catch(e) {}
    }
  }

// #####
// ##### Assigns the configuration values to an internal class var
// ##### This is called everytime a config change is made
// #####

  setConfig(config) { this.config = config; }


// #####
// ##### Sets the card size so HA knows how to put in columns
// #####

  getCardSize() { return 3 }

}

// #####
// ##### Register the card as a customElement
// #####
customElements.define('hko-weather-card', HKOWeatherCard);
