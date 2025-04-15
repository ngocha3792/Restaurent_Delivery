const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true }, 
  description: { type: String, required: true },  
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employee", 
    required: true 
  },  
  status: { 
    type: String, 
    enum: ["pending", "in_progress", "completed"],  
    default: "pending" 
  },
  startTime: { type: Date, required: true }, 
  endTime: { type: Date },  
  taskType: { 
    type: String, 
    enum: ["cooking", "delivery", "waiting", "inventory", "assitant_chef"], 
    required: true 
  },
  taskDetails: { 
    type: Map, 
    of: mongoose.Schema.Types.Mixed,  
    required: true 
  }
});


module.exports = mongoose.model('Task', taskSchema);