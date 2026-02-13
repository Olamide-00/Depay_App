import { View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import { Ionicons } from "@expo/vector-icons";

const ChangePIN1 = () => {
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showTransactionPin, setShowTransactionPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  return (
    <View style={styles.root}>
      <CommonHeader title="" back />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text size="xl" style={styles.title}>
            Change Transaction Pin
          </Text>
          <Text style={styles.subtitle}>
            Create a new pin to secure your JARA account.
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Transaction PIN */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transaction PIN</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Create New Transaction PIN"
                placeholderTextColor="#9CA3AF"
                value={transactionPin}
                onChangeText={setTransactionPin}
                secureTextEntry={!showTransactionPin}
                keyboardType="numeric"
                maxLength={4}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowTransactionPin(!showTransactionPin)}
              >
                <Ionicons
                  name={showTransactionPin ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm PIN */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm PIN*</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Re-Enter New Transaction PIN"
                placeholderTextColor="#9CA3AF"
                value={confirmPin}
                onChangeText={setConfirmPin}
                secureTextEntry={!showConfirmPin}
                keyboardType="numeric"
                maxLength={4}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPin(!showConfirmPin)}
              >
                <Ionicons
                  name={showConfirmPin ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Set New Pin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChangePIN1;
