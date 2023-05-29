import * as React from 'react';
import {
  processColor,
  requireNativeComponent,
  ProcessedColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { PickerProps, PickerItemProps } from '@react-native-picker/picker';

import { notEmpty } from './utils';

type NativeComponentProps = {
  data: Pick<PickerItemProps, 'label' | 'value'>[];
  selectedIndex: number;
  onValueChange?: (event: any) => void;
  style?: StyleProp<Omit<ViewStyle, 'backgroundColor' | 'color'>>;
  textColor?: ProcessedColorValue | null;
  textSize?: number;
  selectTextColor?: ProcessedColorValue | null;
  selectBackgroundColor?: ProcessedColorValue | null;
  selectLineColor?: ProcessedColorValue | null;
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
    onValueChange
  } = props;
  const itemStyle = StyleSheet.flatten(props.itemStyle) || {};
  const style = StyleSheet.flatten(props.style) || {};
  const selectedItemStyle = StyleSheet.flatten(props.selectedItemStyle) || {};

  const [items, selected] = React.useMemo(() => {
    let selected = 0;

    const _items = React.Children.toArray(props.children)
      .map((child, index) => {
        if (!React.isValidElement(child)) {
          return;
        }

        if (child.props.value === selectedValue) {
          selected = index;
        }

        const { label, value } = child.props;

        if (typeof label !== 'string') {
          return;
        }

        return { label, value: value as PickerItemProps['value'] };
      })
      .filter(notEmpty);

    return [_items, selected];
  }, [children, selectedValue]);

  const onSelect = React.useCallback(
    ({ nativeEvent }) => {
      if (onValueChange === undefined) {
        return;
      }

      const { data: value }: { data: number } = nativeEvent;
      const childIndex = React.Children.toArray(children).findIndex(
        child => React.isValidElement(child) && child.props.value === value
      );

      if (childIndex === -1) {
        // @ts-expect-error
        onValueChange(null, -1);
        return;
      }

      onValueChange(value, childIndex);
    },
    [children, onValueChange, selectedValue, selected]
  );

  return (
    <View pointerEvents={enabled ? 'auto' : 'none'} style={style}>
      <WheelPickerView
        style={style}
        selectedIndex={selected}
        data={items}
        onValueChange={onSelect}
        textColor={processColor(itemStyle.color || style.color)}
        textSize={itemStyle.fontSize}
        selectTextColor={processColor(
          selectedItemStyle.color || itemStyle.color || style.color
        )}
        selectBackgroundColor={processColor(selectionColor)}
      />
    </View>
  );
};

WheelPicker.Item = () => null;

export default WheelPicker;
