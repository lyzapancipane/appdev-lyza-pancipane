(function ()
{
	"use strict";
	const form = document.getElementById("profileForm");
	const nickname = document.getElementById("nicknameInput");
	const bio = document.getElementById("bioInput");
	const avatar = document.getElementById("avatarInput");
	const cover = document.getElementById("coverInput");
	const save = document.getElementById("saveProfile");
	const reset = document.getElementById("resetProfile");
	const status = document.getElementById("profileStatus");
	const themeButton = document.getElementById("themeButton");
	const themeOptions = document.querySelectorAll("[data-theme-mode]");
	const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
	let themeMode = localStorage.getItem("edubridge-theme-mode");
	if (!["light", "dark", "system"].includes(themeMode))
	{
		themeMode = localStorage.getItem("edubridge-theme") === "dark" ? "dark" : "light";
	}

	function applyTheme()
	{
		const dark = themeMode === "system" ? themeMedia.matches : themeMode === "dark";
		document.body.classList.toggle("dark-mode", dark);
		themeButton.setAttribute("aria-label", dark ? "Use light theme" : "Use dark theme");
		themeOptions.forEach(function (option) { option.setAttribute("aria-pressed", String(option.dataset.themeMode === themeMode)); });
		localStorage.setItem("edubridge-theme", dark ? "dark" : "light");
	}
	function setThemeMode(mode)
	{
		themeMode = mode;
		localStorage.setItem("edubridge-theme-mode", mode);
		applyTheme();
	}
	applyTheme();
	themeButton.addEventListener("click", function () { setThemeMode(document.body.classList.contains("dark-mode") ? "light" : "dark"); });
	themeOptions.forEach(function (option) { option.addEventListener("click", function () { setThemeMode(option.dataset.themeMode); }); });
	themeMedia.addEventListener("change", function () { if (themeMode === "system") applyTheme(); });

	function readImage(input)
	{
		const file = input.files[0];
		if (!file) return Promise.resolve(null);
		if (!["image/jpeg", "image/png"].includes(file.type)) return Promise.reject(new Error("Use a JPG or PNG image."));
		if (file.size > 2 * 1024 * 1024) return Promise.reject(new Error("Images must be 2 MB or smaller."));
		return new Promise(function (resolve, reject)
		{
			const reader = new FileReader();
			reader.onload = function () { resolve(String(reader.result)); };
			reader.onerror = function () { reject(new Error("The selected image could not be read.")); };
			reader.readAsDataURL(file);
		});
	}
	function setStatus(message, error)
	{
		status.textContent = message;
		status.classList.toggle("error", error);
	}
	async function updateProfile(payload)
	{
		save.disabled = true;
		reset.disabled = true;
		setStatus("", false);
		try
		{
			const result = await EduAPI.post("/backend/api/profile.php?action=save", payload);
			nickname.value = result.user.nickname || "";
			bio.value = result.user.bio || "";
			avatar.value = "";
			cover.value = "";
			EduBridgeProfile.applyProfile(result.user);
			setStatus("Profile changes saved.", false);
		}
		catch (error) { setStatus(error.message || "Profile changes could not be saved.", true); }
		finally { save.disabled = false; reset.disabled = false; }
	}
	form.addEventListener("submit", async function (event)
	{
		event.preventDefault();
		save.disabled = true;
		try
		{
			const images = await Promise.all([readImage(avatar), readImage(cover)]);
			const payload = { nickname: nickname.value.trim(), bio: bio.value.trim() };
			if (images[0] !== null) payload.avatar = images[0];
			if (images[1] !== null) payload.cover = images[1];
			await updateProfile(payload);
		}
		catch (error) { setStatus(error.message, true); save.disabled = false; }
	});
	reset.addEventListener("click", function () { updateProfile({ nickname: "", bio: "", avatar: "", cover: "" }); });
	EduAPI.get("/backend/api/profile.php?action=get").then(function (data)
	{
		const user = data.user;
		if (!user || user.role !== "student") throw new Error("Student profile is unavailable.");
		nickname.value = user.nickname || "";
		bio.value = user.bio || "";
		document.getElementById("accountName").textContent = user.name || "Not available";
		document.getElementById("accountEmail").textContent = user.email || "Not available";
		document.getElementById("accountStudentId").textContent = user.studentId || "Not available";
		save.disabled = false;
		reset.disabled = false;
	}).catch(function (error)
	{
		document.getElementById("loadStatus").textContent = error.message || "Account settings could not be loaded.";
	});
})();
