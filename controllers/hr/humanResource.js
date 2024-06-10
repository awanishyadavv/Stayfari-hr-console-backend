import { Candidate } from "../../models/hr/humanResource.js";
import ErrorHandler from "../../middelwares/error.js";

export const extensionCandidateData = async (req, res, next) => {
    try {
        const { name, phone, email, experience, expected_salary, current_location, current_Job, notice_Period, highest_Degree, preferd_Locations, key_Skills, shortlisted_profile_for, poc_hr } = req.body;

        const adjustedPhone = phone === "View phone number" ? "" : phone.replace(/\s*\(M\)\s*|\s/g, '');

        const preferedLocationsArray = preferd_Locations.split(',').map(location => location.trim());

        let adjustedCurrentJob = current_Job.replace(/Current\s*/i, '').trim();
        adjustedCurrentJob = adjustedCurrentJob.replace(/\s+/g, ' ');
        adjustedCurrentJob = adjustedCurrentJob.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

        const candidate = await Candidate.findOneAndUpdate(
            { email },
            {
                name, phone: adjustedPhone, experience, expected_salary, current_location, current_Job: adjustedCurrentJob, notice_Period, highest_Degree, preferd_Locations: preferedLocationsArray, key_Skills, shortlisted_profile_for, poc_hr
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({
            success: true,
            message: `${name} registered successfully`
        });
    } catch (error) {
        next(error);
    }
};


export const addNewCall = async (req, res, next) => {
    try {
        const { email, caller, caller_Id, callResult } = req.body;
        console.log(callResult);
        const newCall = { caller, caller_Id, callResult };
        const candidate = await Candidate.findOneAndUpdate(
            { email },
            { $push: { calls: newCall } },
            { new: true, upsert: false }
        );
        if (!candidate) return next(new ErrorHandler("Candidate not found", 404));

        res.status(200).json({
            success: true,
            message: "Call added successfully",
        });
    } catch (error) {
        next(error);
    }
};


export const getCandidatesByStage = async (req, res, next) => {
    console.log(2);
    try {
        const { stage } = req.params;
        const candidates = await Candidate.find({ current_stage: stage });
        if (!candidates || candidates.length === 0) {
            return next(new ErrorHandler("No candidates found for the given stage", 404));
        }
        res.status(200).json({
            success: true,
            candidates
        });
    } catch (error) {
        next(error);
    }
};

export const getCandidateByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;

        const candidate = await Candidate.findOne({ email });

        if (!candidate) {
            return next(new ErrorHandler("Candidate not found", 404));
        }

        res.status(200).json({
            success: true,
            candidate
        });
    } catch (error) {
        next(error);
    }
};

export const addNewReferral = async (req, res, next) => {
    try {
        const { email, employeeName, employeeCode, employeeEmail } = req.body;
        const newReferral = { employeeName, employeeCode, employeeEmail };
        const candidate = await Candidate.findOneAndUpdate(
            { email },
            { $set: { referral: newReferral } },
            { new: true, upsert: false }
        );

        if (!candidate) return next(new ErrorHandler("Candidate not found", 404));

        res.status(200).json({
            success: true,
            message: "Referral added successfully",
            candidate
        });
    } catch (error) {
        next(error);
    }
};

export const changeStage = async (req, res, next) => {
    try {
        const { email } = req.params;
        const { stage, current_stage_comment } = req.body;

        const candidate = await Candidate.findOne({ email });

        if (!candidate) {
            return next(new ErrorHandler("Candidate not found", 404));
        }

        const oldStage = candidate.current_stage;

        const passedStage = {
            passed_stage: oldStage,
            passed_stage_Comment: candidate.current_stage_comment
        };

        const updatedCandidate = await Candidate.findOneAndUpdate(
            { email },
            {
                $set: { current_stage: stage, current_stage_comment },
                $push: { stages_crossed: passedStage }
            },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Stage updated successfully",
            candidate: updatedCandidate
        });
    } catch (error) {
        next(error);
    }
};

export const scheduleInterview = async (req, res, next) => {
    try {
        const { email, time, date, zone, note, interviewers, interviewLink } = req.body;

        const newInterview = { time, date, zone, note, interviewers, interviewLink };

        const candidate = await Candidate.findOneAndUpdate(
            { email },
            { $set: { new_interview: newInterview } },
            { new: true, upsert: false }
        );

        if (!candidate) return next(new ErrorHandler("Candidate not found", 404));

        res.status(200).json({
            success: true,
            message: "Interview scheduled successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const isInterviewCompleted = async (req, res, next) => {
    try {
        const { email, isCompleted, comment } = req.body;
        console.log(comment);

        if (!email || isCompleted === undefined) {
            return next(new ErrorHandler("Email and interview status are required", 400));
        }

        const candidate = await Candidate.findOne({ email });

        if (!candidate) {
            return next(new ErrorHandler("Candidate not found", 404));
        }

        if (!candidate.new_interview) {
            return next(new ErrorHandler("No ongoing interview found for the candidate", 404));
        }

        // Update the candidate document
        const updatedCandidate = await Candidate.findOneAndUpdate(
            { email },
            {
                $set: {
                    'new_interview.noteAfterInterview': comment,
                    isInterviewCompleted: isCompleted
                }
            },
            { useFindAndModify: false, new: true }
        );
        
        console.log("Updated Candidate:", updatedCandidate);

        // If the interview is completed, move the interview to passed_interviews
        if (isCompleted) {
            const completedInterview = updatedCandidate.new_interview;
            const newInterview = {
                time: null,
                date: null,
                zone: null,
                note: null,
                interviewers: null,
                interviewLink: null,
                noteAfterInterview: null
            };

            await Candidate.findOneAndUpdate(
                { email },
                {
                    $set: { new_interview: newInterview },
                    $push: { passed_interviews: completedInterview }
                },
                { useFindAndModify: false }
            );
        }

        // Send the updated candidate in the response
        res.status(200).json({
            success: true,
            message: "Interview status updated successfully",
            candidate: updatedCandidate
        });
    } catch (error) {
        console.error("Error updating interview status:", error); // Log any errors
        next(error);
    }
};


export const listInterviews = async (req, res, next) => {
    console.log(1);

    try {
        const { date } = req.query;
        const today = new Date().toISOString().split('T')[0];

        if (date === "loadall") {
            const upcomingInterviews = await Candidate.find({
                "new_interview.date": { $gte: today }
            });
            res.status(200).json({
                success: true,
                interviews: upcomingInterviews,
                message: "All upcoming interviews loaded successfully"
            });
        } else if (date >= today) {
            const candidatesWithNewInterviews = await Candidate.find({
                "new_interview.date": date
            });
            res.status(200).json({
                success: true,
                interviews: candidatesWithNewInterviews,
                message: `Interviews for ${date} loaded successfully`
            });
        } else {
            const candidatesWithPassedInterviews = await Candidate.find({
                passed_interviews: {
                    $elemMatch: {
                        date: date
                    }
                }
            });
            res.status(200).json({
                success: true,
                interviews: candidatesWithPassedInterviews,
                message: `Interviews for ${date} loaded successfully`
            });
        }
    } catch (error) {
        next(error);
    }
};
