const express = require("express");
const router = express.Router();
const AsyncWrap = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(AsyncWrap(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    AsyncWrap(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search",AsyncWrap(listingController.searchListing));
router
  .route("/:id")
  .get(AsyncWrap(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    upload.single("listing[image]"),
    AsyncWrap(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, AsyncWrap(listingController.deleteListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  AsyncWrap(listingController.renderEditForm)
);

router.get("/category/:category",validateListing,AsyncWrap(listingController.listByCategory));

module.exports = router;
