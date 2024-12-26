import {
  LitElement,
  html,
  css
} from "https://esm.run/lit-element@4.0.6/lit-element.js?module";

// #### Add card info to console
console.info(
  `%cHKO-WEATHER-CARD\n%cVersion 1.2.1b Legacy`,
  "color: #043ff6; font-weight: bold; background: white",
  "color: white; font-weight: bold; background: #043ff6"
);

// #### Add to Custom-Card Picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: "hko-weather-card",
  name: "HKO Weather Card",
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
    var currentText = this.currentConditions !== undefined ? html`<span class="currentText" id="current-text">${this.currentCaption}</span>` : ``;
    var apparentTemp = this.config.entity_apparent_temp ? html`${this.localeText.feelsLike} <span id="apparent-text">${this.currentApparent}</span>°C` : ``;
    var biggerIcon = this.currentConditions !== undefined ? html`
      <span class="icon bigger" id="icon-bigger" style="background: none, url(${this._hass.hassUrl("/local/community/hko-weather-card/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this.currentConditions] + ".svg")}) no-repeat; background-size: contain;">${this.currentConditions}</span>
      ` : html`
      <span class="icon bigger" id="icon-bigger" style="background: none, url(${this._hass.hassUrl("/local/community/hko-weather-card/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + "exceptional.svg")}) no-repeat; background-size: contain;"></span>`;
    var summary = this.config.entity_daily_summary ? html`${this._hass.states[this.config.entity_daily_summary].attributes.forecastDesc !== undefined ? this._hass.states[this.config.entity_daily_summary].attributes.forecastDesc : this._hass.states[this.config.entity_daily_summary] !== undefined ? this._hass.states[this.config.entity_daily_summary].state : "Config Error"}` : ``;
    var separator = this.config.show_separator ? html`<hr class="line">` : html`<hr class="hiddenline">`;
    var uv_alert = this.config.entity_uv_alert ? html`${this._hass.states[this.config.entity_uv_alert] !== undefined ? this._hass.states[this.config.entity_uv_alert].state : "UV: Config Error"}` : ``;
    var slot_section = (this.config.hide_slot_section === true) ? `` : (this.config.use_old_column_format === true) ? html`
      <ul class="variations-ugly">
        <li>${this.getSlot().l1}${this.getSlot().l2}${this.getSlot().l3}${this.getSlot().l4}${this.getSlot().l5}${this.getSlot().l6}${this.getSlot().l7}${this.getSlot().l8}</li>
        <li>${this.getSlot().r1}${this.getSlot().r2}${this.getSlot().r3}${this.getSlot().r4}${this.getSlot().r5}${this.getSlot().r6}${this.getSlot().r7}${this.getSlot().r8}</li>
      </ul>
      ` : html`
      <ul class="variations">
        <li class="slotlist">${this.getSlot().l1}${this.getSlot().l2}${this.getSlot().l3}${this.getSlot().l4}${this.getSlot().l5}${this.getSlot().l6}${this.getSlot().l7}${this.getSlot().l8}</li>
        <li class="slotlist">${this.getSlot().r1}${this.getSlot().r2}${this.getSlot().r3}${this.getSlot().r4}${this.getSlot().r5}${this.getSlot().r6}${this.getSlot().r7}${this.getSlot().r8}</li>
      </ul>`;
    var warninginfo = this.config.entity_warninginfo ? html`${this.warninginfo5}${this.warninginfo4}${this.warninginfo3}${this.warninginfo2}${this.warninginfo1}${this.warninginfo0}` : ``;
    var topbar = html`<span class="topbar">${warninginfo} ${apparentTemp}</span>`;
    var forecast_section = (this.config.hide_forecast_section === true) ? `` : html`
      <div class="forecast clear">
        ${this.forecast.map(daily => html`
          <div class="day fcasttooltip">
            <span class="dayname" id="fcast-date-${daily.dayIndex}">${(daily.date).toLocaleDateString(this.config.locale,{month: 'numeric', day: 'numeric'})}</span><br>
            <span class="dayname" id="fcast-weekday-${daily.dayIndex}">${(daily.date).toLocaleDateString(this.config.locale,{weekday: 'short'})}</span>
            <br>${this._hass.states[daily.condition] !== undefined 
              ? 
                html`<i class="icon" id="fcast-icon-${daily.dayIndex}" style="background: none, url(${this._hass.hassUrl("/local/community/hko-weather-card/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this._hass.states[daily.condition].state] + ".svg").replace("-night", "-day").replace("-wraina", "").replace("-wrainr", "").replace("-wrainb", "").replace("-wts", "")}) no-repeat; background-size: contain;"></i><br>`
              : 
                html`<div class="eicon"><ha-icon style="top: 50%; margin: 0; -ms-transform: translateY(-50%); transform: translateY(-50%);" icon="mdi:alert"></ha-icon></div>`}
            ${this.config.old_daily_format 
              ? 
                html`<span class="highTemp" id="fcast-temphigh-${daily.dayIndex}">${this._hass.states[daily.temphigh] !== undefined ? this._hass.states[daily.temphigh].state : 'Err'}°C</span><br><span class="lowTemp" id="fcast-templow-${daily.dayIndex}">${this._hass.states[daily.templow] !== undefined ? this._hass.states[daily.templow].state : 'Err'}°C</span>`
              : 
                this.config.tempformat === "highlow"
                  ?
                    html`<span class="highTemp" id="fcast-temphigh-${daily.dayIndex}">${this._hass.states[daily.temphigh] !== undefined ? this._hass.states[daily.temphigh].state : "Err"}</span> / <span class="lowTemp" id="fcast-templow-${daily.dayIndex}">${this._hass.states[daily.templow] !== undefined ? this._hass.states[daily.templow].state : "Err"}°C</span>`
                  :
                    html`<span class="lowTemp" id="fcast-templow-${daily.dayIndex}">${this._hass.states[daily.templow] !== undefined ? this._hass.states[daily.templow].state : "Err"}</span> / <span class="highTemp" id="fcast-temphigh-${daily.dayIndex}">${this._hass.states[daily.temphigh] !== undefined ? this._hass.states[daily.temphigh].state : "Err"}°C</span>`}
            ${this.config.entity_forecast_high_rh_1 && this.config.entity_forecast_high_rh_2 && this.config.entity_forecast_high_rh_3 && this.config.entity_forecast_high_rh_4 && this.config.entity_forecast_high_rh_5 && this.config.entity_forecast_low_rh_1 && this.config.entity_forecast_low_rh_2 && this.config.entity_forecast_low_rh_3 && this.config.entity_forecast_low_rh_4 && this.config.entity_forecast_low_rh_5 
              ? 
                html`<br><span class="rh" id="fcast-rhlow-${daily.dayIndex}">${this._hass.states[daily.rhlow] !== undefined ? this._hass.states[daily.rhlow].state : "Err"}</span> - <span class="rh" id="fcast-rhhigh-${daily.dayIndex}">${this._hass.states[daily.rhhigh] !== undefined ? this._hass.states[daily.rhhigh].state : "Err"}%</span>`
              : ``}
            ${this.config.entity_pop_1 && this.config.entity_pop_2 && this.config.entity_pop_3 && this.config.entity_pop_4 && this.config.entity_pop_5 ? html`<br><span class="${this.config.locale.includes("zh") ? "pop" : "pop-s"}" id="fcast-pop-${daily.dayIndex}">${this._hass.states[daily.pop] ? this._hass.states[daily.pop].state : "Err"}</span>` : ``}
          <div class="fcasttooltiptext" id="fcast-summary-${daily.dayIndex}">${ this.config.tooltips ? this._hass.states[daily.summary] !== undefined ? this._hass.states[daily.summary].state : "Config Error" : ""}</div>
          </div>`)}
      </div>`;
    var summary_section = (this.config.hide_summary_section === true) ? `` : html`
      <div class="summary clear" id="daily-summary-text">
        ${summary} ${uv_alert}
      </div>`;

