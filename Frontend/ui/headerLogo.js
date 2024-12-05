import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function HeaderLogo({ title }) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: "row" }}>
      <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
        {title ? title : "Diabetic App "}
      </Text>
    </View>
  );
}
