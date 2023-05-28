import * as React from 'react';
import {
  processColor,
  ProcessedColorValue,
  requireNativeComponent,
  StyleSheet,
  View
} from 'react-native';
import { PickerProps, PickerItemProps } from '@react-native-picker/picker';

import { notEmpty } from './utils';

type NativeComponentProps = {
  data: string[];
  selectedIndex: number;
  onValueChange?: (event: any) => void;
  textColor?: ProcessedColorValue | null;
  textSize?: number;
  selectTextColor?: ProcessedColorValue | null;
  selectBackgroundColor?: ProcessedColorValue | null;
  selectLineColor?: ProcessedColorValue | null;
  selectLineSize?: number;
  isShowSelectLine?: boolean;
  isShowSelectBackground?: boolean;
};

const WheelPickerView = requireNativeComponent<NativeComponentProps>('WheelPicker');

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

        const { label } = child.props;

        if (typeof label !== 'string') {
          return;
        }

        return label;
      })
      .filter(notEmpty);

    return [_items, selected];
  }, [children, selectedValue]);

  const onSelect = React.useCallback(
    ({ nativeEvent }) => {
      const { position }: { position: number } = nativeEvent;

      if (onValueChange !== undefined) {
        if (position >= 0) {
          const child = React.Children.toArray(children).filter(item => item != null)[
            position
          ];

          if (!React.isValidElement(child)) {
            // @ts-expect-error
            onValueChange(null, position);
          } else {
            const value = child.props.value;

            if (props.selectedValue !== value) {
              onValueChange(value, position);
            }
          }
        } else {
          // @ts-expect-error
          onValueChange(null, position);
        }
      }
    },
    [children, onValueChange, selectedValue, selected]
  );

  return (
    <View
      pointerEvents={enabled ? 'auto' : 'none'}
      style={{ backgroundColor: style.backgroundColor }}
    >
      <WheelPickerView
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
