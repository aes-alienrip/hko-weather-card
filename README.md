[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs) ![GitHub](https://img.shields.io/github/license/aes-alienrip/hko-weather-card?style=for-the-badge) ![GitHub last commit](https://img.shields.io/github/last-commit/aes-alienrip/hko-weather-card?style=for-the-badge) ![Maintenance](https://img.shields.io/maintenance/yes/2022?style=for-the-badge)
# Custom Animated Weather Card for Hong Kong Observatory

![hko-weather](https://user-images.githubusercontent.com/73251414/150528943-da3b1f38-8c14-46ac-8888-b47f2f354b8d.png)

## IMPORTANT CHANGES

This is a weather card that works with **Hong Kong Observatory ONLY**

This card is a modification of a fork of [DavidFW1960/bom-weather-card](https://github.com/DavidFW1960/bom-weather-card)

This card provides MANY additional features as well as compatability with later versions of home assistant.
New features:
- Lit 2
- Only use Day time icons for forecast for future days (days 1-5)
- More icons
- Adds Locale customisation for number formats
- Added to card-picker in Lovelace
- Added option to show minimum or maximum first in forecast
- Added option to show 1 decimal place to temperatures
- Added option to display windspeeds in knots
- Show rainfall as an intensity or absolute number
- Removed leading zeros if 12hr time
- Added Wind Gust
- Can use different icon sets
- Added extra (5th) row of slots
- Added slots (optional) for UV and fire danger ratings
- Added possibility of rainfall to forecast

NOTE: This card REQUIRES any weather component that can provide the required sensors.
Parsing a non existant sensor to the card will cause the card to fail to display!

The Weather Card provides current and forecast weather conditions using HA sensors. You configure the card by passing in sensor entities from the weather component.

The card is very customizable.  You can configure many aspects of it's look and feel as well as which specific content to show by passing in customization flags and defining optional sensors.  Content can also be rearranged if desired.

Hovering over a forecast day will display the daily weather summary in a tooltip popup if that option has been enabled.

# **Installation**
--------------------------
## EASY Way? use HACS
This plugin is now part of the default HACS store. You should not need to add it manually. Add this repo https://github.com/aes-alienrip/hko-weather-card

Install card from HACS as per other plugins. Note that you must add this card as a module to the resources section as per the instructions when you install the card.

NOTE: Home Assistant caches stuff in a way that seems particularly hard to break some times and HACS makes this worse unfortunately.
The rule of thumb is that when you install a new version you MUST break the cache in order for HA to load the new card. This is fairly easy to do.
In CHROME open up the Dev Tools by pressing F12
Then right click on the refresh icon in the task bar (see graphic) and you will see a menu of options. Select Empty cache and hard reload from the options. It is the only option with no shortcut!

![image](hard-reload.png)

You then need to press either CTRL+R OR CTRL+F5 at least TWICE. Then check the version in the same dev-tools. It will look something like this:

![image](version.png)

The first time you do the CTRL+F5 you might find that the version will again change back to the previous version but a second refresh will fix it.

EDIT: Latest HACS version includes a version tag in the resource which will change when you update the card so the caching fix described above is no longer necessary! Yay!

## HARD Way? manual installation as follows:
1. Add ```hko-weather-card.js``` to your ```<config-dir>/www/custom-lovelace/``` directory.  If you don't have this directory (this is your first custom card), you will need to create it.
2. Add ```/local/hko-weather-card/bom-weather-card.js?v=0.90a``` type js to resources. You must increment or use a different version number for every update to break the caching of the card and make it use the new version.

#### Inside the base configuration file add the following entries:
~~~~
rest: !include rest.yaml
sensor: !include sensors.yaml
~~~~

#### Create [rest.yaml](https://raw.githubusercontent.com/aes-alienrip/hko-weather-card/master/rest.yaml) and add the following RESTful sensors:
~~~~
  - resource: https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc
    scan_interval: 1800
    sensor:
      - name: hko_forecast_summary
        value_template: '{{ value_json.forecastDesc }}'
  - resource: https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc
    scan_interval: 1800
    sensor:
      - name: hko_forecast_max_temp_0
        value_template: '{{ value_json.weatherForecast[0].forecastMaxtemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_max_temp_1
        value_template: '{{ value_json.weatherForecast[1].forecastMaxtemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_max_temp_2
        value_template: '{{ value_json.weatherForecast[2].forecastMaxtemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_max_temp_3
        value_template: '{{ value_json.weatherForecast[3].forecastMaxtemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_max_temp_4
        value_template: '{{ value_json.weatherForecast[4].forecastMaxtemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_min_temp_0
        value_template: '{{ value_json.weatherForecast[0].forecastMintemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_min_temp_1
        value_template: '{{ value_json.weatherForecast[1].forecastMintemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_min_temp_2
        value_template: '{{ value_json.weatherForecast[2].forecastMintemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_min_temp_3
        value_template: '{{ value_json.weatherForecast[3].forecastMintemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_min_temp_4
        value_template: '{{ value_json.weatherForecast[4].forecastMintemp.value }}'
        unit_of_measurement: "°C"
      - name: hko_forecast_icon_0
        value_template: '{{ value_json.weatherForecast[0].ForecastIcon }}'
      - name: hko_forecast_icon_1
        value_template: '{{ value_json.weatherForecast[1].ForecastIcon }}'
      - name: hko_forecast_icon_2
        value_template: '{{ value_json.weatherForecast[2].ForecastIcon }}'
      - name: hko_forecast_icon_3
        value_template: '{{ value_json.weatherForecast[3].ForecastIcon }}'
      - name: hko_forecast_icon_4
        value_template: '{{ value_json.weatherForecast[4].ForecastIcon }}'
      - name: hko_forecast_summary_0
        value_template: '{{ value_json.weatherForecast[0].forecastWeather }}'
      - name: hko_forecast_summary_1
        value_template: '{{ value_json.weatherForecast[1].forecastWeather }}'
      - name: hko_forecast_summary_2
        value_template: '{{ value_json.weatherForecast[2].forecastWeather }}'
      - name: hko_forecast_summary_3
        value_template: '{{ value_json.weatherForecast[3].forecastWeather }}'
      - name: hko_forecast_summary_4
        value_template: '{{ value_json.weatherForecast[4].forecastWeather }}'
      - name: hko_forecast_psr_0
        value_template: '{{ value_json.weatherForecast[0].PSR }}'
      - name: hko_forecast_psr_1
        value_template: '{{ value_json.weatherForecast[1].PSR }}'
      - name: hko_forecast_psr_2
        value_template: '{{ value_json.weatherForecast[2].PSR }}'
      - name: hko_forecast_psr_3
        value_template: '{{ value_json.weatherForecast[3].PSR }}'
      - name: hko_forecast_psr_4
        value_template: '{{ value_json.weatherForecast[4].PSR }}'

  - resource: https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc
    scan_interval: 1800
    sensor:
      - name: hko_temperature_hko
        value_template: '{{ value_json.temperature.data[1].value }}'
        unit_of_measurement: "°C"
      - name: hko_humidity
        value_template: '{{ value_json.humidity.data[0].value }}'
        unit_of_measurement: "%"
      - name: hko_forecast_icon
        value_template: '{{ value_json.icon[0] }}'
~~~~

```sensor.hko_temperature_hko``` can change to different weather station according to [HKO API](https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc)

You can replace the value ```[1]``` inside ```value_template: '{{ value_json.temperature.data[1].value }}'``` as the following table:
~~~~
0 = 京士柏
1 ＝ 香港天文台
2 ＝ 黃竹坑
3 = 打鼓嶺
4 = 流浮山
5 = 大埔
6 = 沙田
7 ＝ 屯門
8 ＝ 將軍澳
9 ＝ 西貢
10 ＝ 長洲
11 ＝ 赤鱲角
12 ＝ 青衣
13 ＝ 石崗
14 ＝ 荃灣可觀
15 ＝ 荃灣城門谷
16 ＝ 香港公園
17 ＝ 筲箕灣
18 ＝ 九龍城
19 ＝ 跑馬地
20 ＝ 黃大仙
21 ＝ 赤柱
22 ＝ 觀塘
23 ＝ 深水埗
24 ＝ 啟德跑道公園
25 ＝ 元朗公園
26 ＝ 大美督
~~~~
#### Create [sensors.yaml](https://github.com/aes-alienrip/hko-weather-card/blob/master/sensors.yaml) and add the following template sensor:
~~~~
  - platform: template
    sensors:
      hko_current_text:
        value_template: >-
          {% if is_state("sensor.hko_forecast_icon","50") %} 天晴
          {% elif is_state("sensor.hko_forecast_icon","51") %} 間有陽光
          {% elif is_state("sensor.hko_forecast_icon","52") %} 短暫陽光
          {% elif is_state("sensor.hko_forecast_icon","53") %} 晴間驟雨
          {% elif is_state("sensor.hko_forecast_icon","54") %} 間晴驟雨	
          {% elif is_state("sensor.hko_forecast_icon","60") %} 多雲
          {% elif is_state("sensor.hko_forecast_icon","61") %} 密雲
          {% elif is_state("sensor.hko_forecast_icon","62") %} 微雨
          {% elif is_state("sensor.hko_forecast_icon","63") %} 雨
          {% elif is_state("sensor.hko_forecast_icon","64") %} 大雨
          {% elif is_state("sensor.hko_forecast_icon","65") %} 雷暴
          {% elif is_state("sensor.hko_forecast_icon","70") %} 天色良好
          {% elif is_state("sensor.hko_forecast_icon","71") %} 天色良好
          {% elif is_state("sensor.hko_forecast_icon","72") %} 天色良好
          {% elif is_state("sensor.hko_forecast_icon","73") %} 天色良好
          {% elif is_state("sensor.hko_forecast_icon","74") %} 天色良好
          {% elif is_state("sensor.hko_forecast_icon","75") %} 天色良好
          {% elif is_state("sensor.hko_forecast_icon","76") %} 大致多雲
          {% elif is_state("sensor.hko_forecast_icon","77") %} 大致良好
          {% elif is_state("sensor.hko_forecast_icon","80") %} 大風
          {% elif is_state("sensor.hko_forecast_icon","81") %} 乾燥
          {% elif is_state("sensor.hko_forecast_icon","82") %} 潮濕
          {% elif is_state("sensor.hko_forecast_icon","83") %} 霧
          {% elif is_state("sensor.hko_forecast_icon","84") %} 薄霧
          {% elif is_state("sensor.hko_forecast_icon","85") %} 煙霞
          {% elif is_state("sensor.hko_forecast_icon","90") %} 炎熱
          {% elif is_state("sensor.hko_forecast_icon","91") %} 回暖
          {% elif is_state("sensor.hko_forecast_icon","92") %} 轉涼
          {% elif is_state("sensor.hko_forecast_icon","93") %} 寒冷
          {% endif %}
~~~~

#### Then install the icon files
Please download [hko_weather_icons.zip](https://github.com/aes-alienrip/hko-weather-card/blob/master/hko_weather_icons.zip)
Put them in ```<config-dir>/www/icons/weather_icons``` and then sub folders ```animated``` and ```static```.  Create the directories if necessary.

You should end up with the following folders:
This structure is after all configuration is done. If you install via HACS you must still configure the yaml and icons manually.

#### HACS:-
~~~~
└── ...
└── configuration.yaml
└── rest.yaml
└── sensors.yaml
└── www
    └── community
        └── hko-weather-card
            └── hko-weather-card.js
            └── hko-weather-card.js.gz
    └── icons
	└── weather_icons
		└── animated     ### Containing the animated icons from hko_weather_icons.zip animated directory
		└── static       ### Containing the static icons from hko_weather_icons.zip static directory
~~~~

#### MANUAL INSTALL:-
~~~~
└── ...
└── configuration.yaml
└── rest.yaml
└── sensors.yaml
└── www
    └── custom-lovelace
    	└── hko-weather-card.js
    └── icons
	└── weather_icons
		└── animated     ### Containing the animated icons from hko_weather_icons.zip animated directory
		└── static       ### Containing the static icons from hko_weather_icons.zip static directory
~~~~
This structure is after all configuration is done. You must still configure the yaml and icons manually.

#### IF YOU USE the SAMBA addon in Home Assistant, the ICON directory will be hidden by default. Go to the configuration of the addon and remove the exclusion of icons and restart the addon otherwise you can't create the directory.

# **Configuration**
--------------------------
1. Add the card reference to resources
If you installed using HACS, the resources should be updated automatically (see below)

**Note: Ensure type is set to module and not js**
**Note: /local/ points to the ```<config-dir>/www/``` dir.**
**Note: /hacsfiles/ points to the ```<config-dir>/www/community/``` dir.**

Note that neither /local/ of /hacsfiles/ physically exist! The directory structure is as per above.

For a HACS Installation:
~~~~
resources:
- url: /hacsfiles/hko-weather-card/hko-weather-card.js
type: module
~~~~

For the manual installation:
~~~~
resources:
- url: /local/custom-lovelace/hko-weather-card.js?v=0.1
type: module
~~~~
2. Add the card definition: You can add this card from the card picker but need to configure the entities and flags in YAML. There are required / optional and flag entries.
This card has been added to the custom-card-picker in Lovelace
	
![image](card-picker.png)


**An example configuration is in [lovelace.yaml](https://github.com/aes-alienrip/hko-weather-card/blob/master/lovelace.yaml) - this can be pasted into the manual card configuration in the GUI editor**
If you paste it in the raw editor or in a yaml file, take care with the indenting.

Required entries must be present 
in your configuration.  The card will not work at all if any of these lines are missing.
~~~~
type: custom:hko-weather-card
entity_current_conditions: sensor.hko_forecast_icon
entity_current_text: sensor.hko_current_text
entity_temperature: sensor.hko_temperature_hko
entity_humidity: sensor.hko_humidity
entity_forecast_high_temp_1: sensor.hko_forecast_max_temp_0
entity_forecast_high_temp_2: sensor.hko_forecast_max_temp_1
entity_forecast_high_temp_3: sensor.hko_forecast_max_temp_2
entity_forecast_high_temp_4: sensor.hko_forecast_max_temp_3
entity_forecast_high_temp_5: sensor.hko_forecast_max_temp_4
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
entity_daily_summary: sensor.hko_forecast_summary
entity_summary_1: sensor.hko_forecast_summary_0
entity_summary_2: sensor.hko_forecast_summary_1
entity_summary_3: sensor.hko_forecast_summary_2
entity_summary_4: sensor.hko_forecast_summary_3
entity_summary_5: sensor.hko_forecast_summary_4
entity_pop_1: sensor.hko_forecast_psr_0
entity_pop_2: sensor.hko_forecast_psr_1
entity_pop_3: sensor.hko_forecast_psr_2
entity_pop_4: sensor.hko_forecast_psr_3
entity_pop_5: sensor.hko_forecast_psr_4
entity_sun: sun.sun
static_icons: false
tooltips: true
time_format: 24
show_separator: true
locale: zh
refresh_interval: 900
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
| locale                   | **en** / zh etc.                   | Sets locale display of day names and time formats                           |
| static_icons             | true / **false**                   | Switches between static (true) and animated (false) icons                   |
| tooltips                 | true / **false**                   | Enables tooltips that show daily forecast summary                           |
| tooltip_width            | **110**                            | Sets the width of the tooltip in px                                         |
| tooltip_bg_color         | **rgb( 75,155,239)**               | Sets the background color of the tooltip (rgb / # / color)                  |
| tooltip_fg_color         | **#fff**                           | Sets the foreground color of the tooltip (rgb / # / color)                  |
| tooltip_border_color     | **rgb(255,161,0)**                 | Sets the color of the tooltip border including the caret (rgb / # / color)  |
| tooltip_border_width     | **1**                              | Sets the width of the tooltip border in px                                  |
| tooltip_caret_size       | **5**                              | Sets the size of the caret (the little arrow pointing down) in px           |
| tooltip_left_offset      | **-12**                            | Sets the offset of the left edge of the tooltip. In negative (-)x           |
| refresh_interval         | **30** / Integer value             | Sets the nuber of seconds between card value refreshes                      |
| old_daily_format         | true / **false**                   | Sets the format of the daily high & low temps to be stacked (old format)    |
| show_beaufort            | true / **false**                   | Shows Beaufort Scale wind information                                       |
| show_separator           | true / **false**                   | Shows separator between current conditions columns and current temp / Icon  |
| tempformat               | highlow / **noentry**              | Any setting for this flag will trigger the option to show max/min in daily  |
| time_format              | **locale** / 12 / 24               | Sets the format sunset and sunrise times. locale format is the default.     |
| temp_top_margin          | **9px** / px or em value           | Sets the top margin of the Temperature.                                     |
| temp_font_weight         | **300** / numeric value            | Sets the font weight of the Temperature.                                    |
| temp_font_size           | **4em** / em value                 | Sets the font size of the Temperature.                                      |
| temp_right_pos           | **0.85em** / px or em value        | Sets the right position of the Temperature.                                 |
| temp_uom_top_margin      | **-3px** / px or em value         | Sets the top margin of the Temperature Unit of Meaure.                      |
| temp_uom_right_margin    | **4px** / px or em value           | Sets the right margin of the Temperature Unit of Measure.                   |
| apparent_top_margin      | **45px** / px or em value          | Sets the top margin of the apparent (feels Like) temperature                |
| apparent_right_pos       | **1em** / px or em value           | Sets the right position of the apparent (feels Like) temperature            |
| apparent_right_margin    | **1em** / px or em value           | Sets the right margin of the apparent (feels Like) temperature              |
| current_text_top_margin  | **0.8em** / px or em value         | Sets the top margin of the current temperature text                         |
| current_text_left_pos    | **0px** / px or em value           | Sets the left position of the current temperature text                      |
| current_text_font_size   | **2em** / em value                 | Sets the font size of the current temperature text                          |
| current_text_alignment   | **center** / left, right or center | Sets the alignment of current text                                          |
| current_text_width       | **100%** / px, em or %             | Sets the width of current text                                              |
| current_data_top_margin  | **10em** / px or em value          | Sets the top margin of the current data blocks                              |
| large_icon_top_margin    | **-3em** / px or em value          | Sets the top margin of the current conditions icon                          |
| large_icon_left_position | **0px** / px or em value           | Sets the left position of the current conditions icon                       |
| separator_top_margin     | **6em** / px or em value           | Sets the top margin of the separator line                                   |
| summary_top_padding      | **1em** / px or em                 | Sets the gap between the forecast and summary text                          |
| summary_font_size        | **1em** / px or em                 | Sets the font size for the summary text                                     |
| slot_l1                  | **sun_next**                       | Sets the value used in current conditions slot l1 : See slots for more info |
| slot_l2                  | **daytime_high**                   | Sets the value used in current conditions slot l2 : See slots for more info |
| slot_l3                  | **daytime_low**                    | Sets the value used in current conditions slot l3 : See slots for more info |
| slot_l4                  | **wind**                           | Sets the value used in current conditions slot l4 : See slots for more info |
| slot_l5                  | **pressure**                       | Sets the value used in current conditions slot l5 : See slots for more info |
| slot_r1                  | **sun_following**                  | Sets the value used in current conditions slot r1 : See slots for more info |
| slot_r2                  | **humidity**                       | Sets the value used in current conditions slot r2 : See slots for more info |
| slot_r3                  | **pop**                            | Sets the value used in current conditions slot r3 : See slots for more info |
| slot_r4                  | **uv_summary**                     | Sets the value used in current conditions slot r4 : See slots for more info |
| slot_r5                  | **fire_summary**                   | Sets the value used in current conditions slot r5 : See slots for more info |
| show_decimals            | **false** / true                   | Sets card to render current and apparent temperature to 1 decimal place     | 

**Slots**
--------------------------
The current condition columns are specified by 'slots'.  There are 5 left column slots (designated l1 - l5) and 5 right column
slots (designated r1 - r5).  There are currently 10 possible values that can be assigned to a slot.  These are:
- daytime_high
- daytime_low
- wind
- wind_kt
- visibility
- sun_next (the next sun event ... sunset or sunrise)
- sun_following (The following sun event ... if sun_next is a sunset then this will be the following sunrise and vice versa)
- pop (probability of precipitation) Shows % possible rainfall today and the actual recorded rainfall
- popforecast Shows % possible rainfall today and forecast rainfall
- humidity
- pressure
- uv_summary
- fire_summary
- possible_today (possible rainfall today)
- possible_tomorrow (possible rainfall tomorrow)
- empty (empty slot... the slot below does not rise to fill the space)
- remove (same as empty but the slot below rises to take the place of the slot)

If configuring with Slots please ensure to fill all available positions, the slots that you do not need can be filled with "remove" to ensure that they remain blank.
