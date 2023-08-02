
import express from "express"
import { bookflightcontroller, createordercontroller, getaccesstokencontroller, getlocationcontroller, getwebhookscontroller, searchflightcontroller } from "../controller/duffelcontroller.js";
const router=express.Router();

router.route("/search/flight").post(searchflightcontroller);
router.route('/search/flight/book').post(bookflightcontroller);
router.route("/search/flightcity").post(getlocationcontroller);
router.route("/search/accesstoken").post(getaccesstokencontroller);
router.route("/search/create/order").post(createordercontroller)
router.route("/search/webhooks").post(getwebhookscontroller)



export default router;