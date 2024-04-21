import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFileOnCloudinary, deleteVideoOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    const { title, description } = req.body;

    if (!(title && description)) {
        throw new ApiError(400, "title and description required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!(videoLocalPath && thumbnailLocalPath)) {
        throw new ApiError(400, "video file and thumbnail required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)


    if (!(videoFile && thumbnail)) {
        throw new ApiError(400, "Error while uploading video and thumbnail on cloudinary")
    }

    const video = await Video.create({
        videoFile: videoFile?.url,
        thumbnail: thumbnail?.url,
        title: title,
        description: description || "",
        duration: videoFile?.duration,
        owner: req.user._id,
        isPublished: true
    })

    const publishedVideo = await Video.findById(video._id)

    if (!publishedVideo) {
        throw new ApiError("Error while publishing video")
    }

    res.status(200).json(
        new ApiResponse(200, publishedVideo, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video id missing")
    }

    const getVideoById = await Video.findById({ _id: videoId })

    if (!getVideoById) {
        throw new ApiError(400, "Video not found")
    }

    res.status(200).json(
        new ApiResponse(200, getVideoById, "Retrieved video by ID")
    )

})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail

    const { videoId } = req.params
    const { title, description } = req.body;

    const  thumbnailLocalPath = req.file?.path;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "video id missing")
    }

    if (!(title || description)) {
        throw new ApiError(400, "title and description required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thimbnail path error")
    }

    const oldUserInfo = await Video.findById(videoId).select("-password -refreshToken");
    await deleteFileOnCloudinary(oldUserInfo.thumbnail)

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnail) {
        throw new ApiError(400, "Error while uploading thumbnail on Cloudinary")
    }

    const updateVideoInfo = await Video.findByIdAndUpdate(
        {
            _id: videoId,
        },
        {
            $set: {
                title,
                description: description || "",
                thumbnail: thumbnail?.url || ""
            }
        },
        {
            new: true
        }
    )

    if (!updateVideoInfo) {
        throw new ApiError(400, "Error while updating info")
    }

    res.status(200).json(
        new ApiResponse(200, updateVideoInfo, "Video information updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id missing")
    }
    
    const oldVideoInfo = await Video.findOne({_id : videoId})

    const deleteVideo = await Video.deleteOne({ _id: videoId })
    await deleteFileOnCloudinary(oldVideoInfo.thumbnail)
    await deleteVideoOnCloudinary(oldVideoInfo.videoFile)

    if (!deleteVideo) {
        throw new ApiError(400, "Error while deleting video")
    }

    res.status(200).json(
        new ApiResponse(200, "Video deleted successfully ")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video id missing")
    }

    const togglePublishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: { isPublished: !isPublished }
        }
    )
    if (!togglePublishStatus) {
        throw new ApiError(400, "Error while change to publish status")
    }

    res.status(200).json(
        new ApiResponse(200, togglePublishStatus, "toggele publisc status successfull")// visit again
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
