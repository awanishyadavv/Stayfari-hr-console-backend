import { ObjectId } from 'mongodb';
import { Data } from "../models/data.js";
import XLSX from 'xlsx';
import { User } from "../models/user.js";

export const convertToJson = async (req, res, next) => {
    try {
        const filePath = req.file.path;
        const fileName = req.file.filename;

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        await Data.create({fileName, filePath, data})

        let fetchData = await Data.findOne({fileName});

        res.status(200).json({ success: true, message: `File uploaded, Data fetch Successfully, Storage_Id ${fetchData._id}` });

    } catch (error) {
        next(error)
    }
};

export const getAllDataFileName = async (req, res, next) => {
    try {
        const allDataFileNameIntheServer = await Data.find({},'fileName') 
        res.status(200).json({
            success:true,
            message:"File Name fetch Successful",
            data:allDataFileNameIntheServer
        })
    } catch (error) {
        next(error)
    }
}

export const getDataRangeWithFileId = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Convert the id parameter to an ObjectId
        const objectId = new ObjectId(id);
        const result = await Data.aggregate([
            { $match: { _id: objectId } }, // Filter documents by _id
            { $project: { 'dataLength': { $size: "$data" } } } // Project the length of the data array
        ]);
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        const dataLength = result[0].dataLength;
        res.status(200).json({
            success: true,
            message: "Data fetch Successful",
            dataLength: dataLength
        });
    } catch (error) {
        next(error);
    }
};

export const updateData = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const { dataId, email,  socialMedia, purpose, profile, country, company, comment } = req.body;

        const user = await User.findById(userId, 'access')
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const accessObject = user.access.find(accessItem => accessItem.accessDataId === dataId);
        if (!accessObject) {
            return res.status(404).json({
                success: false,
                message: "Access not found in user's access list."
            });
        }

        const result = await Data.updateOne(
            { _id: new ObjectId(dataId), "data.Email": email },
            {
                $set: {
                    "data.$.Profile_1": socialMedia,
                    "data.$.Purpose of the reservation ": purpose,
                    "data.$.Profile": profile,
                    "data.$.From ": country,
                    "data.$.Company/Profession": company,
                    "data.$.Remark ": comment
                }
            }
        );        

        if (result.matchedCount !== 1) {
            return res.status(404).json({
                success: false,
                message: "Data not found with the provided email."
            });
        }

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: true,
                message: "Make some changes first."
            });
        }

        res.status(200).json({
            success:true,
            message:`Data updated successfully for user ${email}` 
       })
    } catch (error) {
        next(error);
    }
}
