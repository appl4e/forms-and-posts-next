/**
 * Handles POST requests for form submission.
 * Saves the submission to MongoDB and sends an email notification.
 * @param req The incoming NextRequest object.
 * @returns A NextResponse object with the result.
 */

import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		// 1. Parse the request body
		const data = await req.json();
		console.log(data);

		const { name, email, phone, message } = data;
		if (!name || !email || !phone) {
			return NextResponse.json({ message: "Missing data for any required field" }, { status: 400 });
		}

		// --- DATABASE INTERACTION (Prisma) ---
		// 2. Save the submission to MongoDB
		const submission = await db.contactFormSubmission.create({
			data: { name, email, phone, message },
		});

		if (!submission || !submission) {
			// Throw an error to correctly trigger the catch block and log the failure
			throw new Error("Prisma CREATE operation failed or returned an invalid ID. Check MongoDB permissions or connection string.");
		}

		console.log(`Form Submission data stored successfully for ${email}. Id ${submission.id}`);

		return NextResponse.json({ message: "Form Submitted successfully", submissionId: submission.id }, { status: 200 });
	} catch (error) {
		console.log("submission failed", error);

		let errorMessage = "An unknown error occurred.";

		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return NextResponse.json({ message: "Submission failed due to server error", details: errorMessage }, { status: 500 });
	}
}
