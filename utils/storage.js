import AsyncStorage from '@react-native-async-storage/async-storage';

// Save workouts to AsyncStorage
export const saveWorkouts = async (workouts) => {
  try {
    const jsonValue = JSON.stringify(workouts);
    await AsyncStorage.setItem('@workout_storage', jsonValue);
  } catch (error) {
    console.error('Error saving workouts', error);
    throw error;
  }
};

// Load workouts from AsyncStorage
export const loadWorkouts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@workout_storage');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading workouts', error);
    return [];
  }
};

// Clear all workouts from storage
export const clearWorkouts = async () => {
  try {
    await AsyncStorage.removeItem('@workout_storage');
  } catch (error) {
    console.error('Error clearing workouts', error);
    throw error;
  }
};