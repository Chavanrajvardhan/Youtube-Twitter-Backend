import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const tweetData = req.body;

    if (!tweetData || !tweetData.content) {
        throw new ApiError(400, "Data is Required")
    }

    const tweet = await Tweet.create({
        content: tweetData.content,
        owner: req.user._id
    })

    const createdTweet = await Tweet.findById(tweet._id)

    if (!createdTweet) {
        throw new ApiError(400, "Somthing Went Wrong While Creating Tweet")
    }

    return res.status(200).json(
        new ApiResponse(200, createdTweet, "Tweet Sucsessfully Created")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    
    if(!(isValidObjectId(userId))){
        throw new ApiError(400, "User ID missing")
    }

    const allTweets = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "allTweets"
            }
        },
        {
            $project: {
                allTweets: 1,
            }
        }
    ]);

    if (allTweets.length === 0) {
        throw new ApiError(400, "Error while getting all tweets")
    }

    return res.status(200).json(
        new ApiResponse(200, allTweets, "All tweets Successfully retrived")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetData} = req.body;
    const {tweetId} = req.params

    if (!tweetData || !tweetData.content) {
        throw new ApiError(400, "Data is Required")
    }

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: tweetData.content,
                owner: req.user._id
            }
        },
        {
            new: true
        }
    )


    const updatedTweet = await Tweet.findById(tweet._id)

    if (!updatedTweet) {
        throw new ApiError(401, "Error while updating tweet")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet Successfully Updated")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const deleteTweet = await Tweet.deleteOne(
        {
            _id: req.params.tweetId
        }
    )

    if (!deleteTweet) {
        throw new ApiError(400, "Error While Deleting Tweet")
    }

    return res.status(200).json(
        new ApiResponse(200, "Tweet Deleted Successfully")
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
