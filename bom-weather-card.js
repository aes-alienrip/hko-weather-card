// #### Add card info to console
console.info(
  `%cGENERIC-WEATHER-CARD\n%cVersion 0.90a       `,
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
// ##### Get the Lit and HTML classes from an already defined HA Lovelace class
// #####
var Lit = Lit || Object.getPrototypeOf(customElements.get("ha-panel-lovelace") || customElements.get('hui-view'));
var html = Lit.prototype.html;

// #####
// ##### Custom Card Definition begins
// #####

class HKOWeatherCard extends Lit {

// #####
// ##### Define Render Template
// #####

  render() {
//  Handle Configuration Flags
//    var icons = this.config.static_icons ? "static" : "animated";
    var currentText = this.config.entity_current_text ? html`<span class="currentText" id="current-text">${this._hass.states[this.config.entity_current_text].state}</span>` : ``;
    var apparentTemp = this.config.entity_apparent_temp ? html`<span class="apparent">${this.localeText.feelsLike} <span id="apparent-text">${this.current.apparent}</span> ${this.getUOM("temperature")}</span>` : ``;
    var summary = this.config.entity_daily_summary ? html`${this._hass.states[this.config.entity_daily_summary].state}` : ``;
    var separator = this.config.show_separator ? html`<hr class=line>` : ``;
    var uv_alert = this.config.entity_uv_alert ? html`${this._hass.states[this.config.entity_uv_alert].state}` : ``;
    var fire_danger = this.config.entity_fire_danger ? html`${this._hass.states[this.config.entity_fire_danger].state}` : ``;

// Build HTML
    return html`
      <style>
      ${this.style()}
      </style>
      <ha-card class = "card">
        <span class="icon bigger" id="icon-bigger" style="background: none, url(${this._hass.hassUrl("/local/icons/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this.current.conditions] + ".svg")}) no-repeat; background-size: contain;">${this.current.conditions}</span>
        <span class="temp" id="temperature-text">${this.current.temperature}</span><span class="tempc">${this.getUOM('temperature')}</span>
        ${currentText}
        ${apparentTemp}
        ${separator}
        <span>
          <ul class="variations">
            <li>
              ${this.getSlot().l1}
              ${this.getSlot().l2}
              ${this.getSlot().l3}
              ${this.getSlot().l4}
              ${this.getSlot().l5}
            </li>
            <li>
              ${this.getSlot().r1}
              ${this.getSlot().r2}
              ${this.getSlot().r3}
              ${this.getSlot().r4}
              ${this.getSlot().r5}
            </li>
          </ul>
        </span>
            <div class="forecast clear">
              ${this.forecast.map(daily => html`
                <div class="day fcasttooltip">
                  <span class="dayname" id="fcast-date-${daily.dayIndex}">${(daily.date).toLocaleDateString(this.config.locale,{month: 'numeric', day: 'numeric'})}</span><br>
                  <span class="dayname" id="fcast-weekday-${daily.dayIndex}">${(daily.date).toLocaleDateString(this.config.locale,{weekday: 'short'})}</span>
                  <br><i class="icon" id="fcast-icon-${daily.dayIndex}" style="background: none, url(${this._hass.hassUrl("/local/icons/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this._hass.states[daily.condition].state] + ".svg").replace("-night", "-day")}) no-repeat; background-size: contain;"></i>
                  ${this.config.old_daily_format ? html`<br><span class="highTemp" id="fcast-high-${daily.dayIndex}">${Math.round(this._hass.states[daily.temphigh].state)}${this.getUOM("temperature")}</span>
                                                        <br><span class="lowTemp" id="fcast-low-${daily.dayIndex}">${Math.round(this._hass.states[daily.templow].state)}${this.getUOM("temperature")}</span>` : this.config.tempformat ==="highlow" ? 
                                                   html`<br><span class="highTemp" id="fcast-high-${daily.dayIndex}">${Math.round(this._hass.states[daily.temphigh].state)}</span> / <span class="lowTemp" id="fcast-low-${daily.dayIndex}">${Math.round(this._hass.states[daily.templow].state)}${this.getUOM("temperature")}</span>` :
                                                   html`<br><span class="lowTemp" id="fcast-low-${daily.dayIndex}">${Math.round(this._hass.states[daily.templow].state)}</span> / <span class="highTemp" id="fcast-high-${daily.dayIndex}">${Math.round(this._hass.states[daily.temphigh].state)}${this.getUOM("temperature")}</span>`}
                  ${this.config.entity_pop_1 && this.config.entity_pop_2 && this.config.entity_pop_3 && this.config.entity_pop_4 && this.config.entity_pop_5 ? html`<br><span class="pop" id="fcast-pop-${daily.dayIndex}">${this._hass.states[daily.pop].state}</span>` : ``}
                  ${this.config.entity_pos_1 && this.config.entity_pos_2 && this.config.entity_pos_3 && this.config.entity_pos_4 && this.config.entity_pos_5 ? html`<br><span class="pos" id="fcast-pos-${daily.dayIndex}">${this._hass.states[daily.pos].state} </span><span class="unit"> ${this.getUOM('precipitation')}</span>` : ``}
                  <div class="fcasttooltiptext" id="fcast-summary-${daily.dayIndex}">${ this.config.tooltips ? this._hass.states[daily.summary].state : ""}</div>
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

  slotValue(slot,value){
    var sunNext = this.config.alt_sun_next ? html`<li><span id="alt-sun-next">${this._hass.states[this.config.alt_sun_next].state}</span></li>` : this.config.entity_sun ? this.sunSet.next : "";
    var sunFollowing = this.config.alt_sun_following ? html`<li><span id="alt-sun-following">${this._hass.states[this.config.alt_sun_following].state}</span></li>` : this.config.entity_sun ? this.sunSet.following : "";
    var daytimeHigh = this.config.alt_daytime_high ? html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-high"></ha-icon></span><span id="alt-daytime-high">${this._hass.states[this.config.alt_daytime_high].state}</span></li>` : this.config.entity_daytime_high ? html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-high"></ha-icon></span>${this.localeText.maxToday} <span id="daytime-high-text">${Math.round(this._hass.states[this.config.entity_daytime_high].state)}</span><span> ${this.getUOM('temperature')}</span></li>` : ``;
    var daytimeLow = this.config.entity_daytime_low ? html`<li><span class="ha-icon"><ha-icon icon="mdi:thermometer-low"></ha-icon></span>${this.localeText.minToday} <span id="daytime-low-text">${Math.round(this._hass.states[this.config.entity_daytime_low].state)}</span><span> ${this.getUOM('temperature')}</span></li>` : ``;
    var intensity = this.config.entity_pop_intensity && !this.config.entity_pop_intensity_rate ? html`<span id="intensity-text"> - ${Number(this._hass.states[this.config.entity_pop_intensity].state).toLocaleString()}</span><span class="unit"> ${this.getUOM('precipitation')}</span>` : this.config.entity_pop_intensity_rate && !this.config.entity_pop_intensity ? html`<span id="intensity-text"> - ${Number(this._hass.states[this.config.entity_pop_intensity_rate].state).toLocaleString()}</span><span class="unit"> ${this.getUOM('intensity')}</span>` : ` invalid`;
    var pop = this.config.alt_pop ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="alt-pop">${this._hass.states[this.config.alt_pop].state}</span></li>` : this.config.entity_pop ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">${Math.round(this._hass.states[this.config.entity_pop].state)}</span><span class="unit"> %</span><span>${intensity}</span></li>` : ``;
    var popforecast = this.config.alt_pop ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="alt-pop">${this._hass.states[this.config.alt_pop].state}</span></li>` : this.config.entity_pop && this.config.entity_possible_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span><span id="pop-text">${Math.round(this._hass.states[this.config.entity_pop].state)}</span><span class="unit"> %</span><span> - <span id="pop-text-today">${this._hass.states[this.config.entity_possible_today].state}</span></span><span class="unit"> ${this.getUOM('precipitation')}</span></li>` : ``;
    var possibleToday = this.config.entity_possible_today ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span>${this.localeText.posToday} <span id="possible_today-text">${this._hass.states[this.config.entity_possible_today].state}</span><span class="unit"> ${this.getUOM('precipitation')}</span></li>` : ``;
    var possibleTomorrow = this.config.entity_pos_1 ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-rainy"></ha-icon></span>${this.localeText.posTomorrow} <span id="possible_tomorrow-text">${this._hass.states[this.config.entity_pos_1].state}</span><span class="unit"> ${this.getUOM('precipitation')}</span></li>` : ``;
    var visibility = this.config.alt_visibility ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span><span id="alt-visibility">${this._hass.states[this.config.alt_visibility].state}</span></li>` : this.config.entity_visibility ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span><span id="visibility-text">${this.current.visibility}</span><span class="unit"> ${this.getUOM('length')}</span></li>` : ``;
    var windBearing = this.config.entity_wind_bearing ? html`<span id="wind-bearing-text">${this.current.windBearing}</span>` : ``;
    var windBearingKt = this.config.entity_wind_bearing ? html`<span id="wind-bearing-kt-text">${this.current.windBearingKt}</span>` : ``;
    var beaufortRating = this.config.entity_wind_speed ? html`<span id="beaufort-text">${this.current.beaufort}</span>` : ``;
    var beaufortRatingKt = this.config.entity_wind_speed_kt ? html`<span id="beaufort-text-kt">${this.current.beaufortkt}</span>` : ``;
    var wind = this.config.alt_wind ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span id="alt-wind">${this._hass.states[this.config.alt_wind].state}</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed && this.config.entity_wind_gust ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span>${beaufortRating}</span><span>${windBearing}</span><span id="wind-speed-text"> ${this.current.windSpeed}</span><span class="unit"> ${this.getUOM('length')}/h</span><span id="wind-gust-text"> (Gust ${this.current.windGust}</span><span class="unit"> ${this.getUOM('length')}/h)</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span>${beaufortRating}</span><span>${windBearing}</span><span id="wind-speed-text"> ${this.current.windSpeed}</span><span class="unit"> ${this.getUOM('length')}/h</span></li>` : ``;
    var wind_kt = this.config.entity_wind_bearing && this.config.entity_wind_speed_kt && this.config.entity_wind_gust_kt ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span>${beaufortRatingKt}</span><span>${windBearingKt}</span><span id="wind-speed-text-kt"> ${this.current.windSpeedKt}</span><span class="unit"> kt</span><span id="wind-gust-text-kt"> (Gust ${this.current.windGustKt}</span><span class="unit"> kt)</span></li>` : this.config.entity_wind_bearing && this.config.entity_wind_speed_kt ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span><span>${beaufortRatingKt}</span><span>${windBearingKt}</span><span id="wind-speed-text-kt"> ${this.current.windSpeedKt}</span><span class="unit"> kt</span></li>` : ``;
    var humidity = this.config.alt_humidity ? html`<li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span><span id="alt-humidity">${this._hass.states[this.config.alt_humidity].state}</span></li>` : this.config.entity_humidity ? html`<li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span>${this.localeText.Humidity} <span id="humidity-text">${this.current.humidity}</span><span class="unit"> %</span></li>` : ``;
    var pressure = this.config.alt_pressure ? html`<li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span><span id="alt-pressure">${this._hass.states[this.config.alt_pressure].state}</span></li>` : this.config.entity_pressure ? html`<li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span><span id="pressure-text">${this.current.pressure}</span><span class="unit"> ${this.getUOM('air_pressure')}</span></li>` : ``;
    var uv_summary = this.config.entity_uv_alert_summary ? html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunny"></ha-icon></span>${this.localeText.uvRating} <span id="daytime-uv-text">${this._hass.states[this.config.entity_uv_alert_summary].state}</span></li>` : ``;
    var fire_summary = this.config.entity_fire_danger_summary ? html`<li><span class="ha-icon"><ha-icon icon="mdi:fire"></ha-icon></span>${this.localeText.fireDanger} <span id="daytime-firedanger-text">${this._hass.states[this.config.entity_fire_danger_summary].state}</span></li>` : ``;

    switch (value){
      case 'pop': return pop;
      case 'popforecast': return popforecast;
      case 'possible_today': return possibleToday;
      case 'possible_tomorrow': return possibleTomorrow;
      case 'humidity': return humidity;
      case 'pressure': return pressure;
      case 'sun_following': return sunFollowing;
      case 'daytime_high': return daytimeHigh;
      case 'daytime_low': return daytimeLow;
      case 'uv_summary' : return uv_summary;
      case 'fire_summary' : return fire_summary;
      case 'wind': return wind;
      case 'wind_kt': return wind_kt;
      case 'visibility': return visibility;
      case 'sun_next': return sunNext;
      case 'empty': return html`&nbsp;`;
      case 'remove': return ``;
    }

    // If no value can be matched pass back a default for the slot
    switch (slot){
      case 'l1': return sunNext;
      case 'l2': return daytimeHigh;
      case 'l3': return daytimeLow;
      case 'l4': return wind;
      case 'l5': return pressure;
      case 'r1': return sunFollowing;
      case 'r2': return humidity;
      case 'r3': return pop;
      case 'r4': return uv_summary;
      case 'r5': return fire_summary;

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
          Humidity: "濕度"
        }
      default :
        return {
          feelsLike: "Feels like",
          maxToday: "Today's High",
          minToday: "Today's Low",
          posToday: "Forecast",
          posTomorrow: "Fore Tom",
          uvRating: "UV",
          fireDanger: "Fire",
          Humidity: "Humidity"
        }
    }
  }

