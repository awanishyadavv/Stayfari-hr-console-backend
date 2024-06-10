import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
    caller: { type: String, required: true },
    caller_Id: { type: String, required: true },
    callResult: { type: String, required: true },
    callTime: { type: Date, default: Date.now }
});

const interviewSchema = new mongoose.Schema({
    time: { type: String, default: null },
    date: { type: String, default: null },
    zone: { type: String, default: null },
    note: { type: String, default: null },
    noteAfterInterview: { type: String, default: null },
    interviewers: [{
        name: { type: String, default: null },
        id: { type: String, default: null }
    }],
    interviewLink: { type: String, default: null },
    isInterviewCompleted: { type: Boolean, default: false }
});

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    experience: { type: String, required: true },
    expected_salary: { type: String, required: true },
    current_location: { type: String, required: true },
    current_Job: { type: String, required: true },
    notice_Period: { type: String, required: true },
    highest_Degree: { type: String, required: true },
    preferd_Locations: { type: [String], required: true },
    key_Skills: { type: [String], required: true },
    shortlisted_profile_for: { type: String, default: null },
    poc_hr: { type: String, default: null },
    latest_resume: {
        type: {
            fileName: { type: String, default: null },
            fileLocation: { type: String, default: null }
        },
        required: false
    },
    sourceOfProfile: { type: String, required: false },
    referral: {
        type: {
            employeeName: { type: String, required: true, default:null},
            employeeCode: { type: String,required: true, default: null },
            employeeEmail: { type: String,required: true, default: null }
        },
        required: true
    },
    stages_crossed: {
        type: [{
            passed_stage: { type: String, required: true },
            passed_stage_Comment: { type: String, required: true }
        }],
        required: false
    },
    current_stage: { type: String, default: "New Profile" },
    current_stage_comment: { type: String, required: false },
    calls: { type: [callSchema], required: false },
    new_interview: { type: interviewSchema, default: {} },
    passed_interviews: { type: [interviewSchema] }
}, {
    timestamps: true 
});

export const Candidate = mongoose.model('Candidate', candidateSchema);
