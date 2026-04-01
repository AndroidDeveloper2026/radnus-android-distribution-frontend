import React, { useState } from "react";
import {
 View,
 Text,
 TextInput,
 TouchableOpacity,
 Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { createFeedback } from "../../services/features/retailer/feedbackSlice";
import styles from "./FeedbackStyle";
import Header from "../../components/Header";

const FeedbackScreen = () => {
 const [message, setMessage] = useState("");
 const dispatch = useDispatch();

 const handleSubmit = () => {
   if (!message.trim()) {
     Alert.alert("Error", "Enter feedback");
     return;
   }

   dispatch(
     createFeedback({
       message,
       user: "Retailer A",
       phone: "9876543210",
     })
   );

   setMessage("");
   Alert.alert("Success", "Submitted");
 };

 return (
     <View style={styles.container}>
     <Header title="Feedback" />

     <View style={styles.card}>
       <Text style={styles.label}>Your Feedback</Text>

       <TextInput
         style={styles.input}
         placeholder="Write your feedback..."
         multiline
         value={message}
         onChangeText={setMessage}
       />

       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
         <Text style={styles.buttonText}>Submit</Text>
       </TouchableOpacity>
     </View>
   </View>
 );
};

export default FeedbackScreen;