// #####
// ##### dayOrNight : returns day or night depending on the position of the sun.
// #####

  get dayOrNight() {
    const transformDayNight = { "below_horizon": "night", "above_horizon": "day", };
    return this.config.entity_sun ? transformDayNight[this._hass.states[this.config.entity_sun].state] : 'day';
  }


// #####
// ##### weatherIcons: returns icon names based on current conditions text
// ##### remove old_icon option in customization flags
// #####

  get weatherIcons() {
    var sunny = `sunny-day`;
    var mostly_clear = `fair-${this.dayOrNight}`;
    var partlycloudy_day = `cloudy-day-3`;
    var light_showers = `rainy-1`;
    var showers = `rainy-3`;
    var cloudy = `cloudy`;
    var overcast = `overcast`;
    var light_rain = `rainy-4`;
    var rainy = `rainy-5`;
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
                                        temphigh: this.config.entity_forecast_high_temp_1,
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

  get current() {
    var conditions = this._hass.states[this.config.entity_current_conditions].state;
    var humidity = this.config.entity_humidity ? Number(this._hass.states[this.config.entity_humidity].state).toLocaleString() : 0;
    var pressure = this.config.entity_pressure ? Number(Math.round(this._hass.states[this.config.entity_pressure].state)).toLocaleString() : 0;
    var temperature = !this.config.show_decimals ? Number(Math.round(this._hass.states[this.config.entity_temperature].state)).toLocaleString() : Number(this._hass.states[this.config.entity_temperature].state).toLocaleString() ;
    var visibility = this.config.entity_visibility ? Number(this._hass.states[this.config.entity_visibility].state).toLocaleString() : 0;
    var windBearing = this.config.entity_wind_bearing ? isNaN(this._hass.states[this.config.entity_wind_bearing].state) ? this._hass.states[this.config.entity_wind_bearing].state : this.windDirections[(Math.round((this._hass.states[this.config.entity_wind_bearing].state / 360) * 16))] : 0;
    var windBearingKt = this.config.entity_wind_bearing ? isNaN(this._hass.states[this.config.entity_wind_bearing].state) ? this._hass.states[this.config.entity_wind_bearing].state : this.windDirections[(Math.round((this._hass.states[this.config.entity_wind_bearing].state / 360) * 16))] : 0;
    var windSpeed = this.config.entity_wind_speed ? Math.round(this._hass.states[this.config.entity_wind_speed].state) : 0;
    var windGust = this.config.entity_wind_gust ? Math.round(this._hass.states[this.config.entity_wind_gust].state) : 0;
    var windSpeedKt = this.config.entity_wind_speed_kt ? Math.round(this._hass.states[this.config.entity_wind_speed_kt].state) : 0;
    var windGustKt = this.config.entity_wind_gust_kt ? Math.round(this._hass.states[this.config.entity_wind_gust_kt].state) : 0;
    var apparent = (this.config.entity_apparent_temp && !this.config.show_decimals) ? Math.round(this._hass.states[this.config.entity_apparent_temp].state) : (this.config.entity_apparent_temp && this.config.show_decimals) ? Number(this._hass.states[this.config.entity_apparent_temp].state).toLocaleString() : 0;
    var beaufort = this.config.show_beaufort ? html`Bft: ${this.beaufortWind} - ` : ``;
    var beaufortkt = this.config.show_beaufort ? html`Bft: ${this.beaufortWindKt} - ` : ``;

    return {
      'conditions': conditions,
      'humidity': humidity,
      'pressure': pressure,
      'temperature': temperature,
      'visibility': visibility,
      'windBearing': windBearing,
      'windBearingKt': windBearingKt,
      'windSpeed': windSpeed,
      'windGust': windGust,
      'windSpeedKt': windSpeedKt,
      'windGustKt': windGustKt,
      'apparent' : apparent,
      'beaufort' : beaufort,
      'beaufortkt' : beaufortkt,
    }
  }

// #####
// ##### sunSetAndRise: returns set and rise information
// #####

get sunSet() {
    var nextSunSet;
    var nextSunRise;
    if (this.config.time_format) {
      nextSunSet = new Date(this._hass.states[this.config.entity_sun].attributes.next_setting).toLocaleTimeString(this.config.locale, {hour: '2-digit', minute:'2-digit',hour12: this.is12Hour});
      nextSunRise = new Date(this._hass.states[this.config.entity_sun].attributes.next_rising).toLocaleTimeString(this.config.locale, {hour: '2-digit', minute:'2-digit',hour12: this.is12Hour});
    }
    else {
      nextSunSet = new Date(this._hass.states[this.config.entity_sun].attributes.next_setting).toLocaleTimeString(this.config.locale, {hour: '2-digit', minute:'2-digit'});
      nextSunRise = new Date(this._hass.states[this.config.entity_sun].attributes.next_rising).toLocaleTimeString(this.config.locale, {hour: '2-digit', minute:'2-digit'});
    }
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    if (this._hass.states[this.config.entity_sun].state == "above_horizon" ) {
      nextSunRise = nextDate.toLocaleDateString(this.config.locale,{weekday: 'short'}) + " " + nextSunRise;
      return {
      'next': html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunset-down"></ha-icon></span><span id="sun-next-text">${nextSunSet}</span></li>`,
      'following': html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunset-up"></ha-icon></span><span id="sun-following-text">${nextSunRise}</span></li>`,
      'nextText': nextSunSet,
      'followingText': nextSunRise,
      };
    } else {
      if (new Date().getDate() != new Date(this._hass.states[this.config.entity_sun].attributes.next_rising).getDate()) {
        nextSunRise = nextDate.toLocaleDateString(this.config.locale,{weekday: 'short'}) + " " + nextSunRise;
        nextSunSet = nextDate.toLocaleDateString(this.config.locale,{weekday: 'short'}) + " " + nextSunSet;
      }
      return {
      'next': html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunset-up"></ha-icon></span><span id="sun-next-text">${nextSunRise}</span></li>`,
      'following': html`<li><span class="ha-icon"><ha-icon icon="mdi:weather-sunset-down"></ha-icon></span><span id="sun-following-text">${nextSunSet}</span></li>`,
      'nextText': nextSunRise,
      'followingText': nextSunSet,
      };
    }
}


// #####
// ##### beaufortWind - returns the wind speed on the beaufort scale
// ##### reference https://en.wikipedia.org/wiki/Beaufort_scale
// #####

get beaufortWind() {
  if (this.config.entity_wind_speed) {
    switch (this._hass.states[this.config.entity_wind_speed].attributes.unit_of_measurement) {
      case 'mph':
        if (this._hass.states[this.config.entity_wind_speed].state >= 73) return 12;
        if (this._hass.states[this.config.entity_wind_speed].state >= 64) return 11;
        if (this._hass.states[this.config.entity_wind_speed].state >= 55) return 10;
        if (this._hass.states[this.config.entity_wind_speed].state >= 47) return 9;
        if (this._hass.states[this.config.entity_wind_speed].state >= 39) return 8;
        if (this._hass.states[this.config.entity_wind_speed].state >= 32) return 7;
        if (this._hass.states[this.config.entity_wind_speed].state >= 25) return 6;
        if (this._hass.states[this.config.entity_wind_speed].state >= 19) return 5;
        if (this._hass.states[this.config.entity_wind_speed].state >= 13) return 4;
        if (this._hass.states[this.config.entity_wind_speed].state >= 8) return 3;
        if (this._hass.states[this.config.entity_wind_speed].state >= 4) return 2;
        if (this._hass.states[this.config.entity_wind_speed].state >= 1) return 1;
      case 'm/s':
        if (this._hass.states[this.config.entity_wind_speed].state >= 32.7) return 12;
        if (this._hass.states[this.config.entity_wind_speed].state >= 28.5) return 11;
        if (this._hass.states[this.config.entity_wind_speed].state >= 24.5) return 10;
        if (this._hass.states[this.config.entity_wind_speed].state >= 20.8) return 9;
        if (this._hass.states[this.config.entity_wind_speed].state >= 17.2) return 8;
        if (this._hass.states[this.config.entity_wind_speed].state >= 13.9) return 7;
        if (this._hass.states[this.config.entity_wind_speed].state >= 10.8) return 6;
        if (this._hass.states[this.config.entity_wind_speed].state >= 8) return 5;
        if (this._hass.states[this.config.entity_wind_speed].state >= 5.5) return 4;
        if (this._hass.states[this.config.entity_wind_speed].state >= 3.4) return 3;
        if (this._hass.states[this.config.entity_wind_speed].state >= 1.6) return 2;
        if (this._hass.states[this.config.entity_wind_speed].state >= 0.5) return 1;
      default: // Assume km/h
        if (this._hass.states[this.config.entity_wind_speed].state >= 118) return 12;
        if (this._hass.states[this.config.entity_wind_speed].state >= 103) return 11;
        if (this._hass.states[this.config.entity_wind_speed].state >= 89) return 10;
        if (this._hass.states[this.config.entity_wind_speed].state >= 75) return 9;
        if (this._hass.states[this.config.entity_wind_speed].state >= 62) return 8;
        if (this._hass.states[this.config.entity_wind_speed].state >= 50) return 7;
        if (this._hass.states[this.config.entity_wind_speed].state >= 39) return 6;
        if (this._hass.states[this.config.entity_wind_speed].state >= 29) return 5;
        if (this._hass.states[this.config.entity_wind_speed].state >= 20) return 4;
        if (this._hass.states[this.config.entity_wind_speed].state >= 12) return 3;
        if (this._hass.states[this.config.entity_wind_speed].state >= 6) return 2;
        if (this._hass.states[this.config.entity_wind_speed].state >= 2) return 1;
    }
  }
  return 0;
}

get beaufortWindKt() {
  if (this.config.entity_wind_speed_kt) {
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 64) return 12;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 56) return 11;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 48) return 10;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 41) return 9;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 34) return 8;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 28) return 7;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 22) return 6;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 17) return 5;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 11) return 4;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 7) return 3;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 4) return 2;
      if (this._hass.states[this.config.entity_wind_speed_kt].state >= 1) return 1;
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
  var tempRightPos = this.config.temp_right_pos || "0.85em";
  var tempUOMTopMargin = this.config.temp_uom_top_margin || "-3px";
  var tempUOMRightMargin = this.config.temp_uom_right_margin || "4px";
  var apparentTopMargin = this.config.apparent_top_margin || "45px";
  var apparentRightPos =  this.config.apparent_right_pos || "1em";
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

      .line {
        margin-top: ${separatorTopMargin};
        margin-left: 1em;
        margin-right: 1em;
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
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        padding: 0.2em;
        margin-top: ${currentDataTopMargin};
      }

      .unit {
        font-size: 0.8em;
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
        return lengthUnit === 'km' ? 'hPa' : 'mbar';
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
    now.toLocaleString('en-US', { timeZone: 'America/New_York' });
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
      root.getElementById("temperature-text").textContent = `${this.current.temperature}`;
      root.getElementById("icon-bigger").textContent = `${this.current.conditions}`;
      root.getElementById("icon-bigger").style.backgroundImage = `none, url(${this._hass.hassUrl("/local/icons/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this.current.conditions] + ".svg")})`;

// Forecast blocks
      this.forecast.forEach((daily) => {
        root.getElementById("fcast-date-" + daily.dayIndex).textContent = `${(daily.date).toLocaleDateString(this.config.locale,{month: 'numeric', day: 'numeric'})}`;
        root.getElementById("fcast-weekday-" + daily.dayIndex).textContent = `${(daily.date).toLocaleDateString(this.config.locale,{weekday: 'short'})}`;
        root.getElementById("fcast-icon-" + daily.dayIndex).style.backgroundImage = `none, url(${this._hass.hassUrl("/local/icons/weather_icons/" + (this.config.static_icons ? "static" : "animated") + "/" + this.weatherIcons[this._hass.states[daily.condition].state] + ".svg").replace("-night", "-day")})`;
        root.getElementById("fcast-high-" + daily.dayIndex).textContent = `${Math.round(this._hass.states[daily.temphigh].state)}${this.config.tempformat ? "" : this.getUOM("temperature")}`;
        root.getElementById("fcast-low-" + daily.dayIndex).textContent = `${Math.round(this._hass.states[daily.templow].state)}${this.config.old_daily_format ? this.getUOM("temperature") : this.config.tempformat ? this.getUOM("temperature") : ""}`;
        if (this.config.entity_pop_1 && this.config.entity_pop_2 && this.config.entity_pop_3 && this.config.entity_pop_4 && this.config.entity_pop_5) root.getElementById("fcast-pop-" + daily.dayIndex).textContent = `${this._hass.states[daily.pop].state}`;
        if (this.config.entity_pos_1 && this.config.entity_pos_2 && this.config.entity_pos_3 && this.config.entity_pos_4 && this.config.entity_pos_5) { root.getElementById("fcast-pos-" + daily.dayIndex).textContent = `${this._hass.states[daily.pos].state}`}
        root.getElementById("fcast-summary-" + daily.dayIndex).textContent = `${this._hass.states[daily.summary].state}`;
     });

// Optional Entities
      if (this.config.entity_current_text) try { root.getElementById("current-text").textContent = `${this._hass.states[this.config.entity_current_text].state}` } catch(e) {}
      if (this.config.entity_apparent_temp) try { root.getElementById("apparent-text").textContent = `${this.current.apparent}` } catch(e) {}
      if (this.config.entity_wind_bearing && !this.config.alt_wind) try { root.getElementById("wind-bearing-text").textContent = `${this.current.windBearing}` } catch(e) {}
      if (this.config.entity_wind_bearing && !this.config.alt_wind) try { root.getElementById("wind-bearing-kt-text").textContent = `${this.current.windBearingKt}` } catch(e) {}
      if (this.config.entity_wind_speed && !this.config.alt_wind) try { root.getElementById("wind-speed-text").textContent = ` ${this.current.windSpeed}` } catch(e) {}
      if (this.config.entity_wind_gust && !this.config.alt_wind) try { root.getElementById("wind-gust-text").textContent = ` (Gust ${this.current.windGust}` } catch(e) {}
      if (this.config.entity_wind_speed_kt && !this.config.alt_wind) try { root.getElementById("wind-speed-text-kt").textContent = ` ${this.current.windSpeedKt}` } catch(e) {}
      if (this.config.entity_wind_gust_kt && !this.config.alt_wind) try { root.getElementById("wind-gust-text-kt").textContent = ` (Gust ${this.current.windGustKt}` } catch(e) {}
      if (this.config.entity_visibility && !this.config.alt_visibility) try { root.getElementById("visibility-text").textContent = `${this.current.visibility}` } catch(e) {}
      if (this.config.entity_pop_intensity && !this.config.entity_pop_intensity_rate) try { root.getElementById("intensity-text").textContent = ` - ${Number(this._hass.states[this.config.entity_pop_intensity].state).toLocaleString()}` } catch(e) {}
      if (this.config.entity_pop_intensity_rate && !this.config.entity_pop_intensity) try { root.getElementById("intensity-text").textContent = ` - ${Number(this._hass.states[this.config.entity_pop_intensity_rate].state).toLocaleString()}` } catch(e) {}
      if (this.config.entity_pop && !this.config.alt_pop) try { root.getElementById("pop-text").textContent = `${Math.round(this._hass.states[this.config.entity_pop].state)}` } catch(e) {}
      if (this.config.entity_pop && this.config.entity_possible_today && !this.config.alt_pop) try { root.getElementById("pop-text-today").textContent = `${this._hass.states[this.config.entity_possible_today].state}` } catch(e) {}
      if (this.config.entity_daytime_high && !this.config.alt_daytime_high) try { root.getElementById("daytime-high-text").textContent = `${Math.round(this._hass.states[this.config.entity_daytime_high].state)}` } catch(e) {}
      if (this.config.entity_daytime_low) try { root.getElementById("daytime-low-text").textContent = `${Math.round(this._hass.states[this.config.entity_daytime_low].state)}` } catch(e) {}
      if (this.config.entity_sun && !this.config.alt_sun_next) try { root.getElementById("sun-next-text").textContent = `${this.sunSet.nextText}` } catch(e) {}
      if (this.config.entity_sun && !this.config.alt_sun_following) try { root.getElementById("sun-following-text").textContent = `${this.sunSet.followingText}` } catch(e) {}
      if (this.config.entity_daily_summary) try {
        root.getElementById("daily-summary-text").textContent = 
          `${this._hass.states[this.config.entity_daily_summary].state} ` + 
          (this.config.entity_uv_alert ?    `${this._hass.states[this.config.entity_uv_alert].state} `    : ``) + 
          (this.config.entity_fire_danger ? `${this._hass.states[this.config.entity_fire_danger].state}` : ``)
          } catch(e) {}
      if (this.config.entity_pressure && !this.config.alt_pressure) try { root.getElementById("pressure-text").textContent = `${this.current.pressure}` } catch(e) {}
      if (this.config.entity_humidity && !this.config.alt_humidity) try { root.getElementById("humidity-text").textContent = `${this.current.humidity}` } catch(e) {}
      if (this.config.show_beaufort  && !this.config.alt_wind) try { root.getElementById("beaufort-text").textContent =  `Bft: ${this.beaufortWind} - ` } catch(e) {}
      if (this.config.show_beaufort  && !this.config.alt_wind) try { root.getElementById("beaufort-text-kt").textContent =  `Bft: ${this.beaufortWindKt} - ` } catch(e) {}
      if (this.config.entity_possible_today) try { root.getElementById("possible_today-text").textContent = `${this._hass.states[this.config.entity_possible_today].state}` } catch(e) {}
      if (this.config.entity_pos_1) try { root.getElementById("possible_tomorrow-text").textContent = `${this._hass.states[this.config.entity_pos_1].state}` } catch(e) {}

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
