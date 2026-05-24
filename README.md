[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/custom-components/hacs) ![GitHub](https://img.shields.io/github/license/aes-alienrip/hko-weather-card?style=for-the-badge) ![GitHub last commit](https://img.shields.io/github/last-commit/aes-alienrip/hko-weather-card?style=for-the-badge) ![Maintenance](https://img.shields.io/maintenance/yes/2025?style=for-the-badge)
# Hong Kong Observatory Weather Card
![hko_weather_card](https://github.com/aes-alienrip/hko-weather-card/assets/73251414/3ca0d5d4-02e1-42cb-a1e2-d7e315a6026d)

## Buy me a coffee

Buy me a coffee to support my work on this lovelace card

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://www.buymeacoffee.com/aesalienrip)

## IMPORTANT CHANGES

This is a weather card that works with **Hong Kong Observatory ONLY**

This card is a modification of a fork of [DavidFW1960/bom-weather-card](https://github.com/DavidFW1960/bom-weather-card)

This card provides MANY additional features as well as compatability with later versions of home assistant.
New features:
- Lit 3
- Only use Day time icons for forecast for future days (days 1-5)
- More icons
- Adds Locale customisation for number formats
- Added to card-picker in Lovelace
- Added option to show minimum or maximum first in forecast
- Added option to show 1 decimal place to temperatures, apparent temperature, todays max/min, and pressure
- Show rainfall as an intensity or absolute number
- Removed leading zeros if 12hr time
- Added Wind Gust
- Can use different icon sets
- Added extra (8th) row of slots
- Added slots (optional) for UV ratings
- Added possibility of rainfall to forecast
- Added Warning Icon and Info
- Added Tropical Cyclone Warning Icon

The Weather Card provides current and forecast weather conditions using HA sensors. You configure the card by passing in sensor entities from the weather component.

The card is very customizable.  You can configure many aspects of it's look and feel as well as which specific content to show by passing in customization flags and defining optional sensors.  Content can also be rearranged if desired.

Hovering over a forecast day will display the daily weather summary in a tooltip popup if that option has been enabled.

# **Installation**
--------------------------
## Use HACS
Add this repo https://github.com/aes-alienrip/hko-weather-card

Install card from HACS as per other plugins. Note that you must add this card as a module to the resources section as per the instructions when you install the card.

#### Inside the base configuration file add the following entry:
~~~~
homeassistant:
  packages: !include_dir_named www/community/hko-weather-card/sensor/zh
~~~~
![config_packages](https://github.com/aes-alienrip/hko-weather-card/assets/73251414/08dc5e32-8ff9-4a34-b140-570ffca22de3)

#### For English User:
~~~~
homeassistant:
  packages: !include_dir_named www/community/hko-weather-card/sensor/en
~~~~

#### File Structure
~~~~
└── ...
└── configuration.yaml
└── www
    └── community
        └── hko-weather-card
            └── sensor
		└── en
     		     └── input_select_en.yaml
     		     └── rest_en.yaml
     		     └── template_en.yaml
		└── zh
     		     └── input_select.yaml
     		     └── rest.yaml
     		     └── template.yaml
            └── weather_icons
		└── animated
		└── static
            └── hko-weather-card.js
            └── hko-weather-card.js.gz
~~~~

Installation is done. You must still configure the yaml manually.

# **Configuration**
--------------------------
1. Load new YAML configurations in Quick reload
![restart-home-assistant](https://github.com/aes-alienrip/hko-weather-card/assets/73251414/8b016035-cb5b-4ba0-89c7-648612342221)

2. Select your nearby Weather Station ([Temperature](https://www.hko.gov.hk/tc/wxinfo/ts/index.htm), [Humidity](https://www.hko.gov.hk/tc/wxinfo/ts/index_rh.htm), [Pressure](https://www.hko.gov.hk/tc/wxinfo/ts/index_pre.htm), [Wind](https://www.hko.gov.hk/tc/wxinfo/ts/index_wind.htm), [Rainfall](https://upload.wikimedia.org/wikipedia/commons/f/fc/Map_of_Hong_Kong_18_Districts_zh.svg) / [Rainfall_en](https://upload.wikimedia.org/wikipedia/commons/f/fe/Map_of_Hong_Kong_18_Districts_en.svg)) from Input Select helper<br>
   Developer Tools -> STATES -> Entity -> Search for "input_select.hko"<br>
![HKO_Weather_Station](https://github.com/aes-alienrip/hko-weather-card/assets/73251414/2d68dffc-3cc7-458b-bf3f-b00bfbf5b002)<br>

3. Add the card definition: You can add this card from the card picker but need to configure the entities and flags in YAML. There are required / optional and flag entries.
This card has been added to the custom-card-picker in Lovelace
![image](card-picker.png)


**An example configuration is in [lovelace.yaml](https://github.com/aes-alienrip/hko-weather-card/blob/master/lovelace.yaml) - this can be pasted into the manual card configuration in the GUI editor**
If you paste it in the raw editor or in a yaml file, take care with the indenting.

Required entries must be present 
in your configuration.  The card will not work at all if any of these lines are missing.
~~~~
type: custom:hko-weather-card
locale: zh-hk
time_format: locale
refresh_interval: 30
static_icons: false
tooltips: true
show_separator: true
hide_slot_section: false
hide_forecast_section: false
hide_summary_section: false
show_decimals: false
show_decimals_apparent: false
show_decimals_today: true
show_decimals_pressure: false
use_old_column_format: true
entity_sun: sun.sun
entity_warnsum: sensor.hko_warnsum
entity_warninginfo: sensor.hko_warninginfo
entity_temperature: sensor.hko_temperature
entity_apparent_temp: sensor.hko_apparent_temp
entity_daytime_high: sensor.hko_temperature_max
entity_daytime_low: sensor.hko_temperature_min
entity_humidity: sensor.hko_humidity
entity_wind_bearing: sensor.hko_wind_bearing
entity_wind_speed: sensor.hko_wind_speed
entity_wind_gust: sensor.hko_wind_gust
entity_uv_alert_summary: sensor.hko_uvindex
entity_pressure: sensor.hko_pressure
entity_rain_today: sensor.hko_rainfall
entity_current_conditions: sensor.hko_forecast_icon
entity_forecast_icon_1: sensor.hko_forecast_icon_0
entity_forecast_icon_2: sensor.hko_forecast_icon_1
entity_forecast_icon_3: sensor.hko_forecast_icon_2
entity_forecast_icon_4: sensor.hko_forecast_icon_3
entity_forecast_icon_5: sensor.hko_forecast_icon_4
entity_forecast_low_temp_1: sensor.hko_forecast_min_temp_0
entity_forecast_low_temp_2: sensor.hko_forecast_min_temp_1
entity_forecast_low_temp_3: sensor.hko_forecast_min_temp_2
entity_forecast_low_temp_4: sensor.hko_forecast_min_temp_3
entity_forecast_low_temp_5: sensor.hko_forecast_min_temp_4
entity_forecast_high_temp_1: sensor.hko_forecast_max_temp_0
entity_forecast_high_temp_2: sensor.hko_forecast_max_temp_1
entity_forecast_high_temp_3: sensor.hko_forecast_max_temp_2
entity_forecast_high_temp_4: sensor.hko_forecast_max_temp_3
entity_forecast_high_temp_5: sensor.hko_forecast_max_temp_4
entity_daily_summary: sensor.hko_forecast_summary
entity_summary_1: sensor.hko_forecast_summary_0
entity_summary_2: sensor.hko_forecast_summary_1
entity_summary_3: sensor.hko_forecast_summary_2
entity_summary_4: sensor.hko_forecast_summary_3
entity_summary_5: sensor.hko_forecast_summary_4
entity_forecast_high_rh_1: sensor.hko_forecast_max_rh_0
entity_forecast_high_rh_2: sensor.hko_forecast_max_rh_1
entity_forecast_high_rh_3: sensor.hko_forecast_max_rh_2
entity_forecast_high_rh_4: sensor.hko_forecast_max_rh_3
entity_forecast_high_rh_5: sensor.hko_forecast_max_rh_4
entity_forecast_low_rh_1: sensor.hko_forecast_min_rh_0
entity_forecast_low_rh_2: sensor.hko_forecast_min_rh_1
entity_forecast_low_rh_3: sensor.hko_forecast_min_rh_2
entity_forecast_low_rh_4: sensor.hko_forecast_min_rh_3
entity_forecast_low_rh_5: sensor.hko_forecast_min_rh_4
entity_pop_1: sensor.hko_forecast_psr_0
entity_pop_2: sensor.hko_forecast_psr_1
entity_pop_3: sensor.hko_forecast_psr_2
entity_pop_4: sensor.hko_forecast_psr_3
entity_pop_5: sensor.hko_forecast_psr_4
~~~~

**Flags**
--------------------------

#### Flags are used to control the look and feel of the card (See below for details)

~~~~
locale: en
static_icons: false
tooltip_bg_color: 'rgb( 75,155,239)'
tooltip_border_color: orange
tooltip_border_width: 3
tooltip_caret_size: 10
tooltip_fg_color: '#fff'
tooltip_left_offset: -12
tooltip_width: 100
tooltips: true
old_daily_format: false
time_format: 24
show_beaufort: true
show_decimals: false
~~~~

--------------------------
| Flag                     | Values                             | Usage                                                                       |
|--------------------------|------------------------------------|-----------------------------------------------------------------------------|
| locale                   | **en** / zh-hk / zh-cn / zh        | Sets locale display of day names and time formats                           |
| time_format              | **locale** / 12 / 24               | Sets the format sunset and sunrise times. locale format is the default.     |
| refresh_interval         | **30** / Integer value             | Sets the number of seconds between card value refreshes                     |
| static_icons             | true / **false**                   | Switches between static (true) and animated (false) icons                   |
| show_separator           | **true** / false                   | Shows separator between Main Section and Slot Section                       |
| separator_top_margin     | **6em** / px or em value           | Sets the top margin of the separator line                                   |
| hide_slot_section        | true / **false**                   | Hide Slot Section, See [Sections](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#sections) for more info                               |
| hide_forecast_section    | true / **false**                   | Hide Forecast Section, See [Sections](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#sections) for more info                           |
| hide_summary_section     | true / **false**                   | Hide Summary Section, See [Sections](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#sections) for more info                            |
| show_decimals            | **false** / true                   | Sets card to render current temperature to 1 decimal place                  | 
| show_decimals_apparent   | **false** / true                   | Sets card to render apparent temperature to 1 decimal place                 |
| show_decimals_today      | **false** / true                   | Sets card to render todays min and max temperatures to 1 decimal place      |
| show_decimals_pressure   | **false** / true                   | Sets card to render pressure to 1 decimal place                             |
| show_beaufort            | true / **false**                   | Shows Beaufort Scale wind information                                       |
| tempformat               | highlow / **noentry**              | Any setting for this flag will trigger the option to show max/min in daily  |
| old_daily_format         | true / **false**                   | Sets the format of the daily high & low temps to be stacked (old format)    |
| use_old_column_format    | false / **true**                   | Moves the right column to the right edge in Slot Section                    |
| slot_l1                  | **sun_next**                       | Sets the value used in current conditions slot l1 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_l2                  | **maxmin_since_midnight**          | Sets the value used in current conditions slot l2 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_l3                  | **wind**                           | Sets the value used in current conditions slot l3 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_l4                  | **pressure**                       | Sets the value used in current conditions slot l4 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_l5                  |                                    | Sets the value used in current conditions slot l5 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_l6                  |                                    | Sets the value used in current conditions slot l6 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_l7                  |                                    | Sets the value used in current conditions slot l7 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_l8                  |                                    | Sets the value used in current conditions slot l8 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_r1                  | **sun_following**                  | Sets the value used in current conditions slot r1 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_r2                  | **humidity**                       | Sets the value used in current conditions slot r2 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_r3                  | **uv_summary**                     | Sets the value used in current conditions slot r3 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_r4                  | **rainfall**                       | Sets the value used in current conditions slot l4 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_r5                  |                                    | Sets the value used in current conditions slot r5 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_r6                  |                                    | Sets the value used in current conditions slot r6 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_r7                  |                                    | Sets the value used in current conditions slot r7 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| slot_r8                  |                                    | Sets the value used in current conditions slot r8 : See [Slots](https://github.com/aes-alienrip/hko-weather-card/blob/master/README.md#slots) for more info |
| custom1_icon             | **mdi:help-box** / mdi icon        | Sets the icon to use for slot custom1                                       |
| custom1_value            | **unknown** / sensor               | Sets the sensor to use for the value of slot custom1                        |
| custom1_units            | **""** / string                    | Sets the string to use for the units of slot custom1                        |
| custom2_icon             | **mdi:help-box** / mdi icon        | Sets the icon to use for slot custom2                                       |
| custom2_value            | **unknown** / sensor               | Sets the sensor to use for the value of slot custom2                        |
| custom2_units            | **""** / string                    | Sets the string to use for the units of slot custom2                        |
| custom3_icon             | **mdi:help-box** / mdi icon        | Sets the icon to use for slot custom3                                       |
| custom3_value            | **unknown** / sensor               | Sets the sensor to use for the value of slot custom3                        |
| custom3_units            | **""** / string                    | Sets the string to use for the units of slot custom3                        |
| custom4_icon             | **mdi:help-box** / mdi icon        | Sets the icon to use for slot custom4                                       |
| custom4_value            | **unknown** / sensor               | Sets the sensor to use for the value of slot custom4                        |
| custom4_units            | **""** / string                    | Sets the string to use for the units of slot custom4                        |
| custom5_icon             | **mdi:help-box** / mdi icon        | Sets the icon to use for slot custom5                                       |
| custom5_value            | **unknown** / sensor               | Sets the sensor to use for the value of slot custom5                        |
| custom5_units            | **""** / string                    | Sets the string to use for the units of slot custom5                        |
| custom6_icon             | **mdi:help-box** / mdi icon        | Sets the icon to use for slot custom6                                       |
| custom6_value            | **unknown** / sensor               | Sets the sensor to use for the value of slot custom6                        |
| custom6_units            | **""** / string                    | Sets the string to use for the units of slot custom6                        |
| custom7_icon             | **mdi:help-box** / mdi icon        | Sets the icon to use for slot custom7                                       |
| custom7_value            | **unknown** / sensor               | Sets the sensor to use for the value of slot custom7                        |
| custom7_units            | **""** / string                    | Sets the string to use for the units of slot custom7                        |
| custom8_icon             | **mdi:help-box** / mdi icon        | Sets the icon to use for slot custom8                                       |
| custom8_value            | **unknown** / sensor               | Sets the sensor to use for the value of slot custom8                        |
| custom8_units            | **""** / string                    | Sets the string to use for the units of slot custom8                        |
| temp_top_margin          | **-25px** / px or em value         | Sets the top margin of the Temperature.                                     |
| temp_font_weight         | **300** / numeric value            | Sets the font weight of the Temperature.                                    |
| temp_font_size           | **4em** / em value                 | Sets the font size of the Temperature.                                      |
| temp_right_pos           | **0.7em** / px or em value         | Sets the right position of the Temperature.                                 |
| temp_uom_top_margin      | **-8.8px** / px or em value        | Sets the top margin of the Temperature Unit of Measure.                     |
| temp_uom_right_margin    | **-4px** / px or em value          | Sets the right margin of the Temperature Unit of Measure.                   |
| large_icon_top_margin    | **-3em** / px or em value          | Sets the top margin of the current conditions icon                          |
| large_icon_left_pos      | **0px** / px or em value           | Sets the left position of the current conditions icon                       |
| tcws_style               | og / grey / **noentry**            | Sets the style of tropical cyclone warning icon (Original / Grey / Color)   |
| tcws_size                | **40px** / px or em value          | Sets the size of the tropical cyclone warning icon                          |
| tcws_top_margin          | **40px** / px or em value          | Sets the top margin of the tropical cyclone warning icon                    |
| tcws_left_pos            | **0em** / px or em value           | Sets the left position of the tropical cyclone warning icon                 |
| tcws_left_margin         | **8.2em** / px or em value         | Sets the left margin of the tropical cyclone warning icon                   |
| icon_size                | **55px** / px or em value          | Sets the size of the daily forecast icon                                    |
| current_text_top_margin  | **0.2em** / px or em value         | Sets the top margin of the current text                                     |
| current_text_left_pos    | **0px** / px or em value           | Sets the left position of the current text                                  |
| current_text_font_size   | **2em** / em value                 | Sets the font size of the current text                                      |
| current_text_width       | **100%** / px, em or %             | Sets the width of current text                                              |
| current_text_alignment   | **center** / left, right or center | Sets the alignment of current text                                          |
| current_data_top_margin  | **0.5em** / px or em value         | Sets the top margin of the current data blocks                              |
| topbar_top_margin        | **55px** / px or em value          | Sets the top margin of the topbar (apparent temp and warning icon)          |
| topbar_right_pos         | **0.3em** / px or em value         | Sets the right position of the topbar (apparent temp and warning icon)      |
| topbar_right_margin      | **1em** / px or em value           | Sets the right margin of the topbar (apparent temp and warning icon)        |
| tooltips                 | **true** / false                   | Enables tooltips that show daily forecast summary                           |
| tooltip_width            | **110px** / px or em value         | Sets the width of the tooltip                                               |
| tooltip_bg_color         | **rgb( 75,155,239)**               | Sets the background color of the tooltip (rgb / # / color)                  |
| tooltip_fg_color         | **#fff**                           | Sets the foreground color of the tooltip (rgb / # / color)                  |
| tooltip_border_color     | **rgb(255,161,0)**                 | Sets the color of the tooltip border including the caret (rgb / # / color)  |
| tooltip_border_width     | **1**                              | Sets the width of the tooltip border in px                                  |
| tooltip_caret_size       | **5**                              | Sets the size of the caret (the little arrow pointing down) in px           |
| tooltip_left_offset      | **-12**                            | Sets the offset of the left edge of the tooltip. In negative (-)x           |
| summary_top_padding      | **1em** / px or em                 | Sets the gap between the Forecast and Summary Section                       |
| summary_font_size        | **1em** / px or em                 | Sets the font size for the summary text                                     |
| forecast_font_size       | **1em** / px or em                 | Sets the font size for the Forecast Section                                 |


**Slots**
--------------------------
The current condition columns are specified by 'slots'.  There are 8 left column slots (designated l1 - l8) and 8 right column
slots (designated r1 - r8).  There are currently 16 possible values that can be assigned to a slot.  These are:
- daytime_high
- daytime_low
- maxmin_since_midnight (max and min temperature since midnight)
- rainfall (Rainfall in the past hour from automatic weather station)
- wind
- visibility
- sun_next (the next sun event ... sunset or sunrise)
- sun_following (The following sun event ... if sun_next is a sunset then this will be the following sunrise and vice versa)
- pop (probability of precipitation) Shows % possible rainfall today and the actual recorded rainfall
- popforecast Shows % possible rainfall today and forecast rainfall
- humidity
- pressure
- uv_summary
- possible_today (possible rainfall today)
- custom1 - custom8 (populates using config fields custom1_icon - custom8_icon, custom1_value - custom8_value and custom1_units - custom8_units)
- empty (empty slot... the slot below does not rise to fill the space)
- remove (same as empty but the slot below rises to take the place of the slot)

If configuring with Slots please ensure to fill all available positions, the slots that you do not need can be filled with "remove" to ensure that they remain blank.

**Sections**
--------------------------
![hko_card_section](https://github.com/aes-alienrip/hko-weather-card/assets/73251414/b102439d-abfe-4651-899f-3786ab405b6a)

1. Card is splitted into 4 sections : Main, Slot, Forecast and Summary
2. Main section with current condition, text, temperature and topbar (apparent temp and warning icon) **cannot hide**
3. Example flags for the minimal card as below
~~~~
show_separator: false
hide_slot_section: true
hide_forecast_section: true
hide_summary_section: true
~~~~
![hko_minimal_card](https://github.com/aes-alienrip/hko-weather-card/assets/73251414/c1b3a958-641d-499c-b619-7fb98649592c)
