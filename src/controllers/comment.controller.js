import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    // console.log(videoId)
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if(!Number.isFinite(parsedPage)){
        throw new ApiError(400, "page is required")
    }

    if(!Number.isFinite(parsedLimit)){
        throw new ApiError(400, "Limit is required")
    }

    const aggregationPipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $sort: { createdAt: -1 } // Optional: sort comments by creation date
        }
    ];
    const options = {
        page : parsedPage,
        limit: parsedLimit
    }
    
    console.log(options)
    const comments = await Comment.aggregatePaginate(
        Comment.aggregate(aggregationPipeline),
        options
    )
   

    return res.status(200).json(
        new ApiResponse(200, comments, "All Video Comment Fetched Successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "comment missing")
    }

    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId")
    }

    const comment = await Comment.create(
        {
            content: content,
            video: videoId,
            owner: req.user._id
        }
    )

    if (!comment) {
        throw new ApiError(400, "Error while creating comment")
    }

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment Succesfully Created")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content Missing");
    }

    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid CommentId");
    }

    const updateComment = await Comment.findByIdAndUpdate(
        { _id: commentId },
        {
            $set: { content }
        }
    )

    if (!updateComment) {
        throw new ApiError(400, "Error while updating comment")
    }

    return res.status(200).json(
        new ApiResponse(200, updateComment, "Comment Successfully Updated")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid CommnetId")
    }
    const deleteComment = await Comment.deleteOne({ _id: commentId });

    if (!deleteComment) {
        throw new ApiError(400, "Error While deleting Comment")
    }

    return res.status(200).json(
        new ApiResponse(200, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
