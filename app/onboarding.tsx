import { globalDataContext } from "@/app/_layout";
import { supabase } from "@/config/supabase";
import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useCustomAlert } from "@/components/main/customAlert";
import StepFive from "@/components/onboarding/StepFive";
import StepFour from "@/components/onboarding/StepFour";
import StepOne from "@/components/onboarding/StepOne";
import StepThree from "@/components/onboarding/StepThree";
import StepTwo from "@/components/onboarding/StepTwo";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const { showAlert } = useCustomAlert();
  const { user, checkUserProfile } = useContext(globalDataContext);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const router = useRouter();
  const totalSteps = 5;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      if (currentStep === 4 && !user?.study_plan) {
        showAlert({
          title: "Rencana Belajar",
          message: "Masukkan rencana belajar terlebih dahulu",
          confirmText: "OK",
        });
      } else if (currentStep === 4 && user?.study_plan) {
        const { data, error } = await supabase
          .from("users")
          .update({ study_plan: user?.study_plan })
          .eq("id", user?.id);

        if (error) {
          showAlert({
            title: "ErrorOnboarding",
            message: "Error while updating study_plan: " + error,
            confirmText: "OK",
          });
        }
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      try {
        if (user?.id === undefined || user.id === null) throw new Error
        checkUserProfile(user.id)
        router.replace("/(tabs)");
      } catch (err) {
        if (!err) return;
        const errorMessage = String(err);
        showAlert({
          title: "ErrorOnboarding",
          message: "Error while updating study_plan: " + errorMessage,
          confirmText: "OK",
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
      default:
        return <StepOne />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/auth")}
          activeOpacity={0.6}
        >
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>{renderStep()}</View>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            return (
              <View
                key={stepNumber}
                style={[
                  styles.indicator,
                  currentStep === stepNumber
                    ? styles.indicatorActive
                    : styles.indicatorInactive,
                ]}
              />
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          {currentStep > 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.backButton]}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>Kembali</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === totalSteps ? "Mulai Sekarang" : "Lanjutkan"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFECC8", 
  },
  header: {
    height: 50,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6F614B", 
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorActive: {
    width: 24, 
    backgroundColor: "#3E3224",
  },
  indicatorInactive: {
    width: 8,
    backgroundColor: "#E6D3B3",
  },
  buttonContainer: {
    flexDirection: "row", 
    width: width - 48,
    gap: 16, 
  },
  navButton: {
    flex: 1, 
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3E3224", 
  },
  nextButton: {
    backgroundColor: "#3E3224",
    elevation: 4,
    shadowColor: "#3E3224",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  backButtonText: {
    color: "#3E3224",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
