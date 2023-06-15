package com.tron;

import android.graphics.Color;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;
import java.util.Map;

/**
 * Credit Author: Sam Yu
 */
public class ReactWheelCurvedPickerManager extends SimpleViewManager<ReactWheelCurvedPicker> {

    private static final String REACT_CLASS = "WheelCurvedPicker";

    private static final int DEFAULT_TEXT_SIZE = 24 * 2;
    private static final int DEFAULT_ITEM_SPACE = 16 * 2;

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                ItemSelectedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onValueChange")
        );
    }

    @Override
    protected ReactWheelCurvedPicker createViewInstance(ThemedReactContext reactContext) {
        ReactWheelCurvedPicker picker = new ReactWheelCurvedPicker(reactContext);
        picker.setItemTextColor(Color.BLACK);
        picker.setItemTextSize(DEFAULT_TEXT_SIZE);
        picker.setSelectedItemTextColor(Color.WHITE);
        picker.setItemSpace(DEFAULT_ITEM_SPACE);
        picker.setIndicator(true);
        picker.setIndicatorSize(4);
        picker.setIndicatorColor(Color.parseColor("#26808080"));
        picker.setCurtain(true);
        picker.setCurtainColor(Color.parseColor("#1A808080"));
        picker.setAtmospheric(true);
        picker.setCurved(true);
        picker.setVisibleItemCount(7);
        picker.setItemAlign(0);

        return picker;
    }

    @ReactProp(name="data")
    public void setData(ReactWheelCurvedPicker picker, ReadableArray items) {
        if (picker == null) {
            return;
        }

        ArrayList<Object> valueData = new ArrayList<>();
        ArrayList<String> labelData = new ArrayList<>();

        for (int i = 0; i < items.size(); i ++) {
            ReadableMap itemMap = items.getMap(i);

            if (itemMap.getType("value") == ReadableType.String) {
                valueData.add(itemMap.getString("value"));
            } else if (itemMap.getType("value") == ReadableType.Number) {
                valueData.add(itemMap.getInt("value"));
            }

            labelData.add(itemMap.getString("label"));
        }

        picker.setValueData(valueData);
        picker.setData(labelData);
    }

    @ReactProp(name="selectedIndex")
    public void setSelectedIndex(ReactWheelCurvedPicker picker, int index) {
        Log.d("wheelpicker", "Index from React" + Integer.toString(index));

        if (picker != null) {
            picker.setSelectedItemPosition(index);
            picker.invalidate();
        }
    }

    // @ReactProp(name="atmospheric")
    // public void setAtmospheric(ReactWheelCurvedPicker picker, boolean hasAtmospheric) {
    //     if (picker != null) {
    //         picker.setAtmospheric(hasAtmospheric);
    //     }
    // }

    // @ReactProp(name="curved")
    // public void setCurved(ReactWheelCurvedPicker picker, boolean hasCurved) {
    //     if (picker != null) {
    //         picker.setCurved(hasCurved);
    //     }
    // }

    // @ReactProp(name="visibleItemCount")
    // public void setVisibleItemCount(ReactWheelCurvedPicker picker, int num) {
    //     if (picker != null) {
    //         picker.setVisibleItemCount(num);
    //     }
    // }

    // // Didnot work on android 11
    // @ReactProp(name="itemSpace")
    // public void setItemSpace(ReactWheelCurvedPicker picker, int space) {
    //     if (picker != null) {
    //         picker.setItemSpace((int) PixelUtil.toPixelFromDIP(space));
    //     }
    // }

    @ReactProp(name="textColor", customType = "Color")
    public void setTextColor(ReactWheelCurvedPicker picker, Integer color) {
        if (picker != null) {
            picker.setItemTextColor(color);
        }
    }

    @ReactProp(name="textSize")
    public void setTextSize(ReactWheelCurvedPicker picker, int size) {
        if (picker != null) {
            picker.setItemTextSize((int) PixelUtil.toPixelFromDIP(size));
        }
    }

    @ReactProp(name="selectTextColor", customType = "Color")
    public void setSelectedTextColor(ReactWheelCurvedPicker picker, Integer color) {
        if (picker != null) {
            picker.setSelectedItemTextColor(color);
        }
    }

    @ReactProp(name="isShowSelectBackground")
    public void setCurtain(ReactWheelCurvedPicker picker, boolean hasCurtain) {
        if (picker != null) {
            picker.setCurtain(hasCurtain);
        }
    }

    @ReactProp(name="selectBackgroundColor", customType = "Color")
    public void setCurtainColor(ReactWheelCurvedPicker picker, Integer color) {
        if (picker != null) {
            picker.setCurtainColor(color);
        }
    }

    @ReactProp(name="isShowSelectLine")
    public void setIndicator(ReactWheelCurvedPicker picker, boolean hasIndicator) {
        if (picker != null) {
            picker.setIndicator(hasIndicator);
        }
    }

    @ReactProp(name="selectLineColor", customType = "Color")
    public void setIndicatorColor(ReactWheelCurvedPicker picker, Integer color) {
        if (picker != null) {
            picker.setIndicatorColor(color);
        }
    }

    @ReactProp(name="selectLineSize")
    public void setIndicatorSize(ReactWheelCurvedPicker picker, int size) {
        if (picker != null) {
            picker.setIndicatorSize(size);
        }
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }
}
