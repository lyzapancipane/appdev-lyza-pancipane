.navbar .nav-profile {
	border: 0;
	padding: 0;
	background: transparent;
	color: inherit;
	cursor: pointer;
	font: inherit;
	text-align: left;
}
.navbar .nav-profile img { visibility: visible; }
.navbar .nav-profile-text {
	display: flex;
	flex-direction: column;
	line-height: 1.3;
	white-space: normal;
}
.navbar .nav-profile-text strong { color: white; font-size: 12px; }
.navbar .nav-profile-text small { color: #ffffff99; font-size: 10px; }
.student-shared-page .hero-notice[hidden] { display: none; }
.navbar .nav-profile:focus-visible, .student-profile-menu a:focus-visible {
	outline: 2px solid #c18cff;
	outline-offset: 3px;
}
.student-profile-menu {
	position: absolute;
	top: calc(100% - 1px);
	right: 36px;
	z-index: 1002;
	width: 210px;
	padding: 8px;
	border: 1px solid #ffffff25;
	border-radius: 6px;
	background: rgba(8, 5, 29, .97);
	box-shadow: 0 12px 28px rgba(0, 0, 0, .22);
}
.student-profile-menu[hidden] { display: none; }
.student-profile-menu a {
	display: block;
	padding: 10px;
	border-radius: 4px;
	color: white;
	font-size: 13px;
	text-decoration: none;
}
.student-profile-menu a:hover, .student-profile-menu a[aria-current="page"] { background: #7138c8; }
.account-menu {
	position: absolute;
	top: calc(100% - 1px);
	right: 36px;
	width: 264px;
	display: none;
	flex-direction: column;
	gap: 2px;
	padding: 8px;
	border: 1px solid #ffffff25;
	border-radius: 6px;
	background: rgba(8, 5, 29, .97);
	box-shadow: 0 12px 28px rgba(0, 0, 0, .22);
	z-index: 1001;
}
.navbar .account-menu { max-height: calc(100vh - 100px); overflow-y: auto; }
.navbar.menu-open .account-menu { display: flex; }
.account-menu-label { padding: 6px 10px; color: #ffffff80; font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.account-menu-item {
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;
	padding: 10px;
	border: 0;
	border-radius: 4px;
	background: none;
	color: #ffffffdd;
	font-family: inherit;
	font-size: 13px;
	text-align: left;
	text-decoration: none;
	cursor: pointer;
	transition: background .15s ease, color .15s ease;
}
.account-menu-item:hover, .account-menu-item:focus-visible { background: #ffffff10; color: #c58cff; }
.account-menu-divider { height: 1px; margin: 4px 0; background: #ffffff25; }
.navbar .account-menu-item[aria-current="page"] { background: #7138c8; color: white; }
.menu-button {
	display: inline-flex;
	width: 34px;
	height: 34px;
	padding: 0;
	align-items: center;
	justify-content: center;
	border: 1px solid #ffffff55;
	border-radius: 5px;
	background: #ffffff12;
	color: white;
	font: inherit;
	cursor: pointer;
	transition: .25s ease;
}
.menu-button:hover { background: #ffffff20; border-color: #ffffff88; transform: translateY(-2px) rotate(8deg); }
.menu-button:active { transform: scale(.88); }
.menu-button svg { width: 15px; height: 15px; fill: currentColor; }
.student-standalone .navbar {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 20;
	width: 100%;
	height: 88px;
	padding: 0 36px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: white;
	background: rgba(8, 5, 29, .82);
	box-sizing: border-box;
	transition: height .3s ease, background .3s ease, box-shadow .3s ease, backdrop-filter .3s ease;
}
.student-standalone .navbar.scrolled { height: 72px; background: rgba(8, 5, 29, .82); box-shadow: 0 8px 30px rgba(0, 0, 0, .18); backdrop-filter: blur(14px); }
.student-standalone .navbar .logo { display: flex; align-items: center; color: white; font-size: 18px; font-weight: 600; text-decoration: none; }
.student-standalone .navbar .logo img { width: 90px; height: 90px; object-fit: contain; }
.student-standalone .brand-bridge { color: #b77aff; }
.student-standalone .nav-links { display: flex; align-items: center; gap: 28px; font-size: 13px; }
.student-standalone .nav-links a { position: relative; color: #ffffffdd; text-decoration: none; transition: .2s; }
.student-standalone .nav-links a::after { position: absolute; right: 50%; bottom: -7px; left: 50%; height: 2px; border-radius: 10px; background: #b77aff; content: ""; transition: left .25s ease, right .25s ease; }
.student-standalone .nav-links a:hover, .student-standalone .nav-links a:focus-visible { color: #c58cff; }
.student-standalone .nav-links a:hover::after, .student-standalone .nav-links a:focus-visible::after { right: 0; left: 0; }
.student-standalone .nav-buttons { display: flex; align-items: center; gap: 10px; }
.student-standalone .navbar .theme-button,
.student-standalone .navbar .nav-bell {
	position: static;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	padding: 7px;
	border: 1px solid #ffffff55;
	border-radius: 4px;
	color: white;
	background: #ffffff10;
	cursor: pointer;
}
.student-standalone .navbar .theme-button svg, .student-standalone .navbar .nav-bell svg { width: 100%; height: 100%; fill: currentColor; }
.student-standalone .nav-profile { display: flex; align-items: center; gap: 8px; }
.student-standalone .nav-profile img { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; }
.student-standalone .nav-profile-text { display: flex; flex-direction: column; font-size: 12px; }
.student-standalone .nav-profile-text small { font-size: 10px; opacity: .7; }
@media (max-width: 1120px) {
	.navbar, .student-standalone .navbar,
	.navbar.scrolled, .student-standalone .navbar.scrolled {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-rows: 64px 32px;
		height: 96px;
	}
	.navbar > .logo { grid-column: 1; grid-row: 1; }
	.navbar > .nav-buttons, .navbar > .nav-actions { grid-column: 2; grid-row: 1; }
	.navbar .nav-links, .student-standalone .nav-links {
		display: flex;
		grid-column: 1 / -1;
		grid-row: 2;
		min-width: 0;
		gap: 18px;
		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;
		align-items: center;
		scrollbar-width: thin;
		scrollbar-color: #b77aff transparent;
	}
	.navbar .nav-links a { flex: none; }
	.navbar .nav-profile { display: flex; }
}
@media (max-width: 900px) {
	.student-standalone .navbar { padding: 0 20px; }
	.student-standalone .navbar .logo img { width: 70px; height: 70px; }
}
@media (max-width: 600px) {
	.navbar, .student-standalone .navbar { padding: 0 12px; }
	.navbar .logo img, .student-standalone .navbar .logo img { width: 42px; height: 42px; }
	.navbar .logo, .student-standalone .navbar .logo { font-size: 15px; }
	.navbar .nav-buttons, .navbar .nav-actions { gap: 5px; }
	.navbar .nav-links, .student-standalone .nav-links { gap: 10px; font-size: 10px; }
	.student-standalone .navbar .theme-button, .student-standalone .navbar .nav-bell { width: 34px; height: 34px; }
	.navbar .nav-profile { gap: 4px; min-width: 0; }
	.navbar .nav-profile img { width: 28px; height: 28px; flex: none; }
	.navbar .nav-profile-text { display: flex; width: min(23vw, 100px); overflow-wrap: anywhere; }
	.navbar .nav-profile-text strong { font-size: 10px; line-height: 1.15; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.navbar .nav-profile-text small { font-size: 9px; }
}
@media (max-width: 360px) {
	.navbar .logo img, .student-standalone .navbar .logo img { width: 30px; height: 30px; }
	.navbar .logo, .student-standalone .navbar .logo { font-size: 12px; }
	.navbar .nav-buttons, .navbar .nav-actions { gap: 3px; }
	.navbar .theme-button, .navbar .nav-bell, .navbar .menu-button,
	.student-standalone .navbar .theme-button, .student-standalone .navbar .nav-bell { width: 30px; height: 30px; }
	.navbar .nav-profile-text { width: 19vw; }
	.student-profile-menu { right: 12px; }
	.account-menu { right: 12px; left: 12px; width: auto; }
}
