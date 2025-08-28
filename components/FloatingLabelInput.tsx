import { useEffect, useRef, useState } from 'react';
import { Animated, TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';

type FloatingLabelInputProps = {
  label: string;
} & Omit<TextInputProps, 'placeholder'>;

export default function FloatingLabelInput(props: FloatingLabelInputProps) {
  const { label, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize, ...rest } =
    props;
  const [isFocused, setIsFocused] = useState(false);
  const animated = useRef(new Animated.Value(value && String(value).length > 0 ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: isFocused || (!!value && String(value).length > 0) ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [animated, isFocused, value]);

  const labelTop = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [12, -10],
  });

  const labelFontSize = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const [labelWidth, setLabelWidth] = useState(0);
  const shouldShowTopGap = isFocused || (!!value && String(value).length > 0);
  const gapPadding = 6;
  const labelLeft = 15;

  return (
    <View style={[styles.container, shouldShowTopGap && styles.containerFocused]}>
      {shouldShowTopGap && (
        <>
          <View
            style={[
              styles.topBorderSegment,
              styles.topBorderLeft,
              { width: Math.max(labelLeft - gapPadding, 0) },
            ]}
          />
          <View
            style={[
              styles.topBorderSegment,
              styles.topBorderRight,
              { left: labelLeft + labelWidth + gapPadding },
            ]}
          />
        </>
      )}

      <Animated.Text
        onLayout={(e) => setLabelWidth(e.nativeEvent.layout.width)}
        style={[
          styles.label,
          { top: labelTop, fontSize: labelFontSize as unknown as number },
          isFocused ? styles.labelFocused : styles.labelBlurred,
        ]}
      >
        {label}
      </Animated.Text>
      <TextInput
        style={styles.input}
        value={value as string}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    borderWidth: 0,
    borderColor: Colors.light.primary,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: Colors.light.highlight,
  },
  containerFocused: {
    borderWidth: 1,
    borderTopWidth: 0,
  },
  topBorderSegment: {
    position: 'absolute',
    top: 0,
    height: 1,
    backgroundColor: Colors.light.primary,
  },
  topBorderLeft: {
    left: 0,
  },
  topBorderRight: {
    right: 0,
  },
  label: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    fontFamily: 'GoogleSansCode',
  },
  labelFocused: {
    color: Colors.light.primary,
  },
  labelBlurred: {
    color: 'gray',
  },
  input: {
    width: '100%',
    height: 40,
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontFamily: 'GoogleSansCode',
    color: 'black',
  },
});