// Build HTML
    return html`
      <ha-card class = "card">
        <div>
          ${biggerIcon}
          ${this.tcwsIcon}
          <span class="temp" id="temperature-text">${this.currentTemperature}</span><span class="tempc">°C</span>
          ${currentText}
          ${topbar}
        </div>
        ${separator}
        <span>${slot_section}</span>
        ${forecast_section}
        ${summary_section}
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
      'r6' : this.slotValue('r6',this.config.slot_r6),
      'r7' : this.slotValue('r7',this.config.slot_r7),
      'r8' : this.slotValue('r8',this.config.slot_r8),
      'l1' : this.slotValue('l1',this.config.slot_l1),
      'l2' : this.slotValue('l2',this.config.slot_l2),
      'l3' : this.slotValue('l3',this.config.slot_l3),
      'l4' : this.slotValue('l4',this.config.slot_l4),
      'l5' : this.slotValue('l5',this.config.slot_l5),
      'l6' : this.slotValue('l6',this.config.slot_l6),
      'l7' : this.slotValue('l7',this.config.slot_l7),
      'l8' : this.slotValue('l8',this.config.slot_l8),
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
      case 'rainfall' : return this.rainToday;
      case 'humidity': return this.humidity;
      case 'pressure': return this.pressure;
      case 'daytime_high': return this.daytimeHigh;
      case 'daytime_low': return this.daytimeLow;
      case 'maxmin_since_midnight': return this.MaxMinsinceMidnight;
      case 'uv_summary' : return this.uvSummary;
      case 'wind': return this.wind;
      case 'visibility': return this.visibility;
      case 'sun_next': return this.sunNext;
      case 'sun_following': return this.sunFollowing;
      case 'custom1': return this.custom1;
      case 'custom2': return this.custom2;
      case 'custom3': return this.custom3;
      case 'custom4': return this.custom4;
      case 'custom5': return this.custom5;
      case 'custom6': return this.custom6;
      case 'custom7': return this.custom7;
      case 'custom8': return this.custom8;
      case 'empty': return html`&nbsp;`;
      case 'remove': return ``;
    }

    // If no value can be matched pass back a default for the slot
    switch (slot) {
      case 'l1': return this.sunNext;
      case 'l2': return this.MaxMinsinceMidnight;
      case 'l3': return this.wind;
      case 'l4': return this.pressure;
      case 'r1': return this.sunFollowing;
      case 'r2': return this.humidity;
      case 'r3': return this.uvSummary;
      case 'r4': return this.rainToday;
    }
  }

  get tcwsIcon() {
    try {
      var entity = this._hass.states[this.config.entity_warnsum].attributes.WTCSGNL
      if (entity !== undefined) {
        return html`<span class="tcws" id="tcws-icon" style="background: none, url(${this._hass.hassUrl("/local/community/hko-weather-card/weather_icons/warnsum/" + this.warningIcons[entity.code] + this.tcwsStyle + ".svg")}) no-repeat; background-size: contain;"></span>`;
      } else {}
    } catch (e) {}
  }

  get tcwsStyle() {
    switch (this.config.tcws_style) {
      case "og": return "";
      case "grey": return "-g";
      default: return "-c";
    }
  }

  get warninginfo0() {
    try {
      var entity = this._hass.states[this.config.entity_warninginfo].attributes.details[0]
      if (entity.warningStatementCode !== undefined) {
        if (!entity.warningStatementCode.includes("TC")) {
          return html`<span class="warninfotooltip" id="warning-0-icon"><span class="${entity.contents[0].includes(this.localeText.Cancel) ? "cancel" : ""}"><span class="${entity.contents[1] !== undefined ? entity.contents[1].includes(this.localeText.Cancel) ? "cancel" : "" : ""}">${this.warningIcons[entity.subtype !== undefined ? entity.subtype : entity.warningStatementCode]}</span></span><span class="warninfotooltiptext" id="warning-0-text">${entity.contents}</span></span>`;
        } else {}
      }
    } catch (e) {}
  }

  get warninginfo1() {
    try {
      var entity = this._hass.states[this.config.entity_warninginfo].attributes.details[1]
      if (entity.warningStatementCode !== undefined) {
        if (!entity.warningStatementCode.includes("TC")) {
          return html`<span class="warninfotooltip" id="warning-1-icon"><span class="${entity.contents[0].includes(this.localeText.Cancel) ? "cancel" : ""}"><span class="${entity.contents[1] !== undefined ? entity.contents[1].includes(this.localeText.Cancel) ? "cancel" : "" : ""}">${this.warningIcons[entity.subtype !== undefined ? entity.subtype : entity.warningStatementCode]}</span></span><span class="warninfotooltiptext" id="warning-1-text">${entity.contents}</span></span>`;
        } else {}
      }
    } catch (e) {}
  }

  get warninginfo2() {
    try {
      var entity = this._hass.states[this.config.entity_warninginfo].attributes.details[2]
      if (entity.warningStatementCode !== undefined) {
        if (!entity.warningStatementCode.includes("TC")) {
          return html`<span class="warninfotooltip" id="warning-2-icon"><span class="${entity.contents[0].includes(this.localeText.Cancel) ? "cancel" : ""}"><span class="${entity.contents[1] !== undefined ? entity.contents[1].includes(this.localeText.Cancel) ? "cancel" : "" : ""}">${this.warningIcons[entity.subtype !== undefined ? entity.subtype : entity.warningStatementCode]}</span></span><span class="warninfotooltiptext" id="warning-2-text">${entity.contents}</span></span>`;
        } else {}
      }
    } catch (e) {}
  }

  get warninginfo3() {
    try {
      var entity = this._hass.states[this.config.entity_warninginfo].attributes.details[3]
      if (entity.warningStatementCode !== undefined) {
        if (!entity.warningStatementCode.includes("TC")) {
          return html`<span class="warninfotooltip" id="warning-3-icon"><span class="${entity.contents[0].includes(this.localeText.Cancel) ? "cancel" : ""}"><span class="${entity.contents[1] !== undefined ? entity.contents[1].includes(this.localeText.Cancel) ? "cancel" : "" : ""}">${this.warningIcons[entity.subtype !== undefined ? entity.subtype : entity.warningStatementCode]}</span></span><span class="warninfotooltiptext" id="warning-3-text">${entity.contents}</span></span>`;
        } else {}
      }
    } catch (e) {}
  }

  get warninginfo4() {
    try {
      var entity = this._hass.states[this.config.entity_warninginfo].attributes.details[4]
      if (entity.warningStatementCode !== undefined) {
        if (!entity.warningStatementCode.includes("TC")) {
          return html`<span class="warninfotooltip" id="warning-4-icon"><span class="${entity.contents[0].includes(this.localeText.Cancel) ? "cancel" : ""}"><span class="${entity.contents[1] !== undefined ? entity.contents[1].includes(this.localeText.Cancel) ? "cancel" : "" : ""}">${this.warningIcons[entity.subtype !== undefined ? entity.subtype : entity.warningStatementCode]}</span></span><span class="warninfotooltiptext" id="warning-4-text">${entity.contents}</span></span>`;
        } else {}
      }
    } catch (e) {}
  }

  get warninginfo5() {
    try {
      var entity = this._hass.states[this.config.entity_warninginfo].attributes.details[5]
      if (entity.warningStatementCode !== undefined) {
        if (!entity.warningStatementCode.includes("TC")) {
          return html`<span class="warninfotooltip" id="warning-5-icon"><span class="${entity.contents[0].includes(this.localeText.Cancel) ? "cancel" : ""}"><span class="${entity.contents[1] !== undefined ? entity.contents[1].includes(this.localeText.Cancel) ? "cancel" : "" : ""}">${this.warningIcons[entity.subtype !== undefined ? entity.subtype : entity.warningStatementCode]}</span></span><span class="warninfotooltiptext" id="warning-5-text">${entity.contents}</span></span>`;
        } else {}
      }
    } catch (e) {}
  }

  get warningIcons() {
    var wfirey_icon = html`<ha-icon class="ha-icon-yellow" icon="mdi:fire"></ha-icon>`;
    var wfirer_icon = html`<ha-icon class="ha-icon-red" icon="mdi:fire"></ha-icon>`;
    var wfrost_icon = html`<ha-icon class="ha-icon-red" icon="mdi:snowflake"></ha-icon>`;
    var whot_icon = html`<ha-icon class="ha-icon-red" icon="mdi:thermometer-high"></ha-icon>`;
    var wcold_icon = html`<ha-icon class="ha-icon-blue" icon="mdi:thermometer-low"></ha-icon>`;
    var wmsgnl_icon = html`<ha-icon class="ha-icon-red" icon="mdi:weather-windy"></ha-icon>`;
    var wraina_icon = html`<ha-icon class="ha-icon-yellow" icon="mdi:weather-pouring"></ha-icon>`;
    var wrainr_icon = html`<ha-icon class="ha-icon-red" icon="mdi:weather-pouring"></ha-icon>`;
    var wrainb_icon = html`<ha-icon class="ha-icon-black" icon="mdi:weather-pouring"></ha-icon>`;
    var wfntsa_icon = html`<ha-icon class="ha-icon-wfntsa" icon="mdi:home-flood"></ha-icon>`;
    var wl_icon = html`<ha-icon class="ha-icon-wl" icon="mdi:landslide"></ha-icon>`;
    var wtmw_icon = html`<ha-icon class="ha-icon-blue" icon="mdi:tsunami"></ha-icon>`;
    var wts_icon = html`<ha-icon class="ha-icon-yellow" icon="mdi:lightning-bolt"></ha-icon>`;
    var tc1_icon = `TC1`;
    var tc3_icon = `TC3`;
    var wtcpre8_icon = `PRE8`;
    var tc8ne_icon = `TC8NE`;
    var tc8se_icon = `TC8SE`;
    var tc8nw_icon = `TC8NW`;
    var tc8sw_icon = `TC8SE`;
    var tc9_icon = `TC9`;
    var tc10_icon = `TC10`;
    return {
      'WFIREY': wfirey_icon,
      'WFIRER': wfirer_icon,
      'WFROST': wfrost_icon,
      'WHOT': whot_icon,
      'WCOLD': wcold_icon,
      'WMSGNL': wmsgnl_icon,
      'WTCPRE8': wtcpre8_icon,
      'WRAINA': wraina_icon,
      'WRAINR': wrainr_icon,
      'WRAINB': wrainb_icon,
      'WFNTSA': wfntsa_icon,
      'WL': wl_icon,
      'TC1': tc1_icon,
      'TC3': tc3_icon,
      'TC8NE': tc8ne_icon,
      'TC8SE': tc8se_icon,
      'TC8NW': tc8nw_icon,
      'TC8SW': tc8sw_icon,
      'TC9': tc9_icon,
      'TC10': tc10_icon,
      'CANCEL': ``,
      'WTMW': wtmw_icon,
      'WTS': wts_icon,
      'unavailable': ``
    }
  }

  get pop() {
    try {
      var intensity = this.config.entity_pop_intensity && !this.config.entity_pop_intensity_rate ? html`<span id="intensity-text"> - ${(Number(this._hass.states[this.config.entity_pop_intensity].state)).toLocaleString()}</span><span class="unit">mm</span>` : this.config.entity_pop_intensity_rate && !this.config.entity_pop_intensity ? html`<span id="intensity-text"> - ${(Number(this._hass.states[this.config.entity_pop_intensity_rate].state)).toLocaleString()}</span><span class="unit">mm/h</span>` : ` Config Error`;
      return this.config.entity_pop ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">${this._hass.states[this.config.entity_pop] !== undefined ? this._hass.states[this.config.entity_pop].state : "Config Error"}</span><span class="unit">%</span><span>${intensity}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">Config Error</span></li>`;
    }
  }

  get popforecast() {
    try {
      return this.config.entity_pop && this.config.entity_possible_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">${this._hass.states[this.config.entity_pop].state}</span><span class="unit">%</span><span> - <span id="pop-text-today">${this._hass.states[this.config.entity_possible_today].state}</span></span><span class="unit">mm</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">Config Error</span></li>`;
    }
  }

  get possibleToday() {
    try {
      return this.config.entity_possible_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span>${this.localeText.posToday} <span id="possible_today-text">${this._hass.states[this.config.entity_possible_today].state}</span><span class="unit">mm</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="possible_today-text">Config Error</span></li>`;
    }
  }

  get rainToday() {
    try {
      return this.config.entity_rain_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="rain-today-text">${this._hass.states[this.config.entity_rain_today].state}</span><span class="unit">mm</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="rain-today-text">Config Error</span></li>`;
    }
  }

  get humidity() {
    try {
      return this.config.entity_humidity ? html`<li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span><span id="humidity-text">${this.currentHumidity}</span><span class="unit">%</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span><span id="humidity-text">Config Error</span></li>`;
    }
  }

  get pressure() {
    try {
      return this.config.entity_pressure ? html`<li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span><span id="pressure-text">${this.currentPressure} </span><span class="unit">hPa</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span><span id="pressure-text">Config Error</span></li>`;
    }
  }

  get daytimeHigh() {
    try {
      var entity = this.config.entity_daytime_high;
      var places = this.config.show_decimals_today ? 1 : 0;
      var max = entity && this._hass.states[entity].state !== undefined ? (Number(this._hass.states[entity].state)).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places}) : "---";
      var unit = html`<span class="unit">°C</span>`;
      var icon = html`<span class="ha-icon"><ha-icon icon="mdi:thermometer-high"></ha-icon></span>`;
      return entity ? html`<li>${icon}${this.localeText.maxToday} <span id="daytime-high-text">${max}</span>${unit}</li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-high"></ha-icon></span><span id="daytime-high-text">Config Error</span></li>`;
    }
  }

  get daytimeLow() {
    try {
      var entity = this.config.entity_daytime_low;
      var places = this.config.show_decimals_today ? 1 : 0;
      var min = entity && this._hass.states[entity].state !== undefined ? (Number(this._hass.states[entity].state)).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places}) : "---";
      var unit = html`<span class="unit">°C</span>`;
      var icon = html`<span class="ha-icon"><ha-icon icon="mdi:thermometer-low"></ha-icon></span>`;
      return entity ? html`<li>${icon}${this.localeText.minToday} <span id="daytime-low-text">${min}</span>${unit}</li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-low"></ha-icon></span><span id="daytime-low-text">Config Error</span></li>`;
    }
  }

  get MaxMinsinceMidnight() {
    try {
      var entityMax = this.config.entity_daytime_high;
      var entityMin = this.config.entity_daytime_low;
      var places = this.config.show_decimals_today ? 1 : 0;
      var max = entityMax && this._hass.states[entityMax].state !== undefined ? (Number(this._hass.states[entityMax].state)).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places}) : "---";
      var min = entityMin && this._hass.states[entityMin].state !== undefined ? (Number(this._hass.states[entityMin].state)).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places}) : "---";
      var unit = html`<span class="unit">°C</span>`;
      var icon = html`<span class="ha-icon"><ha-icon icon="mdi:thermometer"></ha-icon></span>`;
      return entityMax && entityMin ? html`<li>${icon}<span class="lowTemp" id="daytime-low-text">${min}</span> / <span class="highTemp" id="daytime-high-text">${max}</span>${unit}</li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer"></ha-icon></span><span>Config Error</span></li>`;
    }
  }

  get uvSummary() {
    try {
      return this.config.entity_uv_alert_summary ? html`<li><span class="ha-icon"><ha-icon icon="mdi:sun-wireless-outline"></ha-icon></span>${this.localeText.uvRating} <span id="daytime-uv-text">${this.uvLevel}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:sun-wireless-outline"></ha-icon></span><span id="daytime-uv-text">Config Error</span></li>`;
    }
  }

  get wind() {
    try {
      var bearing = this.config.entity_wind_bearing ? html`<span id="wind-bearing-text">${this.currentWindBearing}</span>` : ``;
      var beaufort = this.config.entity_wind_speed && this.config.show_beaufort ? html`<span id="beaufort-text">Bft: ${this.currentBeaufort} - </span>` : ``;
      var speed = this.config.entity_wind_speed ? html`<span id="wind-speed-text"> ${this.currentWindSpeed}</span>` : ``;
      var gust = this.config.entity_wind_gust ? html`<span id="wind-gust-text">${this.localeText.Gust} ${this.currentWindGust}</span>` : ``;
      var unit = html`<span class="unit-s">km/h</span>`;
      var icon = html`<span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span>`;
      return this.config.entity_wind_bearing && this.config.entity_wind_speed && this.config.entity_wind_gust ? html`<li>${icon}${beaufort}${bearing}${speed}${unit} ( ${gust}${unit} )</li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed ? html`<li>${icon}${beaufort}${bearing}${speed}${unit}</li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span id="wind-error-text">Config Error</span></li>`;
    }
  }

  get visibility() {
    try {
      return this.config.entity_visibility ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span><span id="visibility-text">${this.currentVisibility}</span><span class="unit"> ${this.getUOM('length')}</span></li>` : ``;
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span><span id="visibility-text">Config Error</span></li>`;
    }
  }

  get sunNext() {
    try {
      return this.config.entity_sun ? this.sunSet.next : "";
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunset"></ha-icon></span><span id="sun-next-text">Config Error</span></li>`;
    }
  }

  get sunFollowing() {
    try {
      return this.config.entity_sun ? this.sunSet.following : "";
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunset"></ha-icon></span><span id="sun-following-text">Config Error</span></li>`;
    }
  }

  get custom1() {
    try {
      var icon = this.config.custom1_icon ? this.config.custom1_icon : 'mdi:help-box';
      var value = this.config.custom1_value ? this._hass.states[this.config.custom1_value].state : 'unknown';
      var unit = this.config.custom1_units ? this.config.custom1_units : '';
      if (value !== '') {
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-1-text">${value}</span> <span class="unit">${unit}</span></li>`;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-1-text">Config Error</span></li>`;
    }
  }

  get custom2() {
    try {
      var icon = this.config.custom2_icon ? this.config.custom2_icon : 'mdi:help-box';
      var value = this.config.custom2_value ? this._hass.states[this.config.custom2_value].state : 'unknown';
      var unit = this.config.custom2_units ? this.config.custom2_units : '';
      if (value !== '') {
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-2-text">${value}</span> <span class="unit">${unit}</span></li>`;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-2-text">Config Error</span></li>`;
    }
  }

  get custom3() {
    try {
      var icon = this.config.custom3_icon ? this.config.custom3_icon : 'mdi:help-box';
      var value = this.config.custom3_value ? this._hass.states[this.config.custom3_value].state : 'unknown';
      var unit = this.config.custom3_units ? this.config.custom3_units : '';
      if (value !== '') {
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-3-text">${value}</span> <span class="unit">${unit}</span></li>`;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-3-text">Config Error</span></li>`;
    }
  }

  get custom4() {
    try {
      var icon = this.config.custom4_icon ? this.config.custom4_icon : 'mdi:help-box';
      var value = this.config.custom4_value ? this._hass.states[this.config.custom4_value].state : 'unknown';
      var unit = this.config.custom4_units ? this.config.custom4_units : '';
      if (value !== '') {
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-4-text">${value}</span> <span class="unit">${unit}</span></li>`;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-4-text">Config Error</span></li>`;
    }
  }

  get custom5() {
    try {
      var icon = this.config.custom5_icon ? this.config.custom5_icon : 'mdi:help-box';
      var value = this.config.custom5_value ? this._hass.states[this.config.custom5_value].state : 'unknown';
      var unit = this.config.custom5_units ? this.config.custom5_units : '';
      if (value !== '') {
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-5-text">${value}</span> <span class="unit">${unit}</span></li>`;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-5-text">Config Error</span></li>`;
    }
  }

  get custom6() {
    try {
      var icon = this.config.custom6_icon ? this.config.custom6_icon : 'mdi:help-box';
      var value = this.config.custom6_value ? this._hass.states[this.config.custom6_value].state : 'unknown';
      var unit = this.config.custom6_units ? this.config.custom6_units : '';
      if (value !== '') {
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-6-text">${value}</span> <span class="unit">${unit}</span></li>`;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-6-text">Config Error</span></li>`;
    }
  }

  get custom7() {
    try {
      var icon = this.config.custom7_icon ? this.config.custom7_icon : 'mdi:help-box';
      var value = this.config.custom7_value ? this._hass.states[this.config.custom7_value].state : 'unknown';
      var unit = this.config.custom7_units ? this.config.custom7_units : '';
      if (value !== '') {
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-7-text">${value}</span> <span class="unit">${unit}</span></li>`;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-7-text">Config Error</span></li>`;
    }
  }

  get custom8() {
    try {
      var icon = this.config.custom8_icon ? this.config.custom8_icon : 'mdi:help-box';
      var value = this.config.custom8_value ? this._hass.states[this.config.custom8_value].state : 'unknown';
      var unit = this.config.custom8_units ? this.config.custom8_units : '';
      if (value !== '') {
      return html`<li><span class="ha-icon"><ha-icon icon=${icon}></ha-icon></span><span id="custom-8-text">${value}</span> <span class="unit">${unit}</span></li>`;
      }
    } catch (e) {
      return html`<li><span class="ha-icon"><ha-icon icon="mdi:help-box"></ha-icon></span><span id="custom-8-text">Config Error</span></li>`;
    }
  }

  get wts() {
    try {
      var warnsum = this._hass.states[this.config.entity_warnsum].attributes.WTS;
      if (warnsum.actionCode !== "CANCEL") {
        return "-wts";
      } else { return ""; }
    } catch (e) { return ""; }
  }

  get wrain() {
    try {
      var warnsum = this._hass.states[this.config.entity_warnsum].attributes.WRAIN;
      if (warnsum.actionCode !== "CANCEL") {
        switch (warnsum.code) {
          case "WRAINA": return "-wraina";
          case "WRAINR": return "-wrainr";
          case "WRAINB": return "-wrainb";
        }
      } else { return ""; }
    } catch (e) { return ""; }
  }


// #####
// ##### feelsLikeText returns set of possible "Feels Like" text by specified language
// #####

  get localeText() {
    switch (this.config.locale) {
      case "zh":
      case "zh-cn":
      case "zh-hk":
        return {
          feelsLike: "體感",
          maxToday: "最高",
          minToday: "最低",
          uvRating: "紫外線",
          Gust: "陣風",
          Cancel: "取消"
        }
      default:
        return {
          feelsLike: "Feels like",
          maxToday: "Today's High",
          minToday: "Today's Low",
          posToday: "Forecast",
          posTomorrow: "Fore Tom",
          uvRating: "UV",
          Gust: "Gust",
          Cancel: "cancel"
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
    var sunny_icon = `sunny`;
    var sunny_periods_icon = `sunny-periods${this.wts}`;
    var sunny_intervals_icon = `cloudy-day-3${this.wts}`;
    var light_showers_icon = `light-showers${this.wts}`;
    var showers_icon = `showers${this.wts}`;
    var cloudy_icon = `cloudy${this.wts}`;
    var overcast_icon = `overcast${this.wts}`;
    var light_rain_icon = `light-rain${this.wts}`;
    var rain_icon = `rain${this.wrain}${this.wts}`;
    var heavy_rain_icon = `heavy-rain${this.wrain}${this.wts}`;
    var thunderstorms_icon = `thunderstorms${this.wrain}`;
    var moon_new_icon = `moon-new`;
    var moon_waxing_crescent_icon = `moon-waxing-crescent`;
    var moon_first_quarter_icon = `moon-first-quarter`;
    var moon_full_icon = `moon-full`;
    var moon_last_quarter_icon = `moon-last-quarter`;
    var moon_waning_crescent_icon = `moon-waning-crescent`;
    var mainly_cloudy_icon = `mainly-cloudy${this.wts}`;
    var mainly_fine_icon = `mainly-fine${this.wts}`;
    var windy_icon = `windy`;
    var dry_icon = `dry`;
    var humid_icon = `humid`;
    var fog_icon = `fog${this.wts}`;
    var mist_icon = `mist${this.wts}`;
    var haze_icon = `haze${this.wts}`;
    var hot_icon = `hot`;
    var warm_icon = `warm`;
    var cool_icon = `cool`;
    var cold_icon = `cold`;
    return {
      '50': sunny_icon,
      '51': sunny_periods_icon,
      '52': sunny_intervals_icon,
      '53': light_showers_icon,
      '54': showers_icon,
      '60': cloudy_icon,
      '61': overcast_icon,
      '62': light_rain_icon,
      '63': rain_icon,
      '64': heavy_rain_icon,
      '65': thunderstorms_icon,
      '70': moon_new_icon,
      '71': moon_waxing_crescent_icon,
      '72': moon_first_quarter_icon,
      '73': moon_full_icon,
      '74': moon_last_quarter_icon,
      '75': moon_waning_crescent_icon,
      '76': mainly_cloudy_icon,
      '77': mainly_fine_icon,
      '80': windy_icon,
      '81': dry_icon,
      '82': humid_icon,
      '83': fog_icon,
      '84': mist_icon,
      '85': haze_icon,
      '90': hot_icon,
      '91': warm_icon,
      '92': cool_icon,
      '93': cold_icon,
      'unavailable': `exceptional`
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
                                        rhhigh:  this.config.entity_forecast_high_rh_1,
                                        rhlow:  this.config.entity_forecast_low_rh_1,
                                        pop: this.config.entity_pop_1,
                                        summary: this.config.entity_summary_1, };
    const forecast2 = { date: forecastDate2,
                      dayIndex: '2',
                      condition: this.config.entity_forecast_icon_2,
                                        temphigh: this.config.entity_forecast_high_temp_2,
                                        templow:  this.config.entity_forecast_low_temp_2,
                                        rhhigh:  this.config.entity_forecast_high_rh_2,
                                        rhlow:  this.config.entity_forecast_low_rh_2,
                                        pop: this.config.entity_pop_2,
                                        summary: this.config.entity_summary_2, };
    const forecast3 = { date: forecastDate3,
                      dayIndex: '3',
                      condition: this.config.entity_forecast_icon_3,
                                        temphigh: this.config.entity_forecast_high_temp_3,
                                        templow:  this.config.entity_forecast_low_temp_3,
                                        rhhigh:  this.config.entity_forecast_high_rh_3,
                                        rhlow:  this.config.entity_forecast_low_rh_3,
                                        pop: this.config.entity_pop_3,
                                        summary: this.config.entity_summary_3, };
    const forecast4 = { date: forecastDate4,
                      dayIndex: '4',
                      condition: this.config.entity_forecast_icon_4,
                                        temphigh: this.config.entity_forecast_high_temp_4,
                                        templow:  this.config.entity_forecast_low_temp_4,
                                        rhhigh:  this.config.entity_forecast_high_rh_4,
                                        rhlow:  this.config.entity_forecast_low_rh_4,
                                        pop: this.config.entity_pop_4,
                                        summary: this.config.entity_summary_4, };
    const forecast5 = { date: forecastDate5,
                      dayIndex: '5',
                      condition: this.config.entity_forecast_icon_5,
                                        temphigh: this.config.entity_forecast_high_temp_5,
                                        templow:  this.config.entity_forecast_low_temp_5,
                                        rhhigh:  this.config.entity_forecast_high_rh_5,
                                        rhlow:  this.config.entity_forecast_low_rh_5,
                                        pop: this.config.entity_pop_5,
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
    var places = this.config.show_decimals_pressure ? 1 : 0;
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

// #####
// ##### https://www.hko.gov.hk/en/wxinfo/ts/index_wind.htm
// #####
  get currentWindBearing() {
    var entity = this.config.entity_wind_bearing;
    var dir = this._hass.states[entity].state;
    if (entity && dir) {
      switch (this.config.locale) {
        case "zh":
        case "zh-hk":
        case "zh-cn":
          if (dir === "North" || dir === "北") return "北";
          if (dir === "Northeast" || dir === "東北") return "東北";
          if (dir === "East" || dir === "東") return "東";
          if (dir === "Southeast" || dir === "東南") return "東南";
          if (dir === "South" || dir === "南") return "南";
          if (dir === "Southwest" || dir === "西南") return "西南";
          if (dir === "West" || dir === "西") return "西";
          if (dir === "Northwest" || dir === "西北") return "西北";
          if (dir === "Variable" || dir === "風向不定") return "不定";
          if (dir === "Calm" || dir === "無風") return "無風";
          if (dir === "N/A") return "維修";
        default:
          if (dir === "North" || dir === "北") return "N";
          if (dir === "Northeast" || dir === "東北") return "NE";
          if (dir === "East" || dir === "東") return "E";
          if (dir === "Southeast" || dir === "東南") return "SE";
          if (dir === "South" || dir === "南") return "S";
          if (dir === "Southwest" || dir === "西南") return "SW";
          if (dir === "West" || dir === "西") return "W";
          if (dir === "Northwest" || dir === "西北") return "NW";
          if (dir === "Variable" || dir === "風向不定") return "VRB";
          if (dir === "Calm" || dir === "無風") return "O";
          if (dir === "N/A") return "M";
      }
    }
    return "--";
  }

  get currentWindSpeed() {
    return this.config.entity_wind_speed ? this._hass.states[this.config.entity_wind_speed].state : 0;
  }

  get currentWindGust() {
    return this.config.entity_wind_gust ? this._hass.states[this.config.entity_wind_gust].state : 0;
  }

  get currentApparent() {
    try {
      var places = this.config.show_decimals_apparent ? 1 : 0;
      return this.config.entity_apparent_temp ? Number(this._hass.states[this.config.entity_apparent_temp].state).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places}) : 0;
    } catch (e) {
      return "Config Error";
    }
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

get currentCaption() {
  var entity = this.config.entity_current_conditions;
  var icon = this._hass.states[entity].state;
  if (entity && icon) {
    switch (this.config.locale) {
      case "zh":
      case "zh-cn":
      case "zh-hk":
        if (icon == 50) return "天晴";
        if (icon == 51) return "間有陽光";
        if (icon == 52) return "短暫陽光";
        if (icon == 53) return "晴間驟雨";
        if (icon == 54) return "間晴驟雨";
        if (icon == 60) return "多雲";
        if (icon == 61) return "密雲";
        if (icon == 62) return "微雨";
        if (icon == 63) return "雨";
        if (icon == 64) return "大雨";
        if (icon == 65) return "雷暴";
        if (icon == 70) return "天色良好";
        if (icon == 71) return "天色良好";
        if (icon == 72) return "天色良好";
        if (icon == 73) return "天色良好";
        if (icon == 74) return "天色良好";
        if (icon == 75) return "天色良好";
        if (icon == 76) return "大致多雲";
        if (icon == 77) return "大致良好";
        if (icon == 80) return "大風";
        if (icon == 81) return "乾燥";
        if (icon == 82) return "潮濕";
        if (icon == 83) return "霧";
        if (icon == 84) return "薄霧";
        if (icon == 85) return "煙霞";
        if (icon == 90) return "炎熱";
        if (icon == 91) return "回暖";
        if (icon == 92) return "轉涼";
        if (icon == 93) return "寒冷";
      default:
        if (icon == 50) return "Sunny";
        if (icon == 51) return "Sunny Periods";
        if (icon == 52) return "Sunny Intervals";
        if (icon == 53) return "Light Showers";
        if (icon == 54) return "Showers";
        if (icon == 60) return "Cloudy";
        if (icon == 61) return "Overcast";
        if (icon == 62) return "Light Rain";
        if (icon == 63) return "Rain";
        if (icon == 64) return "Heavy Rain";
        if (icon == 65) return "Thunderstorms";
        if (icon == 70) return "Fine";
        if (icon == 71) return "Fine";
        if (icon == 72) return "Fine";
        if (icon == 73) return "Fine";
        if (icon == 74) return "Fine";
        if (icon == 75) return "Fine";
        if (icon == 76) return "Mainly Cloudy";
        if (icon == 77) return "Mainly Fine";
        if (icon == 80) return "Windy";
        if (icon == 81) return "Dry";
        if (icon == 82) return "Humid";
        if (icon == 83) return "Fog";
        if (icon == 84) return "Mist";
        if (icon == 85) return "Haze";
        if (icon == 90) return "Hot";
        if (icon == 91) return "Warm";
        if (icon == 92) return "Cool";
        if (icon == 93) return "Cold";
    }
  }
  return "";
}

get uvLevel() {
  var entity = this.config.entity_uv_alert_summary;
  var uv = this._hass.states[entity].state;
  if (entity && uv && !isNaN(Number(uv))) {
    switch (this.config.locale) {
      case "zh":
      case "zh-cn":
      case "zh-hk":
        if (uv >= 11) return "極高";
        if (uv >= 8) return "甚高";
        if (uv >= 6) return "高";
        if (uv >= 3) return "中";
        if (uv >= 0) return "低";
      default:
        if (uv >= 11) return "Extreme";
        if (uv >= 8) return "Very high";
        if (uv >= 6) return "High";
        if (uv >= 3) return "Moderate";
        if (uv >= 0) return "Low";
    }
  }
  return "---";
}


// #####
// ##### beaufortWind - returns the wind speed on the beaufort scale
// ##### reference https://en.wikipedia.org/wiki/Beaufort_scale
// #####

get currentBeaufort() {
  var WindSpeed = this._hass.states[this.config.entity_wind_speed].state;
  if (this.config.entity_wind_speed) {
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
    return 0;
  }
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

  static get styles() {

  return css`
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

      .line {
        margin-top: 6em;
        margin-left: 0.3em;
        margin-right: 0.3em;
      }

      .hiddenline {
        margin-top: 6em;
        margin-bottom: 0em;
        opacity: 0;
      }

      .temp {
        font-weight: 300;
        font-size: 4em;
        color: var(--primary-text-color);
        position: absolute;
        right: 0.7em;
        margin-top: 9px !important;
      }

      .tempc {
        font-weight: 300;
        font-size: 1.5em;
        vertical-align: super;
        color: var(--primary-text-color);
        position: absolute;
        right: 1em;
        margin-top: -3px !important;
        margin-right: -4px !important;
      }

      .topbar {
        color: var(--primary-text-color);
        position: absolute;
        right: 0.3em;
        margin-top: 55px;
        margin-right: 1em;
      }

      .currentText {
        font-size: 2em;
        color: var(--secondary-text-color);
        position: absolute;
        white-space: nowrap;
        left: 0px;
        margin-top: 0.6em;
        text-align: center;
        width: 100%;
        padding-bottom: 0.2em;
      }

      .pop {
        font-weight: 1em;
        color: var(--primary-text-color);
      }

      .pop-s {
        font-size: 0.9em;
        color: var(--primary-text-color);
      }

      .rh {
        font-weight: 1em;
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
        margin-top: 0.5em;
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
        margin-top: 0.5em;
      }

      .unit {
        font-size: 1em;
      }

      .unit-s {
        font-size: 0.8em;
      }

      .summary {
        font-size: 1em;
        padding-top: 1em;
      }

      .forecast {
        width: 100%;
        margin: 0 auto;
        height: 12.9em;
      }

      .day {
        display: block;
        width: 20%;
        float: left;
        text-align: center;
        color: var(--primary-text-color);
        border-right: 0.1em solid #d9d9d9;
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
        margin-top: -3em;
        position: absolute;
        left: 0px;
      }

      .icon {
        width: 55px;
        height: 55px;
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

      .tcws {
        width: 40px;
        height: 40px;
        margin-top: 40px;
        position: absolute;
        left: 0em;
        margin-left: 8.2em;
      }

      .ha-icon-yellow {
        height: 18px;
        margin-right: 0px;
        color: #FFBF00;
      }

      .ha-icon-red {
        height: 18px;
        margin-right: 0px;
        color: #EF4444;
      }

      .ha-icon-black {
        height: 18px;
        margin-right: 0px;
        color: #606060;
      }

      .ha-icon-blue {
        height: 18px;
        margin-right: 0px;
        color: #89CFF0;
      }

      .ha-icon-wfntsa {
        height: 18px;
        margin-right: 0px;
        color: #97F8C3;
      }

      .ha-icon-wl {
        height: 18px;
        margin-right: 0px;
        color: #675125;
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
        width: 110px;
        background-color: rgb( 75,155,239);
        color: #fff;
        text-align: center;
        border-radius: 6px;
        border-style: solid;
        border-color: rgb(255,161,0);
        border-width: 1px;
        padding: 5px 0;

        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        bottom: 50%;
        left: 0%;
        margin-left: -12px;
      }

      .fcasttooltip .fcasttooltiptext:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: rgb(255,161,0) transparent transparent transparent;
      }

      .fcasttooltip:hover .fcasttooltiptext {
        visibility: visible;
      }

      .warninfotooltip {
        position: relative;
        display: inline-block;
      }

      .warninfotooltip .warninfotooltiptext {
        visibility: hidden;
        width: 200px;
        background-color: rgb( 75,155,239);
        color: #fff;
        text-align: center;
        border-radius: 6px;
        border-style: solid;
        border-color: rgb(255,161,0);
        border-width: 1px;
        padding: 5px 0;

        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        top: 100%;
        right: -100%;
        margin-left: -12px;
      }

      .warninfotooltip .warninfotooltiptext:after {
        content: "";
        position: absolute;
        bottom: 100%;
        right: 15%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent rgb(255,161,0) transparent;
      }

      .warninfotooltip:hover .warninfotooltiptext {
        visibility: visible;
      }

      .cancel {
        opacity: 0.4;
      }
      `
}
// #####
// ##### getUOM: gets UOM for specified measure in either metric or imperial
// #####

  getUOM(measure) {

    const lengthUnit = this._hass.config.unit_system.length;

    switch (measure) {
      case 'length':
        return lengthUnit;
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
      if (this.currentConditions !== undefined) try { root.getElementById("icon-bigger").style.backgroundImage = `none, url(${this._hass.hassUrl("/local/community/hko-weather-card/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this.currentConditions] + ".svg")})`; } catch(e) {}

// Forecast blocks
      this.forecast.forEach((daily) => {
        if (this.config.hide_forecast_section !== true) try {
        root.getElementById("fcast-date-" + daily.dayIndex).textContent = `${(daily.date).toLocaleDateString(this.config.locale,{month: 'numeric', day: 'numeric'})}`;
        root.getElementById("fcast-weekday-" + daily.dayIndex).textContent = `${(daily.date).toLocaleDateString(this.config.locale,{weekday: 'short'})}`;
        if (this._hass.states[daily.condition] !== undefined) {
          root.getElementById("fcast-icon-" + daily.dayIndex).style.backgroundImage = `none, url(${this._hass.hassUrl("/local/community/hko-weather-card/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this._hass.states[daily.condition].state] + ".svg").replace("-night", "-day").replace("-wraina", "").replace("-wrainr", "").replace("-wrainb", "").replace("-wts", "")})`;
        }
        root.getElementById("fcast-temphigh-" + daily.dayIndex).textContent = `${this._hass.states[daily.temphigh] !== undefined ? this._hass.states[daily.temphigh].state : "Err"}${this.config.old_daily_format ? "°C" : this.config.tempformat === "highlow" ? "" : "°C"}`;
        root.getElementById("fcast-templow-" + daily.dayIndex).textContent = `${this._hass.states[daily.templow] !== undefined ? this._hass.states[daily.templow].state : "Err"}${this.config.old_daily_format ? "°C" : this.config.tempformat === "highlow" ? "°C" : ""}`;
        if (this.config.entity_forecast_high_rh_1 && this.config.entity_forecast_high_rh_2 && this.config.entity_forecast_high_rh_3 && this.config.entity_forecast_high_rh_4 && this.config.entity_forecast_high_rh_5 && this.config.entity_forecast_low_rh_1 && this.config.entity_forecast_low_rh_2 && this.config.entity_forecast_low_rh_3 && this.config.entity_forecast_low_rh_4 && this.config.entity_forecast_low_rh_5) try {
        root.getElementById("fcast-rhhigh-" + daily.dayIndex).textContent = `${this._hass.states[daily.rhhigh] !== undefined ? this._hass.states[daily.rhhigh].state : "Err"}%`;
        root.getElementById("fcast-rhlow-" + daily.dayIndex).textContent = `${this._hass.states[daily.rhlow] !== undefined ? this._hass.states[daily.rhlow].state : "Err"}`;
        } catch(e) {}
        if (this.config.entity_pop_1 && this.config.entity_pop_2 && this.config.entity_pop_3 && this.config.entity_pop_4 && this.config.entity_pop_5) root.getElementById("fcast-pop-" + daily.dayIndex).textContent = `${this._hass.states[daily.pop] !== undefined ? this._hass.states[daily.pop].state : "Err"}`;
        root.getElementById("fcast-summary-" + daily.dayIndex).textContent = `${this._hass.states[daily.summary] !== undefined ? this._hass.states[daily.summary].state : "Err"}`;
        } catch(e) {}
     });

// Optional Entities
      if (this.currentCaption && (root.getElementById("current-text") !== null)) try { root.getElementById("current-text").textContent = `${this.currentCaption}` } catch(e) {}
      if (this.config.entity_apparent_temp && (root.getElementById("apparent-text") !== null)) try { root.getElementById("apparent-text").textContent = `${this.currentApparent}` } catch(e) {}
      if (this.config.entity_wind_bearing && (root.getElementById("wind-bearing-text") !== null)) try { root.getElementById("wind-bearing-text").textContent = `${this.currentWindBearing}` } catch(e) {}
      if (this.config.entity_wind_speed && (root.getElementById("wind-speed-text") !== null)) try { root.getElementById("wind-speed-text").textContent = ` ${this.currentWindSpeed}` } catch(e) {}
      if (this.config.entity_wind_gust && (root.getElementById("wind-gust-text") !== null)) try { root.getElementById("wind-gust-next").textContent = ` (Gust ${this.currentWindGust}` } catch(e) {}
      if (this.config.entity_visibility && (root.getElementById("visibility-text") !== null)) try { root.getElementById("visibility-text").textContent = `${this.currentVisibility}` } catch(e) {}
      if (this.config.entity_pop_intensity && !this.config.entity_pop_intensity_rate && (root.getElementById("intensity-text") !== null)) try { root.getElementById("intensity-text").textContent = ` - ${(Number(this._hass.states[this.config.entity_pop_intensity].state)).toLocaleString()}` } catch(e) {}
      if (this.config.entity_pop_intensity_rate && !this.config.entity_pop_intensity && (root.getElementById("intensity-text") !== null)) try { root.getElementById("intensity-text").textContent = ` - ${(Number(this._hass.states[this.config.entity_pop_intensity_rate].state)).toLocaleString()}` } catch(e) {}
      if (this.config.entity_pop && (root.getElementById("pop-text") !== null)) try { root.getElementById("pop-text").textContent = `${this._hass.states[this.config.entity_pop].state}` } catch(e) {}
      if (this.config.entity_pop && this.config.entity_possible_today && (root.getElementById("pop-text-today") !== null)) try { root.getElementById("pop-text-today").textContent = `${this._hass.states[this.config.entity_possible_today].state}` } catch(e) {}
      if (this.config.entity_rain_today && (root.getElementById("rain-today-text") !== null)) try { root.getElementById("rain-today-text").textContent = `${this._hass.states[this.config.entity_rain_today].state}` } catch(e) {}
      var places = this.config.show_decimals_today ? 1 : 0;
      if (this.config.entity_daytime_high && (root.getElementById("daytime-high-text") !== null)) try { root.getElementById("daytime-high-text").textContent = `${Number(this._hass.states[this.config.entity_daytime_high].state).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places})}` } catch(e) {}
      if (this.config.entity_daytime_low && (root.getElementById("daytime-low-text") !== null)) try { root.getElementById("daytime-low-text").textContent = `${Number(this._hass.states[this.config.entity_daytime_low].state).toLocaleString(undefined, {minimumFractionDigits: places, maximumFractionDigits: places})}` } catch(e) {}
      if (this.config.entity_sun && (root.getElementById("sun-next-text") !== null)) try { 
        root.getElementById("sun-next-text").textContent = `${this.sunSet.nextText}`;
        root.getElementById("sun-next-icon").icon = `${this.sunSet.nextIcon}`;
      } catch(e) {}
      if (this.config.entity_sun && (root.getElementById("sun-following-text") !== null)) try { 
        root.getElementById("sun-following-text").textContent = `${this.sunSet.followingText}`;
        root.getElementById("sun-following-icon").icon = `${this.sunSet.followingIcon}`;
      } catch(e) {}
      if (this.config.entity_daily_summary && (root.getElementById("daily-summary-text") !== null)) try {
        if (this._hass.states[this.config.entity_daily_summary].attributes.forecastDesc !== undefined) {
          root.getElementById("daily-summary-text").textContent = 
          `${this._hass.states[this.config.entity_daily_summary].attributes.forecastDesc} ` + 
          (this.config.entity_uv_alert ? `${this._hass.states[this.config.entity_uv_alert].state}` : ``)
        } else {
            root.getElementById("daily-summary-text").textContent = 
            `${this._hass.states[this.config.entity_daily_summary].state}` + 
            (this.config.entity_uv_alert ? `${this._hass.states[this.config.entity_uv_alert].state}` : ``)
        }
      } catch(e) {}
      if (this.config.entity_pressure && (root.getElementById("pressure-text") !== null)) try { root.getElementById("pressure-text").textContent = `${this.currentPressure} ` } catch(e) {}
      if (this.config.entity_humidity && (root.getElementById("humidity-text") !== null)) try { root.getElementById("humidity-text").textContent = `${this.currentHumidity}` } catch(e) {}
      if (this.config.show_beaufort && (root.getElementById("beaufort-text") !== null)) try { root.getElementById("beaufort-text").textContent =  `Bft: ${this.currentBeaufort} - ` } catch(e) {}
      if (this.config.entity_possible_today && (root.getElementById("possible_today-text") !== null)) try { root.getElementById("possible_today-text").textContent = `${this._hass.states[this.config.entity_possible_today].state}` } catch(e) {}
      if (this.config.entity_uv_alert_summary && (root.getElementById("daytime-uv-text") !== null)) try { root.getElementById("daytime-uv-text").textContent = `${this.uvLevel}` } catch(e) {}
      for (let i = 1; i <= 8; i++) {
        const value = this.config[`custom${i}_value`];
        const text = root.getElementById(`custom-${i}-text`);
        if (value && text !== null) try {
          text.textContent = `${this._hass.states[value].state}`;
        } catch (e) {}
      }

// WarningInfo
      var wtcsgnl = this._hass.states[this.config.entity_warnsum].attributes.WTCSGNL;
      if (this.config.entity_warnsum && (root.getElementById("tcws-icon") !== null)) try { root.getElementById("tcws-icon").style.backgroundImage = `none, url(${this._hass.hassUrl("/local/community/hko-weather-card/weather_icons/warnsum/" + this.warningIcons[wtcsgnl.code] + this.tcwsStyle + ".svg")})`; } catch(e) {}
      var details = this._hass.states[this.config.entity_warninginfo].attributes.details;
      if (this.config.entity_warninginfo && (root.getElementById("warning-0-icon") !== null)) try { root.getElementById("warning-0-icon").icon = `${details[0].subtype !== undefined ? this.warningIcons[details[0].subtype] : this.warningIcons[details[0].warningStatementCode]}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-1-icon") !== null)) try { root.getElementById("warning-1-icon").icon = `${details[1].subtype !== undefined ? this.warningIcons[details[1].subtype] : this.warningIcons[details[1].warningStatementCode]}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-2-icon") !== null)) try { root.getElementById("warning-2-icon").icon = `${details[2].subtype !== undefined ? this.warningIcons[details[2].subtype] : this.warningIcons[details[2].warningStatementCode]}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-3-icon") !== null)) try { root.getElementById("warning-3-icon").icon = `${details[3].subtype !== undefined ? this.warningIcons[details[3].subtype] : this.warningIcons[details[3].warningStatementCode]}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-4-icon") !== null)) try { root.getElementById("warning-4-icon").icon = `${details[4].subtype !== undefined ? this.warningIcons[details[4].subtype] : this.warningIcons[details[4].warningStatementCode]}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-5-icon") !== null)) try { root.getElementById("warning-5-icon").icon = `${details[5].subtype !== undefined ? this.warningIcons[details[5].subtype] : this.warningIcons[details[5].warningStatementCode]}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-0-text") !== null)) try { root.getElementById("warning-0-text").textContent = `${details[0].contents}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-1-text") !== null)) try { root.getElementById("warning-1-text").textContent = `${details[1].contents}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-2-text") !== null)) try { root.getElementById("warning-2-text").textContent = `${details[2].contents}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-3-text") !== null)) try { root.getElementById("warning-3-text").textContent = `${details[3].contents}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-4-text") !== null)) try { root.getElementById("warning-4-text").textContent = `${details[4].contents}` } catch(e) {}
      if (this.config.entity_warninginfo && (root.getElementById("warning-5-text") !== null)) try { root.getElementById("warning-5-text").textContent = `${details[5].contents}` } catch(e) {}
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
