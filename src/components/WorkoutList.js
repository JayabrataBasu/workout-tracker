import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const WorkoutForm = ({ onAddWorkout }) => {
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputMode, setInputMode] = useState('standard');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddWorkout = () => {
    // Enhanced validation
    if (!workoutType || !duration) {
      alert('Please fill in workout type and duration');
      return;
    }

    const newWorkout = {
      id: Date.now(),
      type: workoutType,
      duration: parseInt(duration),
      intensity,
      date: date.toLocaleDateString(),
      calories: calories ? parseInt(calories) : null,
      notes: notes || null
    };

    onAddWorkout(newWorkout);

    // Reset form
    setWorkoutType('');
    setDuration('');
    setIntensity('medium');
    setDate(new Date());
    setCalories('');
    setNotes('');
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const toggleInputMode = () => {
    setInputMode(inputMode === 'standard' ? 'advanced' : 'standard');
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
      >
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Log New Workout</Text>
            <TouchableOpacity onPress={toggleInputMode} style={styles.modeToggle}>
              <Icon
                  name={inputMode === 'standard' ? 'add-circle' : 'remove-circle'}
                  size={24}
                  color="#007bff"
              />
              <Text style={styles.modeToggleText}>
                {inputMode === 'standard' ? 'Advanced' : 'Basic'} Mode
              </Text>
            </TouchableOpacity>
          </View>

          {/* Workout Type Input */}
          <TextInput
              style={styles.input}
              placeholder="Workout Type (e.g., Running, Yoga)"
              value={workoutType}
              onChangeText={setWorkoutType}
          />

          {/* Duration Input */}
          <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
          />

          {/* Intensity Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Intensity:</Text>
            <Picker
                selectedValue={intensity}
                style={styles.picker}
                onValueChange={(itemValue) => setIntensity(itemValue)}
            >
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
          </View>

          {/* Date Selection */}
          <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar" size={20} color="#007bff" style={styles.dateIcon} />
            <Text>Selected Date: {date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
              <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
              />
          )}

          {/* Advanced Inputs */}
          {inputMode === 'advanced' && (
              <>
                <TextInput
                    style={styles.input}
                    placeholder="Calories Burned (optional)"
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                />
                <TextInput
                    style={[styles.input, styles.notesInput]}
                    placeholder="Workout Notes (optional)"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                />
              </>
          )}

          {/* Add Workout Button */}
          <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddWorkout}
          >
            <Text style={styles.addButtonText}>Add Workout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeToggleText: {
    marginLeft: 5,
    color: '#007bff',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 10,
  },
  label: {
    marginRight: 10,
    color: '#495057',
  },
  picker: {
    flex: 1,
    height: 50,
  },
  dateButton: {
    flexDirection: 'row',
    backgroundColor: '#f0f1f3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIcon: {
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WorkoutForm;