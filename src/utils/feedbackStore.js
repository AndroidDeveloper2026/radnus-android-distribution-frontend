let feedbacks = [];

let listeners = [];

// 🔔 Subscribe for live updates
export const subscribeFeedback = (cb) => {
 listeners.push(cb);
 return () => {
   listeners = listeners.filter(l => l !== cb);
 };
};

const notify = () => {
 listeners.forEach(l => l());
};

// ➕ Add feedback
export const addFeedback = ({ message, user, phone }) => {
 const newFeedback = {
   id: Date.now().toString(),
   message,
   user,
   phone,
   status: "PENDING",
   createdAt: new Date().toISOString(),
 };

 feedbacks.unshift(newFeedback);
 notify();
};

// 📥 Get all feedback
export const getAllFeedback = () => feedbacks;

// 🔄 Update status
export const updateFeedbackStatus = (id, status) => {
 feedbacks = feedbacks.map(f =>
   f.id === id ? { ...f, status } : f
 );
 notify();
};
