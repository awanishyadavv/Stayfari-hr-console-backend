import { access } from "fs";
import { Data } from "../models/data.js";
import { User } from "../models/user.js";

export const loadAccess = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId,'access');
        res.status(200).json({
            success:true,
            access:user.access,
            message:"Access loaded Succcessfully"
        })
    } catch (error) {
        next(error)
    }
}

export const loadData = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const { dataId } = req.query;
        console.log(dataId);
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
                message: "DataId not found in user's access list."
            });
        }
        const accessDataRange = accessObject.accessDataRange;
        const startIndex = accessDataRange[0]
        const endIndex = accessDataRange[1]

        console.log(startIndex);
        console.log(endIndex);
        const data = await Data.findById(dataId, { data: { $slice: [startIndex, endIndex - startIndex + 1] } });

        if(data === null){
            return res.status(404).json({
                success:false,
                message:"Data doesn't exist or Deleted from origin."
            })
        }
        
        res.status(200).json({
            success: true,
            data,
            message: "Data loaded successfully"
        });
    } catch (error) {
        next(error);
    }
};
