"use client";

import { ContactFormSubmission } from "@/generated/prisma";
import { AlertTriangle, ArrowLeft, Calendar, Loader2, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";

const page = () => {
	const [submissions, setSubmissions] = useState<ContactFormSubmission[]>([]);
	const [loading, setLoading] = useState<boolean>();
	const [error, setError] = useState<string | null>(null);

	// Function to format the ISO date string into a readable format
	const formatDate = (dateString: Date) => {
		return new Date(dateString).toDateString();
	};

	useEffect(() => {
		const fetchSubmissions = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch("/api/contactFormData", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Failed to load data from API");
				}
				const data: ContactFormSubmission[] = await response.json();
				setSubmissions(data);
			} catch (error) {
				console.log("there was an error calling the api", error);
				setError(error instanceof Error ? error.message : "An unknown error has occurred while loading submissions.");
			} finally {
				setLoading(false);
			}
		};
		fetchSubmissions();
	}, []);
	// --- RENDERING STATES ---

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen bg-gray-50">
				<div className="flex flex-col items-center p-8 bg-white shadow-xl rounded-xl">
					<Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
					<p className="mt-4 text-gray-700 font-medium">Loading submissions...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen bg-gray-50 p-4">
				<div className="max-w-xl w-full p-6 bg-red-50 border border-red-200 rounded-xl shadow-lg">
					<div className="flex items-center text-red-700">
						<AlertTriangle className="w-6 h-6 mr-3" />
						<h2 className="text-xl font-bold">Error Loading Data</h2>
					</div>
					<p className="mt-2 text-sm text-red-600">{error}</p>
					<p className="mt-4 text-xs text-gray-500">Check your server console for database connection details or API route issues.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-8">
			<div className="max-w-4xl mx-auto">
				<a href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Form
				</a>
				<h1 className="text-4xl font-extrabold text-gray-900 mb-2 border-b-4 border-indigo-500 pb-2">Contact Form Submissions</h1>
				<p className="text-gray-600 mb-8">
					Total Submissions: <span className="font-bold text-indigo-600">{submissions.length}</span>
				</p>

				{submissions.length === 0 ? (
					<div className="p-8 text-center bg-white rounded-xl shadow-lg">
						<Mail className="w-10 h-10 text-indigo-400 mx-auto" />
						<p className="mt-4 text-gray-600 font-medium">No submissions found yet.</p>
						<p className="text-sm text-gray-400">Submit the form on the home page to see data here.</p>
					</div>
				) : (
					<div className="space-y-6">
						{submissions.map((submission) => (
							<div key={submission.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
								<div className="flex justify-between items-start mb-4 border-b pb-2">
									<div className="flex items-center">
										<User className="w-5 h-5 text-indigo-500 mr-3" />
										<p className="text-xl font-semibold text-gray-800">{submission.name}</p>
									</div>
									<div className="flex items-center text-sm text-gray-500">
										<Calendar className="w-4 h-4 mr-1" />
										{formatDate(submission.createdAt)}
									</div>
								</div>

								<div className="mb-4">
									<div className="flex items-center text-indigo-600 mb-1">
										<Mail className="w-4 h-4 mr-2" />
										<span className="font-medium text-sm">{submission.email}</span>
									</div>
								</div>

								<div>
									<h4 className="text-sm font-bold text-gray-700 mb-1">Message:</h4>
									<p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">{submission.message}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default page;
