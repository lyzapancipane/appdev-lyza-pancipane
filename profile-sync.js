const EduBridgeProfile = (function()
{
	const STORAGE_KEY = "edubridge-profile-pictures";
	const LEGACY_KEY = "edubridge-avatar";

	function accountForRole(role)
	{
		const normalized = (role || "").toLowerCase();

		if (normalized === "student" || normalized === "teacher")
		{
			return normalized;
		}

		return "admin";
	}

	function readPictures()
	{
		try
		{
			const raw = localStorage.getItem(STORAGE_KEY);
			const parsed = raw ? JSON.parse(raw) : {};

			if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
			{
				return parsed;
			}
		}
		catch (error)
		{
		}

		return {};
	}

	function writePictures(pictures)
	{
		if (Object.keys(pictures).length)
		{
			localStorage.setItem(STORAGE_KEY, JSON.stringify(pictures));
		}
		else
		{
			localStorage.removeItem(STORAGE_KEY);
		}
	}

	function savedPicture(role)
	{
		const account = accountForRole(role);
		const pictures = readPictures();

		if (pictures[account])
		{
			return pictures[account];
		}

		if (account === "admin")
		{
			return localStorage.getItem(LEGACY_KEY) || "";
		}

		return "";
	}

	function savePicture(role, dataUrl)
	{
		const account = accountForRole(role);
		const pictures = readPictures();

		pictures[account] = dataUrl;
		writePictures(pictures);

		if (account === "admin")
		{
			localStorage.removeItem(LEGACY_KEY);
		}
	}

	function clearPicture(role)
	{
		const account = accountForRole(role);
		const pictures = readPictures();

		delete pictures[account];
		writePictures(pictures);

		if (account === "admin")
		{
			localStorage.removeItem(LEGACY_KEY);
		}
	}

	function applyProfile(profile)
	{
		if (!profile || typeof profile !== "object")
		{
			return;
		}
		const role = (profile.role || "").toLowerCase();
		const displayName = (profile.nickname || "").trim() || profile.name || "";
		const navName = role === "student" ? profile.name || "" : displayName;
		const roleLabel = role === "admin" ? "Administrator" : (role === "teacher" ? "Teacher" : "Student");
		if (role === "student") prepareSharedStudentNavbar();

		document.querySelectorAll(".nav-profile").forEach(function(profileLink)
		{
			const name = profileLink.querySelector(".nav-profile-text strong");
			const roleText = profileLink.querySelector(".nav-profile-text small");
			const image = profileLink.querySelector("img");
			if (name && name.textContent !== navName) name.textContent = navName;
			if (roleText && roleText.textContent !== roleLabel) roleText.textContent = roleLabel;
			if (image)
			{
				const defaultSrc = image.dataset.profileDefaultSrc || image.getAttribute("src") || "";
				image.src = profile.avatar || defaultSrc;
				image.alt = navName;
				image.style.visibility = "";
			}
			if (name) name.style.visibility = "";
			if (roleText) roleText.style.visibility = "";
			profileLink.removeAttribute("aria-busy");
		});

		document.querySelectorAll("[data-profile-name]").forEach(function(element)
		{
			if (element.textContent !== displayName) element.textContent = displayName;
			element.style.visibility = "";
		});

		const studentWelcome = document.getElementById("studentWelcomeTitle");
		if (studentWelcome)
		{
			const welcome = "Welcome, " + displayName;
			if (studentWelcome.textContent !== welcome) studentWelcome.textContent = welcome;
		}

		const profileName = document.getElementById("profileName");
		if (profileName)
		{
			if (profileName.textContent !== displayName) profileName.textContent = displayName;
		}

		window.dispatchEvent(new CustomEvent("edubridge-profile-updated", { detail: profile }));
	}

	function prepareSharedStudentNavbar()
	{
		const page = location.pathname.split("/").pop();
		if (page.startsWith("student-") || document.body.classList.contains("student-shared-page")) return;
		const navbar = document.querySelector(".navbar");
		const buttons = navbar && navbar.querySelector(".nav-buttons, .nav-actions");
		const oldMenuButton = document.getElementById("menuButton");
		const menu = document.getElementById("accountMenu");
		if (!navbar || !buttons || !oldMenuButton || !menu) return;

		document.body.classList.add("student-shared-page");
		const stylesheet = document.createElement("link");
		stylesheet.rel = "stylesheet";
		stylesheet.href = "student-shell.css";
		document.head.appendChild(stylesheet);
		oldMenuButton.replaceWith(oldMenuButton.cloneNode(true));
		const oldProfile = buttons.querySelector(".nav-profile");
		const profile = document.createElement("button");
		profile.type = "button";
		profile.className = "nav-profile";
		profile.setAttribute("aria-label", "Open profile menu");
		profile.setAttribute("aria-haspopup", "true");
		profile.setAttribute("aria-controls", "studentProfileMenu");
		profile.setAttribute("aria-expanded", "false");
		const image = document.createElement("img");
		image.src = "student-avatar.svg";
		image.dataset.profileDefaultSrc = "student-avatar.svg";
		const text = document.createElement("span");
		text.className = "nav-profile-text";
		text.append(document.createElement("strong"), document.createElement("small"));
		profile.append(image, text);
		if (oldProfile) oldProfile.replaceWith(profile);
		else buttons.appendChild(profile);
		const bell = buttons.querySelector(".nav-bell");
		if (bell) bell.href = "student-notifications.html";
		const navLinks = navbar.querySelector(".nav-links");
		if (navLinks)
		{
			navLinks.replaceChildren();
			[["Home", "landingpage.html"], ["About EduBridge", "about.html"],
				["Announcements", "student-announcements.html"], ["FAQs", "student-faq.html"],
				["Inquiries", "student-myinquiries.html"], ["Contact", "contact.html"]]
				.forEach(function (item)
				{
					const link = document.createElement("a");
					link.href = item[1];
					link.textContent = item[0];
					if (page === item[1]) link.className = "active";
					navLinks.appendChild(link);
				});
		}
		const script = document.createElement("script");
		script.src = "student-nav.js";
		document.body.appendChild(script);
	}

	async function syncAuthenticatedProfile()
	{
		const response = await fetch("/backend/api/profile.php?action=get", { credentials: "same-origin" });
		const data = await response.json().catch(function() { return {}; });
		if (!response.ok || !data.ok)
		{
			throw new Error(data.error || "Profile information could not be loaded.");
		}
		applyProfile(data.user);
		return data.user;
	}

	function prepareProfileElements()
	{
		document.querySelectorAll(".nav-profile").forEach(function(profileLink)
		{
			const name = profileLink.querySelector(".nav-profile-text strong");
			const role = profileLink.querySelector(".nav-profile-text small");
			const image = profileLink.querySelector("img");
			if (name) { name.textContent = "Loading profile..."; name.style.visibility = ""; }
			if (role) { role.textContent = ""; role.style.visibility = ""; }
			if (image)
			{
				image.dataset.profileDefaultSrc = image.getAttribute("src") || "";
				image.src = "student-avatar.svg";
				image.alt = "Profile";
				image.style.visibility = "";
			}
			profileLink.setAttribute("aria-busy", "true");
		});

		document.querySelectorAll("[data-profile-name]").forEach(function(element)
		{
			element.style.visibility = "hidden";
		});
	}

	function hydrateProfile()
	{
		if (!document.querySelector(".nav-profile") && !document.querySelector("[data-profile-name]") &&
			!document.querySelector(".navbar .nav-buttons, .navbar .nav-actions"))
		{
			return;
		}

		syncAuthenticatedProfile().catch(function()
		{
			document.querySelectorAll(".nav-profile").forEach(function(profileLink)
			{
				const name = profileLink.querySelector(".nav-profile-text strong");
				const role = profileLink.querySelector(".nav-profile-text small");
				const image = profileLink.querySelector("img");
				if (name) name.textContent = "Profile unavailable";
				if (name) name.style.visibility = "";
				if (role) role.textContent = "";
				if (role) role.style.visibility = "";
				if (image)
				{
					image.src = image.dataset.profileDefaultSrc || image.getAttribute("src") || "";
					image.style.visibility = "";
				}
				profileLink.removeAttribute("aria-busy");
			});
			document.querySelectorAll("[data-profile-name]").forEach(function(element)
			{
				element.textContent = "Profile unavailable";
				element.style.visibility = "";
			});
		});
	}

	function initializeProfileSync()
	{
		prepareProfileElements();
		hydrateProfile();
	}

	if (document.readyState === "loading")
	{
		document.addEventListener("DOMContentLoaded", initializeProfileSync, { once: true });
	}
	else
	{
		initializeProfileSync();
	}

	return {
		account: accountForRole,
		savedPicture: savedPicture,
		savePicture: savePicture,
		clearPicture: clearPicture,
		applyProfile: applyProfile,
		syncAuthenticatedProfile: syncAuthenticatedProfile
	};
})();

window.EduBridgeProfile = EduBridgeProfile;
