import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import WorkoutForm from './WorkoutForm';
import WorkoutList from './WorkoutList';
import { saveWorkouts, loadWorkouts } from '../utils/storage';

const WorkoutScreen = () => {
  const [workouts, setWorkouts] = useState([]);

  // Load workouts when component mounts
  useEffect(() => {
    loadSavedWorkouts();
  }, []);

  // Load saved workouts from storage
  const loadSavedWorkouts = async () => {
    try {
      const savedWorkouts = await loadWorkouts();
      setWorkouts(savedWorkouts);
    } catch (error) {
      console.error('Error loading workouts', error);
    }
  };

  // Add new workout
  const handleAddWorkout = async (newWorkout) => {
    try {
      const updatedWorkouts = [...workouts, newWorkout];
      setWorkouts(updatedWorkouts);
      await saveWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error adding workout', error);
    }
  };

  // Delete workout
  const handleDeleteWorkout = async (id) => {
    try {
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);
      setWorkouts(updatedWorkouts);
      await saveWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error deleting workout', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WorkoutForm onAddWorkout={handleAddWorkout} />
      <WorkoutList 
        workouts={workouts} 
        onDeleteWorkout={handleDeleteWorkout} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});

export default WorkoutScreen;