import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";

type Props = Omit<TextInputProps, "secureTextEntry"> & {
  hidden?: boolean;
  onToggleHidden?: () => void;
};

export default function PasswordInput({ hidden: hiddenProp, onToggleHidden, ...rest }: Props) {
  const [internalHidden, setInternalHidden] = useState(true);
  const isControlled = hiddenProp !== undefined && onToggleHidden !== undefined;
  const hidden = isControlled ? hiddenProp : internalHidden;
  const toggle = isControlled ? onToggleHidden! : () => setInternalHidden((h) => !h);

  return (
    <View style={styles.wrapper}>
      <TextInput
        {...rest}
        style={styles.input}
        secureTextEntry={hidden}
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={toggle}
        style={styles.toggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel={hidden ? "Mostrar contraseña" : "Ocultar contraseña"}
      >
        <Text style={styles.toggleText}>{hidden ? "Mostrar" : "Ocultar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  toggle: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  toggleText: {
    color: "#2A9D8F",
    fontSize: 14,
    fontWeight: "600",
  },
});
