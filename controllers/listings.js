const Listing = require("../models/listing.js");
const slugify = require("slugify");
const escapeRegex=require("../utils/regex.js");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}; 

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(listing.reviews[0].author.username);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const url=req.file.path;
  const filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image={url,filename};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  if(listing.image.url.includes("/upload")){
  listing.image.url=listing.image.url.replace("/upload","/upload/ar_1.0,c_fill,h_150,w_150");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(req.file){
    const url=req.file.path;
    const filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
 

module.exports.listByCategory=async (req, res) => {
  let { category } = req.params;
  const allCategories = await Listing.distinct("category");
  const originalCategory = allCategories.find(
    (cat) => slugify(cat, { lower: true }) === category
  );
  if (!originalCategory) {
    req.flash("error", `No listings found for ${category}.`);
    return res.redirect("/listings");
  }
  const allListings = await Listing.find({ category: originalCategory });
  res.render("listings/index.ejs", { allListings });
}


module.exports.searchListing=async (req, res) => {
  let { q } = req.query;
  const safeQ = escapeRegex(q);
  const regex = new RegExp(safeQ.split(/\s+/).join(".*"), "i");
  let allListings = await Listing.find({ location: regex });
  console.log(allListings);
  if (allListings.length === 0) {
    req.flash("error", `No listings found for "${q}".`);
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings });
}