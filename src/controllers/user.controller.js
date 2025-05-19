import { asyncHandler } from '../utils/asyncHandeler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import {cloudnaryFileUpload} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';


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

export {registerUser};