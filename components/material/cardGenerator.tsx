import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CopilotStep, walkthroughable } from "react-native-copilot";

import { Colors } from "@/config/colors";
import { MateriType } from "../../service/global/dataMateri";

// Pembungkus Copilot untuk TouchableOpacity
const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);

type Props = {
  item: MateriType;
  onPress: () => void;
  // Props opsional untuk copilot step
  copilotStepProps?: {
    name: string;
    order: number;
    text: string;
  };
};

export default function CardGenerator({
  item,
  onPress,
  copilotStepProps,
}: Props) {
  const CardContent = (
    <CopilotTouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={item.aksara} style={styles.image} resizeMode="contain" />
      <View style={styles.badge}>
        <Text style={styles.latinText}>{item.latin}</Text>
      </View>
    </CopilotTouchableOpacity>
  );

  // Jika props copilotStepProps ada, bungkus dengan CopilotStep
  if (copilotStepProps) {
    return (
      <CopilotStep
        name={copilotStepProps.name}
        order={copilotStepProps.order}
        text={copilotStepProps.text}
      >
        {CardContent}
      </CopilotStep>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: "30%",
    aspectRatio: 0.9,
    backgroundColor: Colors.text,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  image: {
    flex: 1,
    width: "70%",
    height: "70%",
    marginBottom: 6,
  },
  badge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  latinText: {
    fontSize: 12,
    fontFamily: "Fraunces-Bold",
    color: Colors.text,
  },
});
