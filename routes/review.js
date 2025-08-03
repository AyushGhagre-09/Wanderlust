const express=require("express");
const router=express.Router({mergeParams:true});
const AsyncWrap=require("../utils/wrapAsync.js");

const { validateReview,isLoggedIn,isAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
// Reviews
// Post Review route
router.post("/",isLoggedIn,validateReview,AsyncWrap(reviewController.createReview));

//delete Review Route
router.delete("/:reviewId",isLoggedIn,isAuthor,AsyncWrap(reviewController.deleteReview));

module.exports=router;
