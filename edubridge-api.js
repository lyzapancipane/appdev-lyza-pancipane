(function ()
{
	"use strict";

	function enforceRoleNavigation(role)
	{
		if (!role)
		{
			return;
		}

		document.querySelectorAll("a[href]").forEach(function(link)
		{
			const href = (link.getAttribute("href") || "").toLowerCase();
			const isAdminLink = href.indexOf("admin-") !== -1
				|| href.indexOf("inquirymanagement") !== -1
				|| href.indexOf("usermanagement") !== -1
				|| href.indexOf("verification") !== -1;

			if (role !== "admin" && isAdminLink)
			{
				link.hidden = true;
				link.remove();
				return;
			}

			if (role === "teacher" && href.indexOf("teacher-inquiries") !== -1)
			{
				link.hidden = true;
				link.remove();
			}
		});
	}

	function enforcePortalRole(role)
	{
		const path = (window.location.pathname || "").toLowerCase();
		const page = path.split("/").pop() || "";

		if (!role)
		{
			const protectedPage =
				page.startsWith("admin-") ||
				page.startsWith("teacher-") ||
				page.startsWith("student-");
			if (protectedPage)
			{
				window.location.replace("/login.html");
			}
			return;
		}

		if (page.startsWith("admin-") && role !== "admin")
		{
			window.location.replace(role === "teacher" ? "/teacher-dashboard.html" : "/student-dashboard.html");
		}
		else if (page.startsWith("teacher-") && role !== "teacher")
		{
			window.location.replace(role === "admin" ? "/admin-dashboard.html" : "/student-dashboard.html");
		}
		else if (page.startsWith("student-") && role !== "student")
		{
			window.location.replace(role === "admin" ? "/admin-dashboard.html" : "/teacher-dashboard.html");
		}
	}

	const bodyObserver = new MutationObserver(function()
	{
		const role = (localStorage.getItem("edubridge-role") || "").toLowerCase();
		if (role)
		{
			enforceRoleNavigation(role);
		}
	});

	if (document.body)
	{
		bodyObserver.observe(document.body, { childList: true, subtree: true });
	}
	else
	{
		document.addEventListener("DOMContentLoaded", function()
		{
			bodyObserver.observe(document.body, { childList: true, subtree: true });
		});
	}

	function parseResponse(response)
	{
		return response.json().catch(function()
		{
			return {};
		}).then(function(data)
		{
			if (!response.ok || !data.ok)
			{
				const error = new Error((data && data.error) || "The request could not be completed.");
				error.status = response.status;
				error.data = data;
				throw error;
			}
			return data;
		});
	}

	window.EduAPI =
	{
		get: function(path)
		{
			return fetch(path, { credentials: "same-origin" }).then(parseResponse);
		},
		post: function(path, body)
		{
			return fetch(path,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin",
				body: JSON.stringify(body || {})
			}).then(parseResponse);
		},
		me: function()
		{
			return fetch("/backend/api/auth_me.php", { credentials: "same-origin" })
			.then(function(response)
			{
				if (response.status === 401)
				{
					localStorage.removeItem("edubridge-role");
					enforcePortalRole(null);
					return { ok: true, user: null };
				}
				return response.json().catch(function() { return {}; }).then(function(data)
				{
					if (!response.ok)
					{
						const error = new Error((data && data.error) || "The session could not be verified.");
						error.status = response.status;
						throw error;
					}
					return data;
				});
			})
			.then(function(data)
			{
				if (data && data.user && data.user.role)
				{
					localStorage.setItem("edubridge-role", data.user.role);
					enforceRoleNavigation(data.user.role);
					enforcePortalRole(data.user.role);
				}
				else
				{
					localStorage.removeItem("edubridge-role");
					enforcePortalRole(null);
					return data;
				}

				return fetch("/backend/api/profile.php?action=get", { credentials: "same-origin" })
					.then(parseResponse)
					.then(function(profileData)
					{
						if (profileData.user && window.EduBridgeProfile)
						{
							window.EduBridgeProfile.applyProfile(profileData.user);
						}
						data.profile = profileData.user || null;
						return data;
					})
					.catch(function()
					{
						return data;
					});
			});
		}
	};

	if (document.readyState === "loading")
	{
		document.addEventListener("DOMContentLoaded", function()
		{
			window.EduAPI.me().catch(function() {});
		});
	}
	else
	{
		window.EduAPI.me().catch(function() {});
	}
})();
