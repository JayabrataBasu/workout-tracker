// App.js
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import WorkoutScreen from './screens/WorkoutScreen';

export default function App() {
  return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <SafeAreaView style={styles.container}>
          <WorkoutScreen />
        </SafeAreaView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
});

// screens/WorkoutScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutList from '../components/WorkoutList';
import WorkoutStats from '../components/WorkoutStats';
import { saveWorkouts, loadWorkouts } from '../utils/storage';

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Load workouts when component mounts
  useEffect(() => {
    loadSavedWorkouts();
  }, []);

  // Load saved workouts from storage
  const loadSavedWorkouts = async () => {
    const savedWorkouts = await loadWorkouts();
    setWorkouts(savedWorkouts);
  };

  // Add new workout
  const addWorkout = async (newWorkout) => {
    const updatedWorkouts = [...workouts, { ...newWorkout, id: Date.now() }];
    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
  };

  // Delete workout
  const deleteWorkout = async (id) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
  };

  // Edit workout
  const editWorkout = async (editedWorkout) => {
    const updatedWorkouts = workouts.map(workout =>
        workout.id === editedWorkout.id ? editedWorkout : workout
    );
    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
    setSelectedWorkout(null);
  };

  return (
      <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenTitle}>Fitness Tracker</Text>

        <WorkoutForm
            onAddWorkout={addWorkout}
            selectedWorkout={selectedWorkout}
            onEditWorkout={editWorkout}
        />

        <WorkoutStats workouts={workouts} />

        <WorkoutList
            workouts={workouts}
            onDeleteWorkout={deleteWorkout}
            onEditWorkout={setSelectedWorkout}
        />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50',
  },
});

// components/WorkoutForm.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function WorkoutForm({
                                      onAddWorkout,
                                      selectedWorkout,
                                      onEditWorkout
                                    }) {
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Populate form when a workout is selected for editing
  useEffect(() => {
    if (selectedWorkout) {
      setWorkoutType(selectedWorkout.type);
      setDuration(selectedWorkout.duration.toString());
      setIntensity(selectedWorkout.intensity);
      setWorkoutDate(new Date(selectedWorkout.date));
    } else {
      resetForm();
    }
  }, [selectedWorkout]);

  const resetForm = () => {
    setWorkoutType('');
    setDuration('');
    setIntensity('medium');
    setWorkoutDate(new Date());
  };

  const handleSubmit = () => {
    // Basic validation
    if (!workoutType || !duration) {
      alert('Please fill in all fields');
      return;
    }

    const workoutData = {
      type: workoutType,
      duration: parseInt(duration),
      intensity: intensity,
      date: workoutDate.toLocaleDateString()
    };

    if (selectedWorkout) {
      // Editing existing workout
      onEditWorkout({
        ...workoutData,
        id: selectedWorkout.id
      });
    } else {
      // Adding new workout
      onAddWorkout(workoutData);
    }

    resetForm();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || workoutDate;
    setShowDatePicker(Platform.OS === 'ios');
    setWorkoutDate(currentDate);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {selectedWorkout ? 'Edit Workout' : 'Log Workout'}
        </Text>

        <TextInput
            style={styles.input}
            placeholder="Workout Type (e.g., Running, Yoga)"
            value={workoutType}
            onChangeText={setWorkoutType}
        />

        <TextInput
            style={styles.input}
            placeholder="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
        />

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

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Workout Date:</Text>
          <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
          >
            <Text>{workoutDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
              <DateTimePicker
                  testID="dateTimePicker"
                  value={workoutDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
              />
          )}
        </View>

        <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {selectedWorkout ? 'Update Workout' : 'Add Workout'}
          </Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e4e8',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f6f8fa',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    marginRight: 10,
    color: '#4a5568',
  },
  picker: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// components/WorkoutList.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function WorkoutList({
                                      workouts,
                                      onDeleteWorkout,
                                      onEditWorkout
                                    }) {
  const renderWorkoutItem = ({ item }) => (
      <View style={styles.workoutItem}>
        <View style={styles.workoutDetails}>
          <Text style={styles.workoutType}>{item.type}</Text>
          <Text style={styles.workoutText}>
            Duration: {item.duration} mins
          </Text>
          <Text style={styles.workoutText}>
            Intensity: {item.intensity}
          </Text>
          <Text style={styles.workoutText}>
            Date: {item.date}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
              style={styles.editButton}
              onPress={() => onEditWorkout(item)}
          >
            <Feather name="edit" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteWorkout(item.id)}
          >
            <Feather name="trash-2" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
  );

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Workouts</Text>
        <FlatList
            data={workouts}
            renderItem={renderWorkoutItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No workouts logged yet</Text>
            }
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  workoutItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutType: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#2c3e50',
  },
  workoutText: {
    color: '#4a5568',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 6,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

// components/WorkoutStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WorkoutStats({ workouts }) {
  // Calculate total duration
  const totalDuration = workouts.reduce((sum, workout) =>
      sum + parseInt(workout.duration), 0);

  // Count workouts by intensity
  const intensityCounts = workouts.reduce((counts, workout) => {
    counts[workout.intensity] = (counts[workout.intensity] || 0) + 1;
    return counts;
  }, {});

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout Summary</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Workouts</Text>
            <Text style={styles.statValue}>{workouts.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Duration</Text>
            <Text style={styles.statValue}>{totalDuration} mins</Text>
          </View>
        </View>
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityTitle}>Intensity Breakdown</Text>
          {Object.entries(intensityCounts).map(([intensity, count]) => (
              <View key={intensity} style={styles.intensityRow}>
                <Text style={styles.intensityText}>
                  {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                </Text>
                <Text style={styles.intensityCount}>{count}</Text>
              </View>
          ))}
        </View>
      </View>
  );
}

// components/WorkoutStats.js (continued)
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    backgroundColor: '#f6f8fa',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  statLabel: {
    color: '#4a5568',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  intensityContainer: {
    backgroundColor: '#f6f8fa',
    borderRadius: 10,
    padding: 15,
  },
  intensityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  intensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  intensityText: {
    color: '#4a5568',
  },
  intensityCount: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

// utils/storage.js (optional enhancements)
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveWorkouts = async (workouts) => {
  try {
    await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
  } catch (error) {
    console.error('Error saving workouts', error);
    // Consider adding a user-friendly error handling mechanism
    alert('Failed to save workout. Please try again.');
  }
};

export const loadWorkouts = async () => {
  try {
    const workouts = await AsyncStorage.getItem('workouts');
    return workouts ? JSON.parse(workouts) : [];
  } catch (error) {
    console.error('Error loading workouts', error);
    // Consider adding a user-friendly error handling mechanism
    alert('Failed to load workouts. Please restart the app.');
    return [];
  }
};

// Optional: Add a method to clear all workouts
export const clearWorkouts = async () => {
  try {
    await AsyncStorage.removeItem('workouts');
    return true;
  } catch (error) {
    console.error('Error clearing workouts', error);
    return false;
  }
};