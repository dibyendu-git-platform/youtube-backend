import { asyncHandler } from '../utils/asyncHandeler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import {cloudnaryFileUpload} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const cookieOptions = {
        httpOnly: true,
        secure: true
}

const generateAccessandRefreshToken = async (userId) => {
     try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user data from request body
    //validation not empty
    //check if user already exists
    //check for images/ check for avatar
    //upload them to cloudnary
    //create user object - create entry in db
    //remove password and refresh tonken from user object
    //check for user creation
    //return response

    const { fullName, username, email, password } = req.body;

    if ([fullName, username, email, password].some(field => field.trim() === '')) {
      throw new ApiError(400, 'All fields are required');  
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if(existingUser) {
      throw new ApiError(400, 'User already exists');
    }

    const avatarLocalPath = req.files?.avatar[0].path;
    const coverImageLocalPath = req.files?.coverImage[0].path;

    if (!avatarLocalPath) {
      throw new ApiError(400, 'Avatar is required');
    }

    const avatar = await cloudnaryFileUpload(avatarLocalPath);
    let coverImage = null;
    if (coverImageLocalPath){
      coverImage = await cloudnaryFileUpload(coverImageLocalPath);
    }

    if (!avatar) {
      throw new ApiError(500, 'Failed to upload avatarImage');
    } 

    const newUser = await User.create({
        fullName,
        username,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage ? coverImage.url : "",        
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user from server side");
    } 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
});

const logInUser = asyncHandler( async (req, res) => {
   // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { email, password, username } = req.body;

    if ( !(email || username)){
        throw new ApiError(404, "Email or username is required");
    }

    if (!password) {
        throw new ApiError(404, "Password is required");
    }

    const user = await User.findOne({
        $or: [ { email }, { username } ]
    });

    if (!user) {
        throw new ApiError(404, "User not exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, accessToken, refreshToken
                },
            "User logged In Successfully"
        )
    )

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

export {registerUser, logInUser, logoutUser, refreshAccessToken};