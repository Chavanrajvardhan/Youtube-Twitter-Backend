import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    //find all video documents using video id with status code published 
    //validate 
    
    const video = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user?._id),
                isPublished: true
            }
        },
        {
            $sort:{createdAt: -1}
        }
    ])

    console.log(video)
    if(!video){
        throw new ApiError(400, "Videos not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,video, "All Channel Video Fetched Successfully")
    )

})

export { 
    getChannelVideos
    }