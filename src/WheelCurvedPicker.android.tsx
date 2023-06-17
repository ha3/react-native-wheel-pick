import * as React from 'react';
import {
  requireNativeComponent,
  ColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { PickerProps, PickerItemProps } from '@react-native-picker/picker';

import { notEmpty, removeKeys } from './utils';

type NativeComponentProps = {
  data: Pick<PickerItemProps, 'label' | 'value'>[];
  selectedIndex: number;
  onValueChange?: (event: any) => void;
  style?: StyleProp<Omit<ViewStyle, 'backgroundColor' | 'color'>>;
  textColor?: ColorValue;
  textSize?: number;
  selectTextColor?: ColorValue;
  selectBackgroundColor?: ColorValue;
  selectLineColor?: ColorValue;
  selectLineSize?: number;
  isShowSelectLine?: boolean;
  isShowSelectBackground?: boolean;
};

const WheelPickerView =
  requireNativeComponent<NativeComponentProps>('WheelCurvedPicker');

const WheelPicker: React.FC<
  PickerProps & { selectedItemStyle?: PickerProps['itemStyle'] }
> & { Item: React.FC<PickerItemProps> } = props => {
  const {
    children,
    enabled = true,
    selectionColor,
    selectedValue,
    onValueChange,
  } = props;
  const itemStyle = StyleSheet.flatten(props.itemStyle) || {};
  const style = StyleSheet.flatten(props.style) || {};
  const selectedItemStyle = StyleSheet.flatten(props.selectedItemStyle) || {};

  const [items, selected] = React.useMemo(() => {
    let _selected = 0;

    const _items = React.Children.toArray(children)
      .map((child, index) => {
        if (!React.isValidElement(child)) {
          return;
        }

        if (child.props.value === selectedValue) {
          _selected = index;
        }

        const { label, value } = child.props;

        if (typeof label !== 'string') {
          return;
        }

        return { label, value: value as PickerItemProps['value'] };
      })
      .filter(notEmpty);

    return [_items, _selected];
  }, [children, selectedValue]);

  const onSelect = React.useCallback(
    ({ nativeEvent }) => {
      if (onValueChange === undefined) {
        return;
      }

      const { data: value }: { data: number } = nativeEvent;

      if (value === selectedValue) {
        return;
      }

      const childIndex = React.Children.toArray(children).findIndex(
        child => React.isValidElement(child) && child.props.value === value
      );

      if (childIndex === -1) {
        if (__DEV__) {
          console.warn('not found', value);
        }
        return;
      }

      onValueChange(value, childIndex);
    },
    [children, selectedValue, onValueChange]
  );

  return (
    <View
      pointerEvents={enabled ? 'auto' : 'none'}
      style={removeKeys(style, ['backgroundColor'])}
    >
      <WheelPickerView
        data={items}
        onValueChange={onSelect}
        selectedIndex={selected}
        style={style}
        textColor={itemStyle.color || style.color}
        textSize={itemStyle.fontSize}
        selectTextColor={selectedItemStyle.color || itemStyle.color || style.color}
        selectBackgroundColor={selectionColor}
      />
    </View>
  );
};

WheelPicker.Item = () => null;

export default WheelPicker;
