import { Data } from "../models/data.js";
import { User } from "../models/user.js";

export const giveAccess = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { access } = req.body;

        // Validate access range
        if (parseInt(access.accessRange[0]) >= parseInt(access.accessRange[1])) {
            return res.status(400).json({
                success: false,
                message: "Invalid range: startRange must be less than endRange"
            });
        }

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const existingAccessIndex = user.access.findIndex(item => item.accessDataId === access.accessId);

        if (existingAccessIndex !== -1) {
            // Update existing access
            user.access[existingAccessIndex].accessDataRange = access.accessRange;
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Access already exists, updated to new parameters."
            });
        } else {
            // Add new access
            let dataFileName = await Data.findById(access.accessId, 'fileName');
            user.access.push({
                accessDataName: dataFileName.fileName,
                accessDataId: access.accessId,
                accessDataRange: access.accessRange
            });
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Access to data added successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const removeAccess = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { removeAccessId } = req.body;

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const accessIndexToRemove = user.access.findIndex(item => item.accessDataId === removeAccessId);

        if (accessIndexToRemove === -1) {
            return res.status(404).json({
                success: false,
                message: "Access not found for the specified accessDataId."
            });
        }

        user.access.splice(accessIndexToRemove, 1);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Access removed successfully",
        });
    } catch (error) {
        next(error);
    }
};
