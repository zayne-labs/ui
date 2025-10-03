export const dashboardLinkItems = [
	{
		icon: "mynaui:grid",
		label: "Dash Board",
		link: "/admin/school/dashboard",
	},
	{
		icon: "fluent:document-one-page-add-24-regular",
		label: "Register Class",
		link: "/admin/school/dashboard/register/class",
	},
	{
		icon: "fluent:document-one-page-add-24-regular",
		label: "Register Subjects",
		link: "/admin/school/dashboard/register/subject",
	},
	{
		icon: "streamline:user-add-plus",
		label: "Register Students",
		link: "/admin/school/dashboard/register/student",
	},
	{
		icon: "streamline:interface-edit-view-eye-eyeball-open-view",
		items: [
			{ label: "View all Students", link: "/admin/school/dashboard/students/view-all" },
			{ label: "View a Student", link: "/admin/school/dashboard/students/view-single" },
		],
		label: "View Student",
		link: null,
	},
	{
		icon: "solar:upload-minimalistic-linear",
		label: "Input Student Scores",
		link: "/admin/school/dashboard/students/input-scores",
	},
];
