var s_HelloWorld = "res/HelloWorld.png";
var s_CloseNormal = "../../shared-resources/images/CloseNormal.png";
var s_CloseSelected = "res/CloseSelected.png";

var s_imagePath="../../shared-resources/images/";
var s_fontPath = "../../shared-resources/fonts/";

var s_deep_water_background = s_imagePath + "deep_water_background.png";

// Geoboard tool images
var s_geoboardImagePath = s_imagePath + "geoboard/";
var s_square_geoboard_button = s_geoboardImagePath + "SquarePin_button.png";
var s_square_geoboard_button_base = s_geoboardImagePath + "SquarePin_button_base.png";
var s_triangle_geoboard_button = s_geoboardImagePath + "IsoPin_button.png";
var s_triangle_geoboard_button_base = s_geoboardImagePath + "IsoPin_button_base.png";
var s_circle_geoboard_button = s_geoboardImagePath + "CirclePin_button.png";
var s_circle_geoboard_button_base = s_geoboardImagePath + "CirclePin_button_base.png";
var s_centre_pin_button = s_geoboardImagePath + "CentrePoint_button.png";
var s_add_pin_button = s_geoboardImagePath + "Arrow_up_button.png";
var s_remove_pin_button = s_geoboardImagePath + "Arrow_down_button.png";
var s_add_band_button_base = s_geoboardImagePath + "Band_button_base.png";
var s_add_band_button = s_geoboardImagePath + "Band_button.png";
var s_remove_band_button = s_geoboardImagePath + "trash_button.png";
var s_remove_band_button_base = s_geoboardImagePath + "trash_button_base.png";
var s_show_angles_button = s_geoboardImagePath + "showAnglesButton.png";
var s_show_angles_button_selected = s_geoboardImagePath + "showAnglesButtonSelected.png";
var s_show_same_angles_button = s_geoboardImagePath + "sameAngleButton.png";
var s_show_same_angles_button_selected = s_geoboardImagePath + "sameAngleButtonSelected.png";
var s_show_side_lengths_button = s_geoboardImagePath + "showSideLengthsButton.png";
var s_show_side_lengths_button_selected = s_geoboardImagePath + "showSideLengthsButtonSelected.png";
var s_show_same_side_lengths_button = s_geoboardImagePath + "sameSideLengthButton.png";
var s_show_same_side_lengths_button_selected = s_geoboardImagePath + "sameSideLengthButtonSelected.png";
var s_show_parallel_sides_button = s_geoboardImagePath + "showParallelSidesButton.png";
var s_show_parallel_sides_button_selected = s_geoboardImagePath + "showParallelSidesButtonSelected.png";

var s_geoboard_background = s_geoboardImagePath + "background.png";
var s_pin = s_geoboardImagePath + "Pin_white.png";
var s_bandPart = s_geoboardImagePath + "Band_1_white.png";
var s_geoboard_border = s_geoboardImagePath + "pinboardBackground.png";
var s_property_background = s_geoboardImagePath + "Info_Side_Button.png";
var s_property_highlight = s_geoboardImagePath + "Info_Side_Button_highlight.png";
var s_angle_background = s_geoboardImagePath + "label_panel.png";
var s_side_length_background = s_geoboardImagePath + "label_panel.png";
var s_same_side_length_notch = s_geoboardImagePath + "sameSideLengthNotch.png";
var s_parallel_side_arrow = s_geoboardImagePath + "parallelSideArrow.png";
var s_white_pin = s_geoboardImagePath + "Pin_white.png";
var s_select_band_button = s_geoboardImagePath + "Colour_select.png";
var s_empty_select_band_button = s_geoboardImagePath + "colour_box_empty.png";
var s_band_selected = s_geoboardImagePath + "colour_selected.png";
var s_single_band_part = s_geoboardImagePath + "Band_Circle.png";

var s_moving_pin = s_geoboardImagePath + "hand_up.png";
var s_pin_no_shadow = s_geoboardImagePath + "Pin_white_noShadow.png";
var s_number_box = s_geoboardImagePath + "Number_box.png";

var s_geoboard_title = s_geoboardImagePath + "Geoboard_title.png";

