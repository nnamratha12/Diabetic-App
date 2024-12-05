import React, { useState } from 'react';
import { View, Text, Picker, Button, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DiabetesForm = () => {
  const [formData, setFormData] = useState({
    typicalMeals: '',
    manageBloodSugar: '',
    countCarbs: '',
    balancedDietChallenges: '',
    discussedMealPlan: '',
    specifyChallenges: '',
    specifyMealPlan: ''
  });

  const [feedback, setFeedback] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    // Generate feedback based on form data
    let feedbackMessage = 'Your feedback:\n';

    // Feedback for carbohydrate calculation
    if (formData.typicalMeals === 'yes') {
      feedbackMessage += '- Carbohydrates were calculated correctly.\n';
    } else {
      feedbackMessage += '- Carbohydrates were not calculated correctly. Consider reviewing your carbohydrate counting methods or consulting a dietitian for guidance.\n';
    }

    // Feedback for stress management
    if (formData.manageBloodSugar === 'yes') {
      feedbackMessage += '- You were feeling stressed. Managing stress is crucial for maintaining stable blood sugar levels. Consider stress management techniques like mindfulness, yoga, or talking to a counselor.\n';
    } else {
      feedbackMessage += '- You were not feeling stressed. Good job managing your stress levels.\n';
    }

    // Feedback for exercise
    if (formData.countCarbs === 'yes') {
      feedbackMessage += '- You did exercise. Regular physical activity helps manage blood sugar levels effectively. Keep it up!\n';
    } else {
      feedbackMessage += '- You did not exercise. Incorporating regular exercise into your routine can significantly help in managing blood sugar levels.\n';
    }

    // Feedback for other contributing variables
    if (formData.balancedDietChallenges === 'yes') {
      feedbackMessage += `- Other variables contributed to the situation: ${formData.specifyChallenges}. Identifying and addressing these variables can help in better managing your condition.\n`;
    } else {
      feedbackMessage += '- No other variables contributed to the situation. Maintaining consistency is key.\n';
    }

    // Feedback for ratio correctness
    if (formData.discussedMealPlan === 'yes') {
      feedbackMessage += `- You feel the ratio might be incorrect: ${formData.specifyMealPlan}. It's important to ensure your insulin-to-carbohydrate ratio is accurate. Consult your healthcare provider to review and adjust it if necessary.\n`;
    } else {
      feedbackMessage += '- You do not feel the ratio is incorrect. Continue monitoring and adjusting as needed.\n';
    }

    setFeedback(feedbackMessage);
    alert('Form Submitted! Check feedback below.');
    console.log(formData);
  };

  const handleChange = (name, value) => setFormData(prevState => ({ ...prevState, [name]: value }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Were the carbohydrates calculated correctly?</Text>
      <Picker
        selectedValue={formData.typicalMeals}
        style={styles.picker}
        onValueChange={value => handleChange('typicalMeals', value)}
      >
        <Picker.Item label="" value="" />
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
      </Picker>

      <Text style={styles.label}>Were you feeling stressed?</Text>
      <Picker
        selectedValue={formData.manageBloodSugar}
        style={styles.picker}
        onValueChange={value => handleChange('manageBloodSugar', value)}
      >
        <Picker.Item label="" value="" />
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
      </Picker>

      <Text style={styles.label}>Did you do in any exercise?</Text>
      <Picker
        selectedValue={formData.countCarbs}
        style={styles.picker}
        onValueChange={value => handleChange('countCarbs', value)}
      >
        <Picker.Item label="" value="" />
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
      </Picker>

      <Text style={styles.label}>Were there any other variables that contributed to this situation?</Text>
      <Picker
        selectedValue={formData.balancedDietChallenges}
        style={styles.picker}
        onValueChange={value => handleChange('balancedDietChallenges', value)}
      >
        <Picker.Item label="" value="" />
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
      </Picker>

      {formData.balancedDietChallenges === 'yes' && (
        <TextInput
          style={styles.customInput}
          placeholder="Please specify"
          value={formData.specifyChallenges}
          onChangeText={value => handleChange('specifyChallenges', value)}
        />
      )}

      <Text style={styles.label}>Do you feel that the ratio might be incorrect?</Text>
      <Picker
        selectedValue={formData.discussedMealPlan}
        style={styles.picker}
        onValueChange={value => handleChange('discussedMealPlan', value)}
      >
        <Picker.Item label="" value="" />
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
      </Picker>

      {formData.discussedMealPlan === 'yes' && (
        <TextInput
          style={styles.customInput}
          placeholder="Please specify"
          value={formData.specifyMealPlan}
          onChangeText={value => handleChange('specifyMealPlan', value)}
        />
      )}

      <Button title="Submit" onPress={handleSubmit} />

      {feedback ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7'
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007BFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555'
  },
  picker: {
    width: '40%', // Adjusted width to make the dropdown smaller
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  customInput: {
    width: '40%', // Customize the width as per your requirement
    height: 40, // Customize the height as per your requirement
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16, // Customize the font size as per your requirement
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  feedbackText: {
    fontSize: 16,
    color: '#333'
  }
});

export default DiabetesForm;