//Clock tool images
var s_clockImagePath = s_imagePath + "clock/";
var s_analogue_clockface = s_clockImagePath + "Clock_Face.png";
var s_minute_hand = s_clockImagePath + "Minute_hand.png";
var s_hour_hand = s_clockImagePath + "Hour_hand.png";
var s_clockface_pin = s_clockImagePath + "Clock_Centre_Pin.png";
var s_minute_handle = s_clockImagePath + "Minute_hand_handle.png";
var s_hour_handle = s_clockImagePath + "Hour_hand_handle.png";
var s_digital_background = s_clockImagePath + "digital_bg.png";

var s_clockDigitPath = s_clockImagePath + "digits/";
var s_digits = [];
for (var i = 0; i <= 9; i++) {
    s_digits[i] = s_clockDigitPath + i + ".png";
};
var s_colon = s_clockDigitPath + "colon.png";
var s_am_indicator = s_clockImagePath + "AM.png";
var s_pm_indicator = s_clockImagePath + "PM.png";
var s_arrow_up = s_clockImagePath + "Arrow_Up.png";
var s_arrow_down = s_clockImagePath + "Arrow_Down.png";

var s_clockSettingsPath = s_clockImagePath + "settings/";
var s_settings_panel = s_clockSettingsPath + "Free_Form_BG.png";
var s_settings_button_base = s_clockSettingsPath + "Settings_button_base.png";
var s_settings_button = s_clockSettingsPath + "Settings_button.png"
var s_settings_close_button = s_clockSettingsPath + "Free_Form_CloseButton.png";
var s_analogue_button_selected = s_clockSettingsPath + "Analog_Button_On.png";
var s_analogue_button_unselected = s_clockSettingsPath + "Analog_Button_Off.png";
var s_digital_button_selected = s_clockSettingsPath + "Digital_Button_On.png";
var s_digital_button_unselected = s_clockSettingsPath + "Digital_Button_Off.png"
var s_both_button_selected = s_clockSettingsPath + "Analog&Digital_Button_On.png";
var s_both_button_unselected = s_clockSettingsPath + "Analog&Digital_Button_Off.png";
var s_hour_12_button_selected = s_clockSettingsPath + "12hr_On.png";
var s_hour_12_button_unselected = s_clockSettingsPath + "12hr_Off.png";
var s_hour_24_button_selected = s_clockSettingsPath + "24hr_On.png";
var s_hour_24_button_unselected = s_clockSettingsPath + "24hr_Off.png";
var s_words_button_unselected = s_clockSettingsPath + "Words_Off.png";
var s_words_button_selected = s_clockSettingsPath + "Words_On.png";
var s_numbers_button_unselected = s_clockSettingsPath + "Numbers_Off.png";
var s_numbers_button_selected = s_clockSettingsPath + "Numbers_On.png";
var s_sentence_button_unselected = s_clockSettingsPath + "Sentence_Off.png";
var s_sentence_button_selected = s_clockSettingsPath + "Sentence_On.png";
var s_clockCardsPath = s_clockImagePath + "clock_cards/";
var s_clock_cards = [];
for (var i = 0; i < 12; i++) {
    s_clock_cards[i] = s_clockCardsPath + "Clock_Card_" + (i + 1) + ".png";
};
var s_clock_numbers = s_clockImagePath + "Clock_Numbers_All.png";
var s_clock_title = s_clockImagePath + "Title.png";


//Number wheel images
var s_number_wheel_path = s_imagePath + "number_wheel/";

var s_number_wheel_backgrounds = [];
for (var i = 1; i <= 6; i++) {
    s_number_wheel_backgrounds[i-1] = s_number_wheel_path + "NW_" + i + "_ov.png";
};
var s_number_wheel_section_background = s_number_wheel_path + "numberWheelSectionBackground.png";

//Long division images
var s_longDivisionImagePath = s_imagePath + "long_division/";

var s_number_picker_box = s_longDivisionImagePath + "NumberPickerBox.png";
var s_number_container = s_longDivisionImagePath + "NumberBox.png";
var s_number_box_up = s_longDivisionImagePath + "NumberPicker_Up_Arrow.png";
var s_number_box_down = s_longDivisionImagePath + "NumberPicker_Down_Arrow.png";
var s_decimal_point = s_longDivisionImagePath + "DecimalPoint.png";
var s_number_picker_left = s_longDivisionImagePath + "NumberPicker_Left_Arrow.png";
var s_number_picker_right = s_longDivisionImagePath + "NumberPicker_Right_Arrow.png";

var s_test_big_box = s_longDivisionImagePath + "testBigWhiteBox.png";

var g_ressources = [
    //image
    {src:s_HelloWorld},
    {src:s_CloseNormal},
    {src:s_CloseSelected},

    //Geoboard
    {src:s_pin},
    {src:s_white_pin},
    {src:s_square_geoboard_button},
    {src:s_square_geoboard_button_base},
    {src:s_triangle_geoboard_button},
    {src:s_triangle_geoboard_button_base},
    {src:s_circle_geoboard_button},
    {src:s_circle_geoboard_button_base},
    {src:s_centre_pin_button},
    {src:s_add_pin_button},
    {src:s_remove_pin_button},
    {src:s_add_band_button},
    {src:s_add_band_button_base},
    {src:s_remove_band_button},
    {src:s_remove_band_button_base},
    {src:s_show_angles_button},
    {src:s_show_angles_button_selected},
    {src:s_show_same_angles_button},
    {src:s_show_same_angles_button_selected},
    {src:s_show_side_lengths_button},
    {src:s_show_side_lengths_button_selected},
    {src:s_show_same_side_lengths_button},
    {src:s_show_same_side_lengths_button_selected},
    {src:s_show_parallel_sides_button},
    {src:s_show_parallel_sides_button_selected},

    {src:s_geoboard_background},
    {src:s_geoboard_border},
    {src:s_bandPart},
    {src:s_property_background},
    {src:s_property_highlight},
    {src:s_angle_background},
    {src:s_side_length_background},
    {src:s_same_side_length_notch},
    {src:s_parallel_side_arrow},
    {src:s_select_band_button},
    {src:s_empty_select_band_button},
    {src:s_band_selected},
    {src:s_single_band_part},

    {src:s_moving_pin},
    {src:s_pin_no_shadow},
    {src:s_number_box},

    {src:s_geoboard_title},

    //Clock
    {src:s_analogue_clockface},
    {src:s_minute_hand},
    {src:s_hour_hand},
    {src:s_clockface_pin},
    {src:s_hour_handle},
    {src:s_minute_handle},
    {src:s_digital_background},
    {src:s_colon},
    {src:s_am_indicator},
    {src:s_pm_indicator},
    {src:s_arrow_up},
    {src:s_arrow_down},
    {src:s_settings_panel},
    {src:s_settings_button},
    {src:s_settings_button_base},
    {src:s_settings_close_button},
    {src:s_analogue_button_selected},
    {src:s_analogue_button_unselected},
    {src:s_digital_button_selected},
    {src:s_digital_button_unselected},
    {src:s_both_button_selected},
    {src:s_both_button_unselected},
    {src:s_hour_12_button_selected},
    {src:s_hour_12_button_unselected},
    {src:s_hour_24_button_selected},
    {src:s_hour_24_button_unselected},
    {src:s_words_button_selected},
    {src:s_words_button_unselected},
    {src:s_numbers_button_selected},
    {src:s_numbers_button_unselected},
    {src:s_sentence_button_selected},
    {src:s_sentence_button_unselected},
    {src:s_clock_numbers},
    {src:s_clock_title},

    //number wheel
    {src:s_number_wheel_section_background},

    //long division
    {src:s_number_picker_box},
    {src:s_number_container},
    {src:s_number_box_up},
    {src:s_number_box_down},
    {src:s_number_picker_left},
    {src:s_number_picker_right},

    {src:s_test_big_box},

    //plist

    //fnt

    //tmx

    //bgm

    //effect
];

for (var i = 0; i < s_digits.length; i++) {
    g_ressources.push({src:s_digits[i]});
};

for (var i = 0; i < s_clock_cards.length; i++) {
    g_ressources.push({src:s_clock_cards[i]});
};

for (var i = 0; i < s_number_wheel_backgrounds.length; i++) {
    g_ressources.push({src:s_number_wheel_backgrounds[i]});
};